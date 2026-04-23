const uploadWithProgress = ({ file, folder, onProgress }) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/image");
    xhr.setRequestHeader("Content-Type", file.type);
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
      reject(new Error(responseData?.message || "Image upload failed"));
    };

    xhr.onerror = () => reject(new Error("Image upload failed"));
    xhr.send(file);
  });

export const uploadFileToR2 = async ({ file, folder, onProgress }) => {
  if (!file) {
    throw new Error("Please select an image");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed");
  }

  const uploadResponse = await uploadWithProgress({
    file,
    folder,
    onProgress,
  });

  return uploadResponse.publicUrl;
};
