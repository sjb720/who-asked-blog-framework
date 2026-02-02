import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const bucket = process.env.S3_BUCKET!;
// Use image proxy URL if set, otherwise fall back to direct S3 URL
const imageBaseUrl = process.env.IMAGE_PROXY_URL || `${process.env.S3_PUBLIC_URL}/${bucket}`;

let bucketChecked = false;

async function ensureBucket() {
  if (bucketChecked) return;

  console.log("Checking bucket:", bucket, "at endpoint:", process.env.S3_ENDPOINT);

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log("Bucket exists");
  } catch (error: any) {
    console.log("Bucket check error:", error.name, error.message);
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      console.log("Creating bucket:", bucket);
      await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));

      // Set public read policy
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      };
      await s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: bucket,
          Policy: JSON.stringify(policy),
        })
      );
      console.log("Bucket policy set to public read");
    } else {
      throw error;
    }
  }

  bucketChecked = true;
}

export async function uploadFile(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  await ensureBucket();

  const key = `${Date.now()}-${filename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${imageBaseUrl}/${key}`;
}

export async function deleteFile(url: string): Promise<void> {
  // Handle both proxy URLs (/api/images/key) and direct S3 URLs
  let key: string | undefined;

  if (url.includes("/api/images/")) {
    key = url.split("/api/images/")[1];
  } else if (url.includes(`/${bucket}/`)) {
    key = url.split(`/${bucket}/`)[1];
  }

  if (!key) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

export { s3Client, bucket };
