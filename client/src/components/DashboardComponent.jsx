import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiCheckCircle,
  HiClock,
  HiDotsVertical,
  HiDuplicate,
  HiExclamationCircle,
  HiEye,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiPencil,
  HiPlus,
  HiTrash,
  HiUser,
  HiX,
} from "react-icons/hi";
import { TbArrowsSort, TbAdjustmentsHorizontal } from "react-icons/tb";
import ArticleSetupModal from "./ArticleSetupModal";
import {
  BoneyardPageSkeleton,
  DashboardArticlesSkeleton,
} from "./PageSkeletons";

const TOAST_DURATION_MS = 5000;

const stripHtml = (html) => html?.replace(/<[^>]*>/g, " ").trim() || "";

const getRelativeTime = (dateValue) => {
  const date = new Date(dateValue);
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, seconds] of units) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

const getAuditVerb = (post) => {
  const createdAt = new Date(post.createdAt).getTime();
  const updatedAt = new Date(post.updatedAt).getTime();
  return updatedAt > createdAt ? "Updated" : "Created";
};

function Toast({ duration, toast }) {
  if (!toast) {
    return null;
  }

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow-2xl">
      <div className="flex gap-3 px-4 py-4">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isError ? "bg-red-50 text-red-600" : "bg-[#367585]/10 text-[#367585]"
          }`}
        >
          {isError ? (
            <HiExclamationCircle className="h-5 w-5" />
          ) : (
            <HiCheckCircle className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold">{toast.title}</p>
          <p className="mt-1 text-sm leading-5 text-neutral-600">
            {toast.description}
          </p>
        </div>
      </div>
      <div className="h-1 bg-neutral-100">
        <div
          key={toast.id}
          className={`h-full ${isError ? "bg-red-600" : "bg-[#367585]"}`}
          style={{ animation: `toast-progress ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

function ArticleMenu({ menuPosition = "top", onDelete, onDuplicate, post }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuPositionClass =
    menuPosition === "bottom" ? "bottom-11 right-0" : "right-0 top-10";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="rounded-md p-1.5 text-neutral-500 outline-none transition hover:text-[#367585] focus:ring-2 focus:ring-[#367585]/30"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((value) => !value);
        }}
        aria-label="Article actions"
      >
        <HiDotsVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className={`absolute z-20 w-44 rounded-lg border border-neutral-200 bg-white p-1 text-sm shadow-lg ${menuPositionClass}`}>
          <Link
            to={`/post/${post.slug}`}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            <HiEye className="h-4 w-4" />
            View
          </Link>
          <Link
            to={`/update-post/${post._id}`}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            <HiPencil className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-neutral-700 hover:bg-neutral-100"
            onClick={() => {
              setIsOpen(false);
              onDuplicate(post);
            }}
          >
            <HiDuplicate className="h-4 w-4" />
            Duplicate
          </button>
          <div className="my-1 h-px bg-neutral-200" />
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50"
            onClick={() => {
              setIsOpen(false);
              onDelete(post);
            }}
            aria-label="Delete article"
          >
            <HiTrash className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex w-fit rounded-full border border-[#367585] px-2.5 py-1 text-xs font-medium text-[#367585]">
      {category || "Uncategorized"}
    </span>
  );
}

