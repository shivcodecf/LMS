import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generateUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType, folder = "course-thumbnails" } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        message: "fileName and fileType are required",
      });
    }

    const extension = fileName.split(".").pop();

    // optional validation
    const allowedFolders = ["course-thumbnails", "lectures", "notes"];

    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        message: "Invalid folder",
      });
    }

    const key = `${folder}/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.status(200).json({
      signedUrl,
      key,
      fileUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to generate upload URL",
    });
  }
};
