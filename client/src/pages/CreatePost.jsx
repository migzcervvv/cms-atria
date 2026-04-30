import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleEditorHeader from "../components/ArticleEditorHeader";
import ArticlePreviewDrawer from "../components/ArticlePreviewDrawer";
import BlockNoteTextEditor from "../components/BlockNoteTextEditor";
import CoverImageEditor from "../components/CoverImageEditor";
import UnsavedArticleDialog from "../components/UnsavedArticleDialog";

const CREATE_DRAFT_STORAGE_KEY = "atriaCreateArticleDraft";

const hasMeaningfulBody = (content = "") => {
  if (!content) {
    return false;
  }

  const container = document.createElement("div");
  container.innerHTML = content;
  const text = container.textContent?.trim() || "";
  return Boolean(text || container.querySelector("img, video, iframe"));
};

const readStoredSetup = () => {
  try {
    return JSON.parse(sessionStorage.getItem("atriaArticleSetup") || "{}");
  } catch (error) {
    return {};
  }
};

export default function CreatePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const initialSetup = location.state?.articleSetup || readStoredSetup();
  const [formData, setFormData] = useState({
    category: initialSetup.category || "",
    content: "",
    contentBlocks: null,
    image: initialSetup.coverImage || "",
    title: initialSetup.title || "",
  });
  const [editorKey, setEditorKey] = useState(0);
  const [hasSavedBody, setHasSavedBody] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [lastEditedAt, setLastEditedAt] = useState(new Date().toISOString());
  const [publishError, setPublishError] = useState(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const saveTemporaryDraft = (nextFormData) => {
    const savedAt = new Date().toISOString();
    sessionStorage.setItem(
      CREATE_DRAFT_STORAGE_KEY,
      JSON.stringify({
        ...nextFormData,
        savedAt,
      })
    );
    setLastEditedAt(savedAt);
    setHasSavedBody(hasMeaningfulBody(nextFormData.content));
  };

  useEffect(() => {
    const setup = location.state?.articleSetup;

    if (!setup) {
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      category: setup.category || previousData.category,
      image: setup.coverImage || previousData.image,
      title: setup.title || previousData.title,
    }));
  }, [location.state]);

  useEffect(() => {
    const previewReturn = location.state?.previewReturn;

    if (!previewReturn) {
      return;
    }

    setFormData({
      category: previewReturn.category || "",
      content: previewReturn.content || "",
      contentBlocks: previewReturn.contentBlocks || null,
      image: previewReturn.image || "",
      title: previewReturn.title || "",
    });
    saveTemporaryDraft(previewReturn);
    setEditorKey((currentKey) => currentKey + 1);
    setIsPreviewing(false);
  }, [location.state]);

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

    if (!formData.title.trim()) {
      setPublishError("Add a title before publishing.");
      return;
    }

    if (!formData.category) {
      setPublishError("This article needs a category. Start a new article from the dashboard setup modal.");
      return;
    }

    try {
      const { contentBlocks, ...postPayload } = formData;
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(postPayload),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      sessionStorage.removeItem("atriaArticleSetup");
      setPublishError(null);
      sessionStorage.removeItem(CREATE_DRAFT_STORAGE_KEY);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong while publishing the article.");
    }
  };

  return (
    <main className="min-h-screen flex-1 bg-white">
      <form onSubmit={handleSubmit}>
        <ArticleEditorHeader
          breadcrumb={`${formData.category || "No category"} / ${
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
              value={formData.title}
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
                  {formData.category}
                </span>
              </div>
            )}

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
                key={`create-editor-${editorKey}`}
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
          category: formData.category,
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
          sessionStorage.removeItem(CREATE_DRAFT_STORAGE_KEY);
          sessionStorage.removeItem("atriaArticlePreview");
          navigate("/dashboard?tab=dash");
        }}
      />
    </main>
  );
}
