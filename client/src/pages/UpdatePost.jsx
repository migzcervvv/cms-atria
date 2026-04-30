import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArticleEditorHeader from "../components/ArticleEditorHeader";
import ArticlePreviewDrawer from "../components/ArticlePreviewDrawer";
import BlockNoteTextEditor from "../components/BlockNoteTextEditor";
import CoverImageEditor from "../components/CoverImageEditor";
import {
  ArticleEditorSkeleton,
  BoneyardPageSkeleton,
} from "../components/PageSkeletons";
import UnsavedArticleDialog from "../components/UnsavedArticleDialog";

const hasMeaningfulBody = (content = "") => {
  if (!content) {
    return false;
  }

  const container = document.createElement("div");
  container.innerHTML = content;
  const text = container.textContent?.trim() || "";
  return Boolean(text || container.querySelector("img, video, iframe"));
};

export default function UpdatePost() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(null);
  const [editorKey, setEditorKey] = useState(0);
  const [hasSavedBody, setHasSavedBody] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [lastEditedAt, setLastEditedAt] = useState(new Date().toISOString());
  const [publishError, setPublishError] = useState(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const { postId } = useParams();
  const editorRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const draftStorageKey = `atriaUpdateArticleDraft:${postId}`;

  const saveTemporaryDraft = (nextFormData, savedAtOverride = null) => {
    const savedAt = savedAtOverride || new Date().toISOString();
    sessionStorage.setItem(
      draftStorageKey,
      JSON.stringify({
        ...nextFormData,
        savedAt,
      })
    );
    setLastEditedAt(savedAt);
    setHasSavedBody(hasMeaningfulBody(nextFormData.content));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/get");
        const data = await res.json();

        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const previewReturn = location.state?.previewReturn;

    if (previewReturn?._id === postId) {
      setFormData({
        ...previewReturn,
        category: previewReturn.category || "",
      });
      saveTemporaryDraft(previewReturn);
      setEditorKey((currentKey) => currentKey + 1);
      setIsPreviewing(false);
    }
  }, [location.state, postId]);

  useEffect(() => {
    const previewReturn = location.state?.previewReturn;

    if (previewReturn?._id === postId) {
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok || !data.posts?.[0]) {
          setPublishError(data.message || "Post not found.");
          return;
        }

        const postData = data.posts[0];
        const matchingCategory = categories.find(
          (category) => category.category === postData.category
        );

        setFormData({
          ...postData,
          category: matchingCategory?._id || postData.category || "",
          contentBlocks: null,
        });
        saveTemporaryDraft(
          {
            ...postData,
            category: matchingCategory?._id || postData.category || "",
            contentBlocks: null,
          },
          postData.updatedAt || postData.createdAt
        );
        setPublishError(null);
      } catch (error) {
        setPublishError("Something went wrong while loading this article.");
      }
    };

    fetchPost();
  }, [categories, location.state, postId]);

  const getCategoryLabel = (categoryValue) => {
    const matchingCategory = categories.find(
      (category) =>
        category._id === categoryValue || category.category === categoryValue
    );

    return matchingCategory?.category || categoryValue || "";
  };

  const handleEditorChange = (value, blocks) => {
    setFormData((previousData) => {
      const nextFormData = {
        ...previousData,
        content: value,
        contentBlocks: blocks || previousData.contentBlocks || null,
      };
      saveTemporaryDraft(nextFormData);
      return nextFormData;
    });
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    const latestSnapshot = await editorRef.current?.getSnapshot?.();
    const previewSnapshot = {
      ...formData,
      content: latestSnapshot?.html || formData.content || "",
      contentBlocks:
        latestSnapshot?.blocks || formData.contentBlocks || null,
    };

    saveTemporaryDraft(previewSnapshot);
    setFormData(previewSnapshot);
    setIsPreviewMode(true);
    setIsPreviewing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title?.trim()) {
      setPublishError("Add a title before updating this article.");
      return;
    }

    if (!formData.category) {
      setPublishError("Select a category before updating this article.");
      return;
    }

    try {
      const { contentBlocks, ...postPayload } = formData;
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(postPayload),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      sessionStorage.removeItem(draftStorageKey);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong while updating this article.");
    }
  };

  if (!formData) {
    return (
      <BoneyardPageSkeleton
        name="article-editor"
        loading
        fallback={<ArticleEditorSkeleton />}
      >
        <ArticleEditorSkeleton />
      </BoneyardPageSkeleton>
    );
  }

  return (
    <main className="min-h-screen flex-1 bg-white">
      <form onSubmit={handleSubmit}>
        <ArticleEditorHeader
          breadcrumb={`${getCategoryLabel(formData.category) || "No category"} / ${
            formData.title || "Untitled article"
          }`}
          isPreviewDisabled={!hasSavedBody}
          isPreviewing={isPreviewing}
          lastEditedAt={lastEditedAt}
          onBack={() => setShowLeaveDialog(true)}
          onPreview={handlePreview}
          previewLabel="Preview"
        />

        <section className="px-5 py-10 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-[740px] bg-white">
            <input
              type="text"
              className="w-full border-0 bg-transparent px-0 text-center text-3xl font-black leading-tight tracking-[-0.03em] text-neutral-950 outline-none placeholder:text-neutral-300 focus:ring-0 sm:text-4xl"
              placeholder="Untitled article"
              value={formData.title || ""}
              onChange={(event) =>
                setFormData((previousData) => {
                  const nextFormData = {
                    ...previousData,
                    title: event.target.value,
                  };
                  saveTemporaryDraft(nextFormData);
                  return nextFormData;
                })
              }
            />

            {formData.category && (
              <div className="mt-4 text-center">
                <span className="inline-flex rounded border border-neutral-500 px-3 py-1 text-xs font-medium text-neutral-600">
                  {getCategoryLabel(formData.category)}
                </span>
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="mobile-category">
                Change category
              </label>
              <select
                id="mobile-category"
                className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#367585] focus:ring-2 focus:ring-[#367585]/20"
                value={formData.category || ""}
                onChange={(event) =>
                  setFormData((previousData) => {
                    const nextFormData = {
                      ...previousData,
                      category: event.target.value,
                    };
                    saveTemporaryDraft(nextFormData);
                    return nextFormData;
                  })
                }
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-7">
              <CoverImageEditor
                image={formData.image}
                onChange={(image) =>
                  setFormData((previousData) => {
                    const nextFormData = {
                      ...previousData,
                      image,
                    };
                    saveTemporaryDraft(nextFormData);
                    return nextFormData;
                  })
                }
              />
            </div>

            {publishError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {publishError}
              </div>
            )}

            <div className="mt-8">
              <BlockNoteTextEditor
                key={`update-editor-${editorKey}`}
                ref={editorRef}
                initialBlocks={formData.contentBlocks}
                initialContent={formData.content || ""}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        </section>
      </form>

      <ArticlePreviewDrawer
        show={isPreviewMode}
        onClose={() => setIsPreviewMode(false)}
        article={{
          category: getCategoryLabel(formData.category),
          content: formData.content,
          date: lastEditedAt,
          image: formData.image,
          title: formData.title,
        }}
      />

      <UnsavedArticleDialog
        show={showLeaveDialog}
        onCancel={() => setShowLeaveDialog(false)}
        onConfirm={() => {
          sessionStorage.removeItem(draftStorageKey);
          sessionStorage.removeItem("atriaArticlePreview");
          navigate("/dashboard?tab=dash");
        }}
      />
    </main>
  );
}
