import "@blocknote/core/fonts/inter.css";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { createReactBlockSpec, useCreateBlockNote } from "@blocknote/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { uploadFileToR2 } from "../utils/uploadFileToR2";

const getYouTubeEmbedUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      } else if (
        parsedUrl.pathname.startsWith("/embed/") ||
        parsedUrl.pathname.startsWith("/shorts/")
      ) {
        videoId = parsedUrl.pathname.split("/").filter(Boolean)[1] || "";
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    return "";
  }
};

const YouTubeEmbed = ({ url }) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <a href={url} rel="noreferrer" target="_blank">
        {url}
      </a>
    );
  }

  return (
    <div className="youtube-embed">
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

const YouTubeBlock = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: {
      url: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block }) => <YouTubeEmbed url={block.props.url} />,
    toExternalHTML: ({ block }) => <YouTubeEmbed url={block.props.url} />,
    parse: (element) => {
      const iframe =
        element.tagName === "IFRAME" ? element : element.querySelector("iframe");
      const src = iframe?.getAttribute("src") || "";

      if (!getYouTubeEmbedUrl(src)) {
        return undefined;
      }

      return {
        url: src,
      };
    },
  }
);

const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    youtube: YouTubeBlock(),
  },
});

const uploadEditorFile = (file) =>
  uploadFileToR2({
    file,
    folder: file.type.startsWith("video/") ? "editor-videos" : "editor-images",
  });

const normalizeYouTubeUrlsInHtml = (html) => {
  if (!html || typeof document === "undefined") {
    return html;
  }

  const container = document.createElement("div");
  container.innerHTML = html;

  container.querySelectorAll("p").forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    const embedUrl = getYouTubeEmbedUrl(text);

    if (!embedUrl) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "youtube-embed";

    const iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.title = "YouTube video player";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    wrapper.appendChild(iframe);
    paragraph.replaceWith(wrapper);
  });

  return container.innerHTML;
};

const cloneBlocks = (blocks) => JSON.parse(JSON.stringify(blocks || []));

function BlockNoteTextEditor(
  { initialBlocks = null, initialContent = "", onChange },
  ref
) {
  const editor = useCreateBlockNote({
    schema: editorSchema,
    uploadFile: uploadEditorFile,
  });
  const hasLoadedInitialContent = useRef(false);

  const getCurrentSnapshot = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    return {
      blocks: cloneBlocks(editor.document),
      html: normalizeYouTubeUrlsInHtml(html),
    };
  };

  useImperativeHandle(
    ref,
    () => ({
      getContent: async () => {
        const snapshot = await getCurrentSnapshot();
        return snapshot.html;
      },
      getSnapshot: getCurrentSnapshot,
    }),
    [editor]
  );

  useEffect(() => {
    if (hasLoadedInitialContent.current) {
      return;
    }

    const loadInitialContent = async () => {
      hasLoadedInitialContent.current = true;

      if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
        editor.replaceBlocks(editor.document, initialBlocks);
      } else if (initialContent) {
        const blocks = await editor.tryParseHTMLToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      }

      const snapshot = await getCurrentSnapshot();
      onChange(snapshot.html, snapshot.blocks);
    };

    loadInitialContent();
  }, [editor, initialBlocks, initialContent, onChange]);

  const handleChange = async () => {
    const snapshot = await getCurrentSnapshot();
    onChange(snapshot.html, snapshot.blocks);
  };

  const handlePasteCapture = (event) => {
    const pastedText = event.clipboardData?.getData("text/plain")?.trim();

    if (!pastedText || !getYouTubeEmbedUrl(pastedText)) {
      return;
    }

    event.preventDefault();

    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [
        {
          type: "youtube",
          props: {
            url: pastedText,
          },
        },
      ],
      currentBlock,
      "after"
    );
  };

  return (
    <div
      className="article-editor-body min-h-[420px] bg-white text-neutral-950"
      onPasteCapture={handlePasteCapture}
    >
      <BlockNoteView editor={editor} onChange={handleChange} theme="light" />
    </div>
  );
}

export default forwardRef(BlockNoteTextEditor);
