import mime from "mime";
import fs from "node:fs";
import path from "node:path";
import "server-only";

export async function uploadFile(file: File): Promise<string> {
  const baseDir = process.cwd();
  const baseUploadDir = path.resolve(path.join(baseDir, "uploads"));
  const relativeUploadDir = path.join(
    baseUploadDir,
    new Date(Date.now())
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replaceAll(/\//g, "-")
  );
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${file.name.replace(
    /\.[^/.]+$/,
    ""
  )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!fs.existsSync(relativeUploadDir)) {
    fs.mkdirSync(relativeUploadDir, { recursive: true });
  }

  const finalFilePath = path.join(relativeUploadDir, filename);
  fs.writeFileSync(finalFilePath, buffer);

  const uploadApiUrl = "/api/upload";
  const fileUrl = path.join(
    uploadApiUrl,
    finalFilePath.replace(baseUploadDir, "")
  );
  return fileUrl;
}
