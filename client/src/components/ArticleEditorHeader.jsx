import { useEffect, useState } from "react";
import { HiChevronLeft, HiOutlinePlay } from "react-icons/hi";

const getRelativeEditedLabel = (dateValue) => {
  if (!dateValue) {
    return "Edited just now";
  }

  const editedAt = new Date(dateValue).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - editedAt) / 1000));

  if (diffSeconds < 60) {
    return "Edited <1 minute ago";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `Edited ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Edited ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Edited ${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
};

export default function ArticleEditorHeader({
  breadcrumb,
  isPreviewDisabled,
  isPreviewing,
  lastEditedAt,
  onBack,
  onPublish,
  onPreview,
  previewCurrent = false,
  showPreview = true,
  publishDisabled = false,
  publishLabel = "Publish",
  previewLabel,
}) {
  const [editedLabel, setEditedLabel] = useState(
    getRelativeEditedLabel(lastEditedAt)
  );

  useEffect(() => {
    setEditedLabel(getRelativeEditedLabel(lastEditedAt));

    const interval = setInterval(() => {
      setEditedLabel(getRelativeEditedLabel(lastEditedAt));
    }, 30000);

    return () => clearInterval(interval);
  }, [lastEditedAt]);

  return (
    <div className="sticky top-0 z-20 grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-neutral-200 bg-white/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200"
          onClick={onBack}
          aria-label="Go back"
        >
          <HiChevronLeft className="h-5 w-5" />
        </button>
        <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
          {editedLabel}
        </span>
      </div>

      <div className="min-w-0 text-center text-xs font-semibold text-neutral-500">
        <span className="truncate">{breadcrumb}</span>
      </div>

      <div className="flex items-center justify-end gap-3">
        {showPreview && (
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              previewCurrent
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
            }`}
            onClick={onPreview}
            disabled={isPreviewDisabled || isPreviewing || previewCurrent}
          >
            <HiOutlinePlay className="h-4 w-4" />
            {isPreviewing ? "Preparing preview..." : previewLabel || "Preview"}
          </button>
        )}
        <button
          type={onPublish ? "button" : "submit"}
          className="rounded-md bg-[#367585] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2f6674] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={publishDisabled}
          onClick={onPublish}
        >
          {publishLabel}
        </button>
      </div>
    </div>
  );
}
