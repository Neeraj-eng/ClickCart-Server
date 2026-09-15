import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// 🔹 Check supported type
function isSupported(imageType, validTypes) {
  return validTypes.includes(imageType);
}

// 🔹 Upload using BUFFER (Vercel safe)
async function uploadCloudinary(file, folder, quality) {
  try {
    const options = {
      folder,
      resource_type: "auto",
    };

    if (quality) {
      options.quality = quality;
    }

    console.log("Uploading file (buffer)...");

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.log("Cloudinary ERROR:", error);
            return reject(error);
          }
          console.log("Upload success:", result);
          resolve(result);
        }
      );

      // 🔥 send buffer instead of temp file
      streamifier.createReadStream(file.data).pipe(stream);
    });

  } catch (error) {
    console.log("Cloudinary ERROR:", error);
    throw error;
  }
}

// 🔹 Middleware
export const imageupload = async (req, res, next) => {
  try {
    console.log("files", req.files);
    console.log("url", req.body.image);

    // ✅ If no file but image URL exists (update case)
    if (!req.files || !req.files.image) {
      if (req.body.image) {
        req.imageurl = req.body.image;
      }
      return next();
    }

    const file = req.files.image;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imageType = file.name.split(".").pop().toLowerCase();
    const validTypes = ["jpg", "png", "jpeg"];

    if (!isSupported(imageType, validTypes)) {
      return res.status(400).json({
        success: false,
        message: "This image type not supported",
      });
    }

    // 🔥 Upload (buffer based)
    const response = await uploadCloudinary(file, "neeraj", 70);

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    req.imageurl = response.secure_url;

    next();

  } catch (err) {
    console.log("image upload err", err);

    return res.status(400).json({
      message: err.message,
    });
  }
};