import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function UnsavedArticleDialog({ onCancel, onConfirm, show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-neutral-950/45 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <HiOutlineExclamationCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-black tracking-tight text-neutral-950">
            Discard this unsaved article?
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            If you go back now, this article will not be published or saved to
            the database. Any temporary editor data in this session will be
            discarded.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            onClick={onCancel}
          >
            Stay in editor
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            onClick={onConfirm}
          >
            Leave without saving
          </button>
        </div>
      </div>
    </div>
  );
}
