import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleEditorHeader from "../components/ArticleEditorHeader";

const PREVIEW_STORAGE_KEY = "atriaArticlePreview";
const WORDS_PER_MINUTE = 200;

const stripHtml = (html = "") => {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, " ");
  }

  const container = document.createElement("div");
  container.innerHTML = html;
  return container.textContent || container.innerText || "";
};

const getReadingTime = (content = "") => {
  const wordCount = stripHtml(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

const readStoredPreview = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PREVIEW_STORAGE_KEY) || "null");
  } catch (error) {
    return null;
  }
};

const formatPreviewDate = (date) => {
  if (!date) {
    return new Date().toLocaleDateString("en-GB");
  }

  return new Date(date).toLocaleDateString("en-GB");
};

export default function ArticlePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState(
    location.state?.previewData || readStoredPreview()
  );

  useEffect(() => {
    if (location.state?.previewData) {
      sessionStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify(location.state.previewData)
      );
      setPreviewData(location.state.previewData);
    }
  }, [location.state]);

  const readingTime = useMemo(
    () => getReadingTime(previewData?.content || ""),
    [previewData?.content]
  );

  const handleBackToEditor = () => {
    if (!previewData?.returnTo) {
      navigate("/dashboard?tab=dash");
      return;
    }

    navigate(previewData.returnTo, {
      state: {
        previewReturn: previewData.editorData || previewData,
      },
    });
  };

  if (!previewData) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-white px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black text-neutral-950">
            Preview unavailable
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            No article preview data was found. Return to the dashboard and open an
            article editor again.
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-[#367585] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f6674]"
            onClick={() => navigate("/dashboard?tab=dash")}
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex-1 bg-white">
      <ArticleEditorHeader
        breadcrumb={`${previewData.category || "No category"} / ${
          previewData.title || "Untitled article"
        }`}
        isPreviewDisabled={false}
        isPreviewing={false}
        lastEditedAt={previewData.savedAt || previewData.createdAt}
        onBack={handleBackToEditor}
        onPreview={() => {}}
        previewCurrent
        publishDisabled
      />

      <article className="mx-auto max-w-[740px] px-5 py-10 sm:px-6 lg:py-12">
        <header className="text-center">
          <h1 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-[-0.03em] text-neutral-950 sm:text-4xl">
            {previewData.title || "Untitled article"}
          </h1>

          {previewData.category && (
            <div className="mt-4">
              <span className="inline-flex rounded border border-neutral-500 px-3 py-1 text-xs font-medium text-neutral-600">
                {previewData.category}
              </span>
            </div>
          )}
        </header>

        {previewData.image && (
          <figure className="mt-7">
            <img
              src={previewData.image}
              alt={`${previewData.title || "Article"} cover`}
              className="h-auto max-h-[480px] w-full object-contain"
            />
          </figure>
        )}

        <div className="mt-5 flex items-center gap-5 border-b border-neutral-900 pb-4 text-sm font-medium text-neutral-950">
          <time dateTime={previewData.createdAt || new Date().toISOString()}>
            {formatPreviewDate(previewData.createdAt)}
          </time>
          <span>
            {readingTime} {readingTime === 1 ? "min" : "mins"} read
          </span>
        </div>

        {previewData.content ? (
          <div
            className="article-preview-content post-content mt-6 text-[15px] leading-7 text-neutral-950"
            dangerouslySetInnerHTML={{ __html: previewData.content }}
          />
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
            This preview has no article body yet.
          </p>
        )}
      </article>
    </main>
  );
}
