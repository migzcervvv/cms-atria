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

const formatArticleDate = (date) => {
  if (!date) {
    return new Date().toLocaleDateString("en-GB");
  }

  return new Date(date).toLocaleDateString("en-GB");
};

export default function ArticlePreviewDocument({
  category,
  content,
  date,
  image,
  title,
}) {
  const readingTime = getReadingTime(content);

  return (
    <article className="mx-auto max-w-[740px] px-5 py-10 sm:px-6 lg:py-12">
      <header className="text-center">
        <h1 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-[-0.03em] text-neutral-950 sm:text-4xl">
          {title || "Untitled article"}
        </h1>

        {category && (
          <div className="mt-4">
            <span className="inline-flex rounded border border-neutral-500 px-3 py-1 text-xs font-medium text-neutral-600">
              {category}
            </span>
          </div>
        )}
      </header>

      {image && (
        <figure className="mt-7">
          <img
            src={image}
            alt={`${title || "Article"} cover`}
            className="h-auto max-h-[480px] w-full object-contain"
          />
        </figure>
      )}

      <div className="mt-5 flex items-center gap-5 border-b border-neutral-900 pb-4 text-sm font-medium text-neutral-950">
        <time dateTime={date || new Date().toISOString()}>
          {formatArticleDate(date)}
        </time>
        <span>
          {readingTime} {readingTime === 1 ? "min" : "mins"} read
        </span>
      </div>

      {content ? (
        <div
          className="article-preview-content post-content mt-6 text-[15px] leading-7 text-neutral-950"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
          This preview has no article body yet.
        </p>
      )}
    </article>
  );
}
