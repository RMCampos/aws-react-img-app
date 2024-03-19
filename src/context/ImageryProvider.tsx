import { useMemo } from "react";
import ImageryType from "../types/ImageryType";
import ImageryContext from "./ImageryContext";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { env } from '../env';

interface Props {
  children: React.ReactNode;
}

function getS3Client(): S3Client {
  console.log('import.meta.env.REACT_APP_AWS_REGION=', import.meta.env.REACT_APP_AWS_REGION);
  console.log('import.meta.env=', import.meta.env);
  const awsRegion = import.meta.env.REACT_APP_AWS_REGION ?? env.REACT_APP_AWS_REGION;
  console.log(`AWS Region: ${awsRegion}`);

  const config: S3ClientConfig = {
    region: awsRegion,
    credentials: {
      accessKeyId: env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
  };

  const client = new S3Client(config);
  return client;
}

function getBucketName(): string {
  const bucketName = env.REACT_APP_AWS_S3_BUCKET_NAME ?? '';
  console.log(`Amazon S3 bucket nam: ${bucketName}`);
  return bucketName;
}

const ImageryProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const getImages = async (): Promise<ImageryType[] | null> => {
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
      const contents :ImageryType[] = [];

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
        Contents?.forEach((content) => {
          if (content && content.Key) {
            const item: ImageryType = {
              name: content.Key,
              content: ''
            };

            contents.push(item);
          }
        });
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

  const handleUpload = async(item: ImageryType): Promise<void> => {
    const client = getS3Client();
    const bucketName = getBucketName();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: item.name,
      Body: item.content
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

  const getContent = async (key: string): Promise<ImageryType> => {
    const client = getS3Client();
    const bucketName = getBucketName();

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    try {
      const response = await client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      if (response.$metadata.httpStatusCode === 200) {
        const str = await response.Body?.transformToString() ?? '';
        return Promise.resolve({
          name: key,
          content: str
        });
      }
      return Promise.reject();
    } catch (e) {
      console.error(e);
      return Promise.reject();
    }
  };

  const deleteItem = async(key: string): Promise<void> => {
    const client = getS3Client();
    const bucketName = getBucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === 204) {
        return Promise.resolve();
      }
      return Promise.resolve();
    } catch (e) {
      console.error(e);
      return Promise.reject();
    }
  };

  const contextValue = useMemo(() => ({
    getImages,
    handleUpload,
    getContent,
    deleteItem,
  }), [getImages, handleUpload, getContent, deleteItem]);

  return (
    <ImageryContext.Provider value={contextValue}>
      { children }
    </ImageryContext.Provider>
  );
};

export default ImageryProvider;
