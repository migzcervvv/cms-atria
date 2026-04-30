import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArticleEditorHeader from "../components/ArticleEditorHeader";
import {
  ArticleDocumentSkeleton,
  BoneyardPageSkeleton,
} from "../components/PageSkeletons";

const getReadTime = (content = "") => {
  const wordCount = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

const formatPostDate = (date) => {
  if (!date) {
    return "No date";
  }

  return new Date(date).toLocaleDateString("en-GB");
};

export default function PostPage() {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok || !data.posts?.[0]) {
          setError(data.message || "Article not found.");
          return;
        }

        setPost(data.posts[0]);
      } catch (fetchError) {
        setError("The article could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  if (loading) {
    return (
      <BoneyardPageSkeleton
        name="post-page"
        loading
        fallback={<ArticleDocumentSkeleton />}
      >
        <ArticleDocumentSkeleton />
      </BoneyardPageSkeleton>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-white px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black text-neutral-950">Article unavailable</h1>
          <p className="mt-2 text-sm text-neutral-500">{error || "This article does not exist."}</p>
          <Link
            to="/dashboard?tab=dash"
            className="mt-6 inline-flex rounded-lg bg-[#367585] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f6674]"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex-1 bg-white">
      <ArticleEditorHeader
        breadcrumb={`${post.category || "No category"} / ${
          post.title || "Untitled article"
        }`}
        isPreviewDisabled
        isPreviewing={false}
        lastEditedAt={post.updatedAt || post.createdAt}
        onBack={() => navigate("/dashboard?tab=dash")}
        onPublish={() => navigate(`/update-post/${post._id}`)}
        publishLabel="Edit article"
        showPreview={false}
      />

      <article className="mx-auto max-w-[740px] px-5 py-10 sm:px-6 lg:py-12">
        <header className="text-center">
          <h1 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-[-0.03em] text-neutral-950 sm:text-4xl">
            {post.title || "Untitled article"}
          </h1>

          {post.category && (
            <div className="mt-4">
              <span className="inline-flex rounded border border-neutral-500 px-3 py-1 text-xs font-medium text-neutral-600">
                {post.category}
              </span>
            </div>
          )}
        </header>

        {post.image && (
          <figure className="mt-7">
            <img
              src={post.image}
              alt={`${post.title || "Article"} cover`}
              className="h-auto max-h-[480px] w-full object-contain"
            />
          </figure>
        )}

        <div className="mt-5 flex items-center gap-5 border-b border-neutral-900 pb-4 text-sm font-medium text-neutral-950">
          <time dateTime={post.createdAt || new Date().toISOString()}>
            {formatPostDate(post.createdAt)}
          </time>
          <span>
            {getReadTime(post.content)} {getReadTime(post.content) === 1 ? "min" : "mins"} read
          </span>
        </div>

        {post.content ? (
          <div
            className="article-preview-content post-content mt-6 text-[15px] leading-7 text-neutral-950"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
            This article has no saved content yet.
          </p>
        )}
      </article>
    </main>
  );
}
