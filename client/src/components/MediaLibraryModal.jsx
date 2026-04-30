import { Alert, Button, Modal } from "flowbite-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiCheck, HiOutlineUpload } from "react-icons/hi";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_LABEL,
  uploadFileToR2,
} from "../utils/uploadFileToR2";
import {
  BoneyardPageSkeleton,
  MediaLibrarySkeleton,
} from "./PageSkeletons";

const TOAST_DURATION_MS = 3200;

function SelectionToast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[70] max-w-sm rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-xl">
      {message}
    </div>
  );
}

export default function MediaLibraryModal({
  allowedTypes = ["image", "video"],
  onClose,
  onSelect,
  show,
  title = "Select existing or upload image",
}) {
  const defaultFilter = allowedTypes.length === 1 ? allowedTypes[0] : "all";
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const uploadInputRef = useRef(null);

  const filterOptions = useMemo(() => {
    if (allowedTypes.length === 1) {
      return allowedTypes;
    }

    return ["all", ...allowedTypes];
  }, [allowedTypes]);

  const uploadAccept = useMemo(() => {
    const acceptedTypes = [];

    if (allowedTypes.includes("image")) {
      acceptedTypes.push("image/*");
    }

    if (allowedTypes.includes("video")) {
      acceptedTypes.push("video/*");
    }

    return acceptedTypes.join(",");
  }, [allowedTypes]);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryType = activeFilter === "all" ? "" : `?type=${activeFilter}`;
      const res = await fetch(`/api/media${queryType}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load media library");
      }

      const allowedMedia = (data.media || []).filter((item) =>
        allowedTypes.includes(item.mediaType)
      );
      setMediaItems(allowedMedia);
      setSelectedMedia((currentSelection) => {
        if (!currentSelection) {
          return null;
        }

        return allowedMedia.find((item) => item._id === currentSelection._id) || null;
      });
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!show) {
      return;
    }

    fetchMedia();
  }, [activeFilter, show]);

  useEffect(() => {
    if (!show) {
      setSelectedMedia(null);
      setError(null);
      setUploadProgress(null);
    }
  }, [show]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeout = setTimeout(() => setToastMessage(""), TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const formatFileSize = (size) => {
    if (!size) {
      return "";
    }

    const megabytes = size / (1024 * 1024);
    if (megabytes >= 1) {
      return `${megabytes.toFixed(1)} MB`;
    }

    return `${(size / 1024).toFixed(1)} KB`;
  };

  const handleUpload = async (file) => {
    if (!file) {
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError(`Each upload must be ${MAX_UPLOAD_SIZE_LABEL} or smaller.`);
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
      return;
    }

    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    if (!allowedTypes.includes(mediaType)) {
      setError(`Only ${allowedTypes.join(" or ")} uploads are allowed here.`);
      return;
    }

    try {
      setError(null);
      const publicUrl = await uploadFileToR2({
        file,
        folder: mediaType === "video" ? "editor-videos" : "posts",
        onProgress: setUploadProgress,
      });

      setUploadProgress(null);

      const queryType = activeFilter === "all" ? "" : `?type=${activeFilter}`;
      const res = await fetch(`/api/media${queryType}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload finished, but media refresh failed");
      }

      const allowedMedia = (data.media || []).filter((item) =>
        allowedTypes.includes(item.mediaType)
      );
      const uploadedMedia =
        allowedMedia.find((item) => item.url === publicUrl) || allowedMedia[0] || null;

      setMediaItems(allowedMedia);
      if (selectedMedia) {
        setError(
          "Upload complete. Uncheck the current media item before selecting a different one."
        );
        return;
      }

      setSelectedMedia(uploadedMedia);
    } catch (uploadError) {
      setError(uploadError.message || "Media upload failed");
      setUploadProgress(null);
    } finally {
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedMedia) {
      return;
    }

    setToastMessage(
      selectedMedia.mediaType === "image"
        ? "Cover image selected."
        : "Media selected."
    );
    onSelect(selectedMedia);
  };

  const handleMediaSelect = (item) => {
    if (selectedMedia?._id === item._id) {
      setSelectedMedia(null);
      setError(null);
      return;
    }

    if (selectedMedia) {
      setError(
        "Only one media item can be selected. Uncheck the current item before selecting another."
      );
      return;
    }

    setSelectedMedia(item);
    setError(null);
  };

  return (
    <>
      <Modal show={show} size="5xl" onClose={onClose} popup>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    size="xs"
                    color={activeFilter === filter ? "blue" : "gray"}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter === "all" ? "All" : `${filter}s`}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-500">
                  {selectedMedia ? "1/1 selected" : "0/1 selected"}
                </span>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept={uploadAccept}
                  className="hidden"
                  onChange={(event) => handleUpload(event.target.files?.[0])}
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => uploadInputRef.current?.click()}
                  disabled={uploadProgress}
                >
                  <HiOutlineUpload className="h-4 w-4" />
                  {uploadProgress ? `Uploading ${uploadProgress}%` : "Upload"}
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Upload guideline: image and video files are allowed, with a maximum of{" "}
              {MAX_UPLOAD_SIZE_LABEL} per upload.
            </p>

            {error && <Alert color="failure">{error}</Alert>}

            <BoneyardPageSkeleton
              name={`media-library-${activeFilter}`}
              loading={isLoading}
              fallback={<MediaLibrarySkeleton />}
            >
              {mediaItems.length === 0 ? (
                <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-gray-500">
                  No uploaded media found yet. Upload a file to add it here.
                </p>
              ) : (
                <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
                  {mediaItems.map((item) => {
                    const isSelected = selectedMedia?._id === item._id;
                    const isDimmed = selectedMedia && !isSelected;

                    return (
                      <button
                        key={item._id}
                        type="button"
                        className={`group relative overflow-hidden rounded-lg border bg-white text-left shadow-sm transition ${
                          isSelected
                            ? "border-[#367585] ring-2 ring-[#367585]/20"
                            : "border-gray-200 hover:border-[#367585]"
                        } ${isDimmed ? "opacity-45 grayscale" : "opacity-100"}`}
                        onClick={() => handleMediaSelect(item)}
                      >
                        <span
                          className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-[4px] border text-xs ${
                            isSelected
                              ? "border-[#367585] bg-[#367585] text-white"
                              : "border-white bg-white/90 text-transparent shadow-sm"
                          }`}
                        >
                          <HiCheck className="h-4 w-4" />
                        </span>

                        <div className="aspect-video bg-gray-100">
                          {item.mediaType === "image" ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="h-full w-full object-cover"
                              muted
                              preload="metadata"
                            />
                          )}
                        </div>
                        <div className="space-y-1 p-2">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.mediaType} {formatFileSize(item.size)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </BoneyardPageSkeleton>

            <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
              <button
                type="button"
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#367585] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f6674] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleConfirmSelection}
                disabled={!selectedMedia}
              >
                Select
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <SelectionToast message={toastMessage} />
    </>
  );
}
