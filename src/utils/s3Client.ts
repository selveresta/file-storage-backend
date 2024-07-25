import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (buffer: Buffer, fileName: string, metadata: AWS.S3.Metadata): Promise<AWS.S3.ManagedUpload.SendData> => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    Metadata: metadata
  };

  return await s3.upload(params).promise();
};

const downloadFromS3 = async (fileName: string): Promise<AWS.S3.GetObjectOutput> => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName
  };

  return await s3.getObject(params).promise();
};

export { uploadToS3, downloadFromS3 };
