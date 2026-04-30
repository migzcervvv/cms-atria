import { useState } from "react";
import { HiOutlinePhotograph, HiOutlineSwitchHorizontal } from "react-icons/hi";
import MediaLibraryModal from "./MediaLibraryModal";

export default function CoverImageEditor({ image, onChange }) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  return (
    <div>
      <div className="group bg-transparent">
        {image ? (
          <div className="relative inline-block max-w-full align-top">
            <img
              src={image}
              alt="Article cover"
              className="h-auto max-h-[480px] max-w-full object-contain"
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-[#367585]"
              onClick={() => setShowMediaLibrary(true)}
            >
              <HiOutlineSwitchHorizontal className="h-4 w-4" />
              Choose another
            </button>
          </div>
        ) : (
          <div className="relative flex h-[260px] items-center justify-center bg-neutral-50 text-neutral-400 sm:h-[360px]">
            <div className="text-center">
              <HiOutlinePhotograph className="mx-auto h-10 w-10" />
              <p className="mt-2 text-sm font-medium">No cover image selected</p>
            </div>
            <button
              type="button"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-[#367585]"
              onClick={() => setShowMediaLibrary(true)}
            >
              <HiOutlineSwitchHorizontal className="h-4 w-4" />
              Choose another
            </button>
          </div>
        )}
      </div>

      <MediaLibraryModal
        show={showMediaLibrary}
        allowedTypes={["image"]}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          onChange(media.url);
          setShowMediaLibrary(false);
        }}
      />
    </div>
  );
}
