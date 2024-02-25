import { useMemo } from "react";
import ImageryType from "../types/ImageryType";
import ImageryContext from "./ImageryContext";
import { ListObjectsV2Command, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

interface Props {
  children: React.ReactNode;
}

function getS3Client(): S3Client {
  const awsRegion = import.meta.env.VITE_AWS_REGION;
  console.log(`AWS Region: ${awsRegion}`);

  const config: S3ClientConfig = {
    region: awsRegion,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    }
  };

  const client = new S3Client(config);
  return client;
}

function getBucketName(): string {
  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME ?? '';
  console.log(`Amazon S3 bucket nam: ${bucketName}`);
  return bucketName;
}

const ImageryProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const getImages = async (): Promise<string[] | null> => {
    const client = getS3Client();
    const bucketName = getBucketName();

    if (bucketName === '') {
      return Promise.reject();
    }
    
    // Docs: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    console.log(`Getting images from S3 bucket ${bucketName}!`);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 10,
    });

    try {
      let isTruncated: boolean | undefined = true;
      const contents :string[] = [];

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
        const contentList = Contents?.map((c) => ` - ${c.Key}`).join('\n');
        if (contentList) {
          contents.push(contentList);
        }
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }

      if (!contents) {
        console.log('No content found in the bucket!');
        return Promise.resolve(null);
      }
      
      return Promise.resolve(contents);
    } catch (e) {
      console.error(e);
    }

    return Promise.reject();
  };

  const handleUpload = async(newImages: ImageryType[]): Promise<void> => {
    console.log('add images!');
    console.log(`${newImages.length} to send!`);

    const client = getS3Client();
    const bucketName = getBucketName();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: newImages[0].name,
      Body: newImages[0].name
    });

    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        return Promise.resolve();
      }
      return Promise.reject();
    } catch (e) {
      console.error(e);
      return Promise.reject();
    }
  };

  const contextValue = useMemo(() => ({
    getImages,
    handleUpload
  }), [getImages, handleUpload]);

  return (
    <ImageryContext.Provider value={contextValue}>
      { children }
    </ImageryContext.Provider>
  );
};

export default ImageryProvider;
