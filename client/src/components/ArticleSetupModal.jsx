import { useEffect, useMemo, useRef, useState } from "react";
import {
  HiChevronDown,
  HiOutlinePhotograph,
  HiOutlineSearch,
  HiOutlineUpload,
  HiPlus,
  HiX,
} from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MediaLibraryModal from "./MediaLibraryModal";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_LABEL,
  uploadFileToR2,
} from "../utils/uploadFileToR2";

export default function ArticleSetupModal({ onClose, onContinue, show }) {
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageName, setCoverImageName] = useState("");
  const [error, setError] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [title, setTitle] = useState("");
  const categoryRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!show) {
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/get");
        const data = await res.json();

        if (res.ok) {
          setCategories(data || []);
        }
      } catch (fetchError) {
        setError("Categories could not be loaded. You can still create a new category from the dropdown.");
      }
    };

    fetchCategories();
  }, [show]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    const search = categorySearch.trim().toLowerCase();

    if (!search) {
      return categories;
    }

    return categories.filter((category) =>
      category.category.toLowerCase().includes(search)
    );
  }, [categories, categorySearch]);

  const normalizedCategorySearch = categorySearch.trim();
  const matchingCategory = categories.find(
    (category) =>
      category.category.toLowerCase() === normalizedCategorySearch.toLowerCase()
  );
  const canCreateCategory = Boolean(normalizedCategorySearch && !matchingCategory);

  if (!show) {
    return null;
  }

  const selectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategorySearch(categoryName);
    setIsCategoryOpen(false);
    setError("");
  };

  const handleCreateCategory = async () => {
    const categoryName = normalizedCategorySearch;

    if (!categoryName) {
      setError("Type a category name before creating it.");
      return;
    }

    if (matchingCategory) {
      selectCategory(matchingCategory.category);
      return;
    }

    try {
      setIsCreatingCategory(true);
      setError("");

      const res = await fetch("/api/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: categoryName }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to create category");
      }

      setCategories((previousCategories) => [...previousCategories, data]);
      selectCategory(data.category);
    } catch (createError) {
      setError(createError.message || "Category creation failed.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const uploadCoverFile = async (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please choose an image file for the article cover.");
      return;
    }

    if (selectedFile.size > MAX_UPLOAD_SIZE_BYTES) {
      setError(`Cover image uploads must be ${MAX_UPLOAD_SIZE_LABEL} or smaller.`);
      return;
    }

    try {
      setError("");
      const publicUrl = await uploadFileToR2({
        file: selectedFile,
        folder: "posts",
        onProgress: setImageUploadProgress,
      });

      setCoverImage(publicUrl);
      setCoverImageName(selectedFile.name || "Cover image selected");
      setImageUploadProgress(null);
    } catch (uploadError) {
      setError(uploadError.message || "Cover image upload failed.");
      setImageUploadProgress(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    uploadCoverFile(event.dataTransfer.files?.[0]);
  };

  const handlePaste = (event) => {
    const pastedFile = Array.from(event.clipboardData?.files || []).find((item) =>
      item.type.startsWith("image/")
    );

    if (pastedFile) {
      uploadCoverFile(pastedFile);
    }
  };

  const handleContinue = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Add an article title before continuing.");
      return;
    }

    if (!selectedCategory) {
      setError("Select or create a category before continuing.");
      return;
    }

    onContinue({
      category: selectedCategory,
      coverImage,
      title: trimmedTitle,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/45 px-4 py-6">
        <div className="w-full max-w-3xl overflow-visible rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between px-6 pb-5 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#367585]">
                New Article Setup
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-neutral-950">
                Prepare the article before writing.
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Set the title, category, and cover image first. The editor opens after this.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
              onClick={onClose}
              aria-label="Close article setup"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>

          <div className="border-t border-neutral-200 px-6 py-6">
            <div className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="text-sm font-semibold text-neutral-900">Article title</span>
                <input
                  type="text"
                  className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-base font-semibold text-neutral-950 outline-none transition focus:border-[#367585] focus:ring-4 focus:ring-[#367585]/10"
                  placeholder="Enter article title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>

              <div className="relative" ref={categoryRef}>
                <span className="text-sm font-semibold text-neutral-900">Category</span>
                <div className="relative mt-2">
                  <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-10 text-sm text-neutral-800 outline-none transition focus:border-[#367585] focus:ring-4 focus:ring-[#367585]/10"
                    placeholder="Search or create category"
                    value={categorySearch}
                    onChange={(event) => {
                      setCategorySearch(event.target.value);
                      setSelectedCategory("");
                      setIsCategoryOpen(true);
                    }}
                    onFocus={() => setIsCategoryOpen(true)}
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                </div>

                {isCategoryOpen && (
                  <div className="absolute left-0 right-0 top-[76px] z-50 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
                    <div className="max-h-56 overflow-y-auto py-1">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <button
                            key={category._id}
                            type="button"
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-neutral-700 transition hover:bg-neutral-50"
                            onClick={() => selectCategory(category.category)}
                          >
                            <span>{category.category}</span>
                            {selectedCategory === category.category && (
                              <span className="text-xs font-semibold text-[#367585]">Selected</span>
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-neutral-500">No matching categories.</p>
                      )}
                    </div>

                    {canCreateCategory && (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 border-t border-neutral-100 px-4 py-3 text-left text-sm font-semibold text-[#367585] transition hover:bg-[#367585]/5 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory}
                      >
                        <HiPlus className="h-4 w-4" />
                        {isCreatingCategory
                          ? "Creating category..."
                          : `Create "${normalizedCategorySearch}"`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900">Image</span>
                </div>

                <div
                  className="flex min-h-12 flex-col gap-3 rounded-sm border border-neutral-200 bg-white p-3 transition focus-within:border-[#367585] sm:flex-row sm:items-center sm:justify-between"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  tabIndex={0}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Selected cover thumbnail"
                        className="h-12 w-16 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <HiOutlinePhotograph className="h-5 w-5 shrink-0 text-neutral-500" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm text-neutral-700">
                        {coverImage
                          ? coverImageName || "Cover image selected"
                          : "Drag or paste image here"}
                      </p>
                      {imageUploadProgress && (
                        <p className="text-xs text-neutral-500">
                          Uploading cover image...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => uploadCoverFile(event.target.files?.[0])}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploadProgress}
                    >
                      {imageUploadProgress ? (
                        <span className="h-7 w-7">
                          <CircularProgressbar
                            value={imageUploadProgress}
                            text={`${imageUploadProgress || 0}%`}
                          />
                        </span>
                      ) : (
                        <>
                          <HiOutlineUpload className="h-4 w-4" />
                          Upload
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                      onClick={() => setShowMediaLibrary(true)}
                    >
                      <HiOutlineSearch className="h-4 w-4" />
                      Select
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Guideline: upload an image file up to {MAX_UPLOAD_SIZE_LABEL}.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
            <button
              type="button"
              className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#367585] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f6674]"
              onClick={handleContinue}
            >
              Continue to editor
            </button>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        show={showMediaLibrary}
        title="Select cover image"
        allowedTypes={["image"]}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          setCoverImage(media.url);
          setCoverImageName(media.name || "Cover image selected");
          setShowMediaLibrary(false);
        }}
      />
    </>
  );
}
