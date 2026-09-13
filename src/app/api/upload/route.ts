import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum allowed size is 25MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Cloud storage adapter support (e.g. Cloudinary)
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      // If external credentials exist, send to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", base64Data);
      cloudinaryFormData.append("upload_preset", "vibechat_preset");

      try {
        const cldRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
          { method: "POST", body: cloudinaryFormData }
        );
        if (cldRes.ok) {
          const cldData = await cldRes.json();
          return NextResponse.json({
            fileUrl: cldData.secure_url,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          });
        }
      } catch (err) {
        console.warn("Cloudinary upload failed, falling back to secure data uri", err);
      }
    }

    // Default fast in-memory / data URL storage
    return NextResponse.json({
      fileUrl: base64Data,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
