import mime from "mime";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ paths: string[] }> }
) {
  const p = await params;
  const filePath = path.join(...p.paths);
  const baseDir = process.cwd();
  const baseUploadDir = path.resolve(path.join(baseDir, "uploads"));
  const fullFilePath = path.join(baseUploadDir, filePath);

  if (!fs.existsSync(fullFilePath)) {
    return NextResponse.json({
      status: "error",
      error: "File tidak ditemukan",
    });
  }

  const file = fs.readFileSync(fullFilePath);
  const mimeType = mime.getType(fullFilePath) || "application/octet-stream";

  const headers = new Headers();
  headers.set("Content-Type", mimeType);
  headers.set(
    "Content-Disposition",
    `inline; filename="${path.basename(fullFilePath)}"`
  );

  return new NextResponse(file, {
    status: 200,
    headers,
  });
}
