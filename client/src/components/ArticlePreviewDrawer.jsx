import { HiChevronLeft } from "react-icons/hi";
import { useEffect, useState } from "react";
import ArticlePreviewDocument from "./ArticlePreviewDocument";

export default function ArticlePreviewDrawer({
  article,
  onClose,
  show,
}) {
  const [isMounted, setIsMounted] = useState(show);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsMounted(true);
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timeout = setTimeout(() => setIsMounted(false), 260);
    return () => clearTimeout(timeout);
  }, [show]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[70] bg-neutral-950/30 transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Article preview"
    >
      <aside
        className={`ml-auto flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-neutral-200 bg-white/95 px-4 backdrop-blur">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#367585]/30"
            onClick={onClose}
            aria-label="Back to editor"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ArticlePreviewDocument
            category={article.category}
            content={article.content}
            date={article.date}
            image={article.image}
            title={article.title}
          />
        </div>
      </aside>
    </div>
  );
}
