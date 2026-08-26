import { api, ApiError } from "./api";

/**
 * Uploads a single file straight to Cloudinary using a short-lived signature
 * from our API (server/routes/uploads.js). The Cloudinary API secret never
 * touches the browser. Resolves with the resulting secure HTTPS image URL.
 */
export function uploadImageToCloudinary(file, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    api
      .post("/uploads/sign", {}, { auth: true })
      .then(({ timestamp, signature, apiKey, cloudName, folder }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
              resolve(data.secure_url);
            } else {
              reject(new Error(data.error?.message || "Cloudinary upload failed."));
            }
          } catch {
            reject(new Error("Unexpected response from Cloudinary."));
          }
        };
        xhr.onerror = () => reject(new Error("Network error while uploading image."));
        xhr.send(formData);
      })
      .catch((err) => {
        reject(err instanceof ApiError ? err : new Error("Could not start the image upload."));
      });
  });
}
