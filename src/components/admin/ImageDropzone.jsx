import { useCallback, useRef, useState } from "react";
import { uploadImageToCloudinary } from "../../lib/upload";

/**
 * Drag-and-drop (or click-to-browse) image uploader. Each dropped/selected
 * file is uploaded directly to Cloudinary via a signed request; resulting
 * secure URLs are reported back through onUploaded as they complete.
 */
export default function ImageDropzone({ onUploaded, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState([]); // [{ id, name, progress }]

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
      files.forEach((file) => {
        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        setUploading((prev) => [...prev, { id, name: file.name, progress: 0 }]);

        uploadImageToCloudinary(file, {
          onProgress: (progress) =>
            setUploading((prev) => prev.map((u) => (u.id === id ? { ...u, progress } : u))),
        })
          .then((url) => {
            onUploaded?.(url);
          })
          .catch((err) => {
            onError?.(err.message || "Image upload failed.");
          })
          .finally(() => {
            setUploading((prev) => prev.filter((u) => u.id !== id));
          });
      });
    },
    [onUploaded, onError]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200 ${
          dragging
            ? "border-emerald-700 bg-emerald-100/50"
            : "border-edge bg-surface-alt hover:border-content-muted"
        }`}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-content-muted">
          <path d="M12 16V4M12 4 7 9M12 4l5 5" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
        <p className="text-sm font-medium text-content">Drag &amp; drop photos here, or click to browse</p>
        <p className="text-xs text-content-muted">JPG, PNG, or WebP — uploaded straight to Cloudinary</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploading.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploading.map((u) => (
            <div key={u.id} className="flex items-center gap-3 text-xs text-content-muted">
              <span className="w-32 shrink-0 truncate">{u.name}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full bg-emerald-700 transition-[width] duration-200"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
              <span className="w-9 text-right">{u.progress}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