function ArticleCard({ onDelete, onDuplicate, post }) {
  const auditVerb = getAuditVerb(post);
  const relativeTime = getRelativeTime(post.updatedAt || post.createdAt);
  const viewPath = `/post/${post.slug}`;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-200 hover:border-[#367585]">
      <Link to={viewPath} className="block aspect-video bg-neutral-950">
        {post.image ? (
          <img
            src={post.image}
            alt={`${post.title} cover image`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold tracking-widest text-[#2cb8d4]">
            ATRIA CMS
          </div>
        )}
      </Link>

      <div className="space-y-3 p-4">
        <Link to={viewPath}>
          <h2
            className="line-clamp-2 text-lg font-bold leading-tight text-neutral-950 hover:underline"
            title={post.title}
          >
            {post.title}
          </h2>
        </Link>

        <CategoryBadge category={post.category} />

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 text-xs text-neutral-500">
            <p className="flex items-center gap-2">
              <HiUser className="h-4 w-4" />
              {auditVerb} by Admin
            </p>
            <p className="flex items-center gap-2">
              <HiClock className="h-4 w-4" />
              {auditVerb === "Updated" ? "Edited" : "Created"} {relativeTime} by Admin
            </p>
          </div>
          <ArticleMenu
            menuPosition="bottom"
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            post={post}
          />
        </div>
      </div>
    </article>
  );
}

function ArticleRow({ onDelete, onDuplicate, post }) {
  const auditVerb = getAuditVerb(post);
  const relativeTime = getRelativeTime(post.updatedAt || post.createdAt);
  const viewPath = `/post/${post.slug}`;

  return (
    <article className="group flex items-center gap-4 border-b border-neutral-200 py-4 transition hover:bg-neutral-50">
      <Link to={viewPath} className="h-[60px] w-20 shrink-0 rounded-md bg-neutral-950">
        {post.image ? (
          <img
            src={post.image}
            alt={`${post.title} thumbnail`}
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md text-xs font-black text-white">
            ATRIA
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={viewPath}>
          <h2 className="truncate text-sm font-bold text-neutral-950 hover:underline" title={post.title}>
            {post.title}
          </h2>
        </Link>
        <div className="mt-2">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      <div className="hidden w-44 text-xs text-neutral-500 md:block">
        <p>{auditVerb} by Admin</p>
        <p>{relativeTime}</p>
      </div>

      <ArticleMenu onDelete={onDelete} onDuplicate={onDuplicate} post={post} />
    </article>
  );
}

export default function DashboardComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPanel, setOpenPanel] = useState(null);
  const [pendingDeletePost, setPendingDeletePost] = useState(null);
  const [showArticleSetup, setShowArticleSetup] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchDraft, setSearchDraft] = useState("");
  const gridRef = useRef(null);

  const showToast = (nextToast) => {
    setToast({
      id: `${Date.now()}-${Math.random()}`,
      type: "success",
      ...nextToast,
    });
  };

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const search = params.get("search") || "";
  const selectedCategories = params.get("category")
    ? params.get("category").split(",").filter(Boolean)
    : [];
  const sort = params.get("sort") || "newest";
  const view = params.get("view") || localStorage.getItem("dashboardArticleView") || "grid";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/post/getposts?limit=100");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    if (view) {
      localStorage.setItem("dashboardArticleView", view);
    }
  }, [view]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchDraft === search) {
        return;
      }

      updateParam("search", searchDraft);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchDraft, search]);

  useEffect(() => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.search]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [toast]);

  const categories = useMemo(
    () => [...new Set(posts.map((post) => post.category).filter(Boolean))],
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return posts
      .filter((post) => {
        const matchesSearch =
          !normalizedSearch ||
          post.title?.toLowerCase().includes(normalizedSearch) ||
          post.category?.toLowerCase().includes(normalizedSearch);
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(post.category);

        return matchesSearch && matchesCategory;
      })
      .sort((firstPost, secondPost) => {
        if (sort === "oldest") {
          return new Date(firstPost.createdAt) - new Date(secondPost.createdAt);
        }

        if (sort === "updated") {
          return new Date(secondPost.updatedAt) - new Date(firstPost.updatedAt);
        }

        return new Date(secondPost.createdAt) - new Date(firstPost.createdAt);
      });
  }, [posts, search, selectedCategories, sort]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(location.search);

    if (!value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    navigate(`/dashboard?${nextParams.toString()}`, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchDraft("");
    navigate("/dashboard?tab=dash&sort=newest&view=grid", { replace: true });
  };

  const toggleCategory = (category) => {
    const nextCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    updateParam("category", nextCategories.join(","));
  };

  const handleDeletePost = async () => {
    if (!pendingDeletePost) {
      return;
    }

    try {
      const res = await fetch(
        `/api/post/deletepost/${pendingDeletePost._id}/${currentUser._id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== pendingDeletePost._id)
      );
      showToast({
        title: "Article deleted",
        description: `"${pendingDeletePost.title}" was permanently removed from the CMS article list.`,
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Delete failed",
        description: `We could not remove "${pendingDeletePost.title}". Please check your admin session and try again.`,
      });
    } finally {
      setPendingDeletePost(null);
    }
  };

  const handleDuplicatePost = async (post) => {
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: `${post.title} Copy`,
          content: post.content,
          category: post.category,
          image: post.image,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to duplicate");
      }

      setPosts((previousPosts) => [data, ...previousPosts]);
      showToast({
        title: "Article duplicated",
        description: `"${post.title}" was copied successfully and added to the article list. Review the copy before publishing final changes.`,
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Duplicate failed",
        description: `The CMS could not create a copy of "${post.title}". Please try again or confirm the post still has a valid category.`,
      });
    }
  };

  const sortOptions = [
    ["newest", "Newest First"],
    ["oldest", "Oldest First"],
    ["updated", "Recently Updated"],
  ];

  const handleStartArticle = (setupData) => {
    sessionStorage.setItem("atriaArticleSetup", JSON.stringify(setupData));
    setShowArticleSetup(false);
    navigate("/create-post", {
      state: {
        articleSetup: setupData,
      },
    });
  };

  return (
    <main className="min-h-screen flex-1 bg-white px-6 py-6">
      <div className="mx-auto max-w-7xl" ref={gridRef}>
        <header className="border-b border-neutral-200 pb-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="text-3xl font-black tracking-tight text-neutral-950">
              ATRIA CMS
            </h1>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#367585] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f6674] focus:outline-none focus:ring-2 focus:ring-[#367585]/30"
              onClick={() => setShowArticleSetup(true)}
            >
              <HiPlus className="h-5 w-5" />
              New Article
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                aria-label="Search articles"
                placeholder="Search articles..."
                className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#367585] focus:ring-2 focus:ring-[#367585]/20"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
              />
              {searchDraft && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-neutral-400 hover:text-neutral-950"
                  onClick={() => setSearchDraft("")}
                  aria-label="Clear search"
                >
                  <HiX className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-[#367585]/30 ${
                    openPanel === "filter"
                      ? "border-[#367585] bg-[#367585] text-white"
                      : "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
                  onClick={() => setOpenPanel(openPanel === "filter" ? null : "filter")}
                  aria-label="Filter articles by category"
                >
                  <TbAdjustmentsHorizontal className="h-5 w-5" />
                  {selectedCategories.length > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
                  )}
                </button>

                {openPanel === "filter" && (
                  <div className="absolute right-0 top-12 z-30 w-64 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg">
                    <p className="text-sm font-semibold text-neutral-950">
                      Filter by Category
                    </p>
                    <div className="mt-3 space-y-2">
                      {categories.length === 0 ? (
                        <p className="text-sm text-neutral-500">No categories found.</p>
                      ) : (
                        categories.map((category) => (
                          <label key={category} className="flex items-center gap-2 text-sm text-neutral-700">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-300 text-[#367585] focus:ring-[#367585]/30"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleCategory(category)}
                            />
                            {category}
                          </label>
                        ))
                      )}
                    </div>
                    <button
                      type="button"
                      className="mt-4 text-sm font-medium text-[#367585] hover:underline"
                      onClick={() => updateParam("category", "")}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-[#367585]/30 ${
                    openPanel === "sort"
                      ? "border-[#367585] bg-[#367585] text-white"
                      : "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
                  onClick={() => setOpenPanel(openPanel === "sort" ? null : "sort")}
                  aria-label="Sort articles"
                >
                  <TbArrowsSort className="h-5 w-5" />
                </button>

                {openPanel === "sort" && (
                  <div className="absolute right-0 top-12 z-30 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
                    {sortOptions.map(([value, label]) => (
                      <label
                        key={value}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <input
                          type="radio"
                          name="article-sort"
                          className="text-[#367585] focus:ring-[#367585]/30"
                          checked={sort === value}
                          onChange={() => {
                            updateParam("sort", value);
                            setOpenPanel(null);
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex rounded-lg border border-neutral-200 p-1">
                <button
                  type="button"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                    view === "grid"
                      ? "bg-[#367585] text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                  onClick={() => updateParam("view", "grid")}
                  aria-label="Show grid view"
                >
                  <HiOutlineViewGrid className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                    view === "list"
                      ? "bg-[#367585] text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                  onClick={() => updateParam("view", "list")}
                  aria-label="Show list view"
                >
                  <HiOutlineViewList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-5">
          <p className="mb-4 text-sm font-semibold text-neutral-950">
            {filteredPosts.length} content
          </p>

          <BoneyardPageSkeleton
            name={`dashboard-articles-${view}`}
            loading={isLoading}
            fallback={<DashboardArticlesSkeleton view={view} />}
          >
            {filteredPosts.length === 0 ? (
              <div className="flex min-h-80 animate-[fadeIn_0.2s_ease-out] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 text-center">
                <HiOutlineSearch className="h-12 w-12 text-neutral-300" />
                <h2 className="mt-4 text-lg font-bold text-neutral-950">
                  No articles found
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Try adjusting your search or clearing your filters
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-lg border border-[#367585] px-4 py-2 text-sm font-semibold text-[#367585] transition hover:bg-[#367585] hover:text-white"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="transition duration-200">
                {view === "list" ? (
                  <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                    {filteredPosts.map((post) => (
                      <ArticleRow
                        key={post._id}
                        onDelete={setPendingDeletePost}
                        onDuplicate={handleDuplicatePost}
                        post={post}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredPosts.map((post) => (
                      <ArticleCard
                        key={post._id}
                        onDelete={setPendingDeletePost}
                        onDuplicate={handleDuplicatePost}
                        post={post}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </BoneyardPageSkeleton>
        </section>
      </div>

      {pendingDeletePost && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-neutral-950">
              Delete this article?
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              This action cannot be undone. The article will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                onClick={() => setPendingDeletePost(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ArticleSetupModal
        show={showArticleSetup}
        onClose={() => setShowArticleSetup(false)}
        onContinue={handleStartArticle}
      />
      <Toast duration={TOAST_DURATION_MS} toast={toast} />
    </main>
  );
}
