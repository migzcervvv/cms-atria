export const MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_UPLOAD_SIZE_LABEL = "100MB";

const uploadWithProgress = ({ file, folder, onProgress }) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/media");
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("X-File-Name", file.name);
    xhr.setRequestHeader("X-Upload-Folder", folder || "uploads");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }
      const progress = (event.loaded / event.total) * 100;
      onProgress(progress.toFixed(0));
    };

    xhr.onload = () => {
      let responseData = null;
      try {
        responseData = JSON.parse(xhr.responseText);
      } catch (error) {
        responseData = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(responseData);
        return;
      }
      reject(new Error(responseData?.message || "Media upload failed"));
    };

    xhr.onerror = () => reject(new Error("Media upload failed"));
    xhr.send(file);
  });

export const uploadFileToR2 = async ({ file, folder, onProgress }) => {
  if (!file) {
    throw new Error("Please select a file");
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(`Each upload must be ${MAX_UPLOAD_SIZE_LABEL} or smaller.`);
  }

  const fileType = file.type || "";
  const lowerCaseName = file.name.toLowerCase();
  const supportedExtensionPattern =
    /\.(avif|gif|jpe?g|mov|mp4|png|svg|webm|webp)$/;
  const isSupportedMedia =
    fileType.startsWith("image/") ||
    fileType.startsWith("video/") ||
    supportedExtensionPattern.test(lowerCaseName);

  if (!isSupportedMedia) {
    throw new Error("Only image and video uploads are allowed");
  }

  const uploadResponse = await uploadWithProgress({
    file,
    folder,
    onProgress,
  });

  if (!uploadResponse?.publicUrl) {
    throw new Error("Upload finished but no public URL was returned");
  }

  return uploadResponse.publicUrl;
};
