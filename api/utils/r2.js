import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const requiredEnvVars = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "R2_PUBLIC_BASE_URL",
  "R2_ENDPOINT",
];

const sanitizeFileName = (fileName) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");

export const ensureR2Config = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing R2 environment variables: ${missing.join(", ")}`);
  }
};

export const getR2Client = () => {
  ensureR2Config();

  return new S3Client({
    region: process.env.R2_REGION || "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
};

export const createObjectKey = ({ folder = "uploads", fileName }) => {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "");
  const safeFileName = sanitizeFileName(fileName || "upload");

  return `${safeFolder}/${Date.now()}-${randomUUID()}-${safeFileName}`;
};

export const uploadObjectToR2 = async ({ key, contentType, body }) => {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
    Body: body,
  });

  await client.send(command);
  const baseUrl = process.env.R2_PUBLIC_BASE_URL.replace(/\/+$/g, "");

  return `${baseUrl}/${key}`;
};
