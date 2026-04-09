"use client";
import React, { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import ReactQuillType from "react-quill-new";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const Component = ({
      forwardedRef,
      ...props
    }: { forwardedRef: React.Ref<ReactQuillType> } & React.ComponentProps<
      typeof RQ
    >) => <RQ ref={forwardedRef} {...props} />;
    Component.displayName = "ReactQuill";
    return Component;
  },
  { ssr: false },
);

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function CustomEditor({ value, onChange }: Props) {
  const quillRef = useRef<ReactQuillType>(null);
  const [content, setContent] = useState(value ?? "");

  const handleChange = (val: string) => {
    setContent(val);
    onChange?.(val);
  };

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "editor");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const imageUrl = data.url;

      const quillObj = quillRef.current?.getEditor();
      const range = quillObj?.getSelection();
      if (range) {
        quillObj?.insertEmbed(range.index, "image", imageUrl);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }, { size: [] }, { header: [1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ direction: "rtl" }, { align: [] }],
        ["link", "image", "clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <div className="mb-20 h-50">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        modules={modules}
        value={content}
        onChange={handleChange}
        style={{ height: "100%" }}
        className="lg:h-full"
      />
    </div>
  );
}
