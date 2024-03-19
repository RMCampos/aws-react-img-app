import { useMemo } from "react";
import ImageryType from "../types/ImageryType";
import ImageryContext from "./ImageryContext";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { env } from '../env';

interface Props {
  children: React.ReactNode;
}

function getS3Client(): S3Client {
  const awsRegion = import.meta.env.REACT_APP_AWS_REGION ?? env.REACT_APP_AWS_REGION;
  console.log(`[Config] Amazon Region: ${awsRegion}`);

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
  console.log(`[Config] Amazon S3 Bucket name: ${bucketName}`);
  return bucketName;
}

const ImageryProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const getImages = async (): Promise<ImageryType[] | null> => {
    // Docs: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    console.log('Getting text files from S3 Bucket...');

    const client = getS3Client();
    const bucketName = getBucketName();

    if (!bucketName) {
      console.log('Bucket name not set up! Leaving!');
      return Promise.reject();
    }
    
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
        console.log('No content found in the Bucket!');
        return Promise.resolve(null);
      }

      console.log(`${contents.length} item(ns) found in the Bucket!`);
      
      return Promise.resolve(contents);
    } catch (e) {
      console.error(e);
    }

    return Promise.reject();
  };

  const handleUpload = async(item: ImageryType): Promise<void> => {
    console.log('Uploading text files to S3 Bucket...');

    const client = getS3Client();
    const bucketName = getBucketName();

    if (!bucketName) {
      console.log('Bucket name not set up! Leaving!');
      return Promise.reject();
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: item.name,
      Body: item.content
    });

    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        console.log('Text file successfully uploaded!');
        return Promise.resolve();
      }

      console.log('An error ocurred when trying to upload file!');
      return Promise.reject();
    } catch (e) {
      console.error(e);
      return Promise.reject();
    }
  };

  const getContent = async (key: string): Promise<ImageryType> => {
    console.log('Getting specific text file content from S3 Bucket...');

    const client = getS3Client();
    const bucketName = getBucketName();

    if (!bucketName) {
      console.log('Bucket name not set up! Leaving!');
      return Promise.reject();
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    try {
      const response = await client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      if (response.$metadata.httpStatusCode === 200) {
        const str = await response.Body?.transformToString() ?? '';
        console.log('Text file content successfully retrieved!');
        return Promise.resolve({
          name: key,
          content: str
        });
      }
      console.log('An error ocurred when trying to get the file content!');
      return Promise.reject();
    } catch (e) {
      console.error(e);
      return Promise.reject();
    }
  };

  const deleteItem = async(key: string): Promise<void> => {
    console.log('Deleting text file from S3 Bucket...');

    const client = getS3Client();
    const bucketName = getBucketName();

    if (!bucketName) {
      console.log('Bucket name not set up! Leaving!');
      return Promise.reject();
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === 204) {
        console.log('Text file successfully deleted!');
        return Promise.resolve();
      }

      console.log('An error ocurred when trying to delete the file!');
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
