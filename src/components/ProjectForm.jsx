import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

/** @typedef {import("../types/project").Project} Project */

// ---------------------------------------------------------------------------
// ImageField — upload a file to /api/upload or paste a URL manually
// ---------------------------------------------------------------------------
function ImageField({ label, value, onChange, onUploadStart, onUploadEnd }) {
  const fileRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Clear local preview whenever the parent resets value (e.g. form reset)
  useEffect(() => {
    if (!value) setLocalPreview(null);
  }, [value]);

  const displayed = localPreview || value;

  const handleFile = async (file) => {
    if (!file) return;

    const objUrl = URL.createObjectURL(file);
    setLocalPreview(objUrl);
    setUploadError("");
    setUploading(true);
    onUploadStart?.();

    try {
      // JSON + base64 — multipart bodies arrive empty under vercel-dev.
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not read image file."));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: file.type,
          data: dataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      URL.revokeObjectURL(objUrl);
      setLocalPreview(null);
      onChange(data.url);
    } catch (err) {
      URL.revokeObjectURL(objUrl);
      setLocalPreview(null);
      setUploadError(err.message);
    } finally {
      setUploading(false);
      onUploadEnd?.();
    }
  };

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
        {label}
      </span>

      {/* Preview */}
      {displayed && (
        <div className="relative w-fit">
          <img
            src={displayed}
            alt=""
            className="h-20 max-w-[180px] rounded-md object-cover border border-slate-700"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/55">
              <span className="text-xs text-white">Uploading…</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={12} />
          {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
        </button>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setLocalPreview(null);
              setUploadError("");
            }}
            className="inline-flex items-center gap-1 rounded border border-rose-800 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-rose-950"
          >
            <X size={12} />
            Remove
          </button>
        )}
      </div>

      {/* Manual URL fallback — useful for existing /assets/ paths */}
      <input
        placeholder="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-400 placeholder:text-slate-600"
      />

      {uploadError && (
        <p className="text-xs text-rose-400">{uploadError}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProjectForm
// ---------------------------------------------------------------------------
/**
 * @param {{
 *   initialProject?: Project | null,
 *   onSubmit: (project: Project) => void,
 *   onCancel?: () => void,
 *   submitLabel?: string,
 *   disabled?: boolean,
 * }} props
 */
export default function ProjectForm({
  initialProject = null,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  disabled = false,
}) {
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [breadcrumb, setBreadcrumb] = useState(initialProject?.breadcrumb ?? "");
  const [heroImage, setHeroImage] = useState(initialProject?.heroImage ?? "");
  const [img, setImg] = useState(initialProject?.img ?? "");
  const [mainImage, setMainImage] = useState(initialProject?.mainImage ?? "");
  const [stateField, setStateField] = useState(initialProject?.state ?? "");
  const [town, setTown] = useState(initialProject?.town ?? "");
  const [area, setArea] = useState(initialProject?.area ?? "");
  const [designImage1, setDesignImage1] = useState(
    initialProject?.designImages?.[0] ?? "",
  );
  const [designImage2, setDesignImage2] = useState(
    initialProject?.designImages?.[1] ?? "",
  );
  const [story, setStory] = useState(initialProject?.story ?? "");
  const [wideImage, setWideImage] = useState(initialProject?.wideImage ?? "");
  const [approach, setApproach] = useState(initialProject?.approach ?? "");

  // Track concurrent image uploads to block form submission while any are running
  const [uploadCount, setUploadCount] = useState(0);
  const isUploading = uploadCount > 0;

  const onUploadStart = () => setUploadCount((c) => c + 1);
  const onUploadEnd = () => setUploadCount((c) => Math.max(0, c - 1));

  useEffect(() => {
    setTitle(initialProject?.title ?? "");
    setBreadcrumb(initialProject?.breadcrumb ?? "");
    setHeroImage(initialProject?.heroImage ?? "");
    setImg(initialProject?.img ?? "");
    setMainImage(initialProject?.mainImage ?? "");
    setStateField(initialProject?.state ?? "");
    setTown(initialProject?.town ?? "");
    setArea(initialProject?.area ?? "");
    setDesignImage1(initialProject?.designImages?.[0] ?? "");
    setDesignImage2(initialProject?.designImages?.[1] ?? "");
    setStory(initialProject?.story ?? "");
    setWideImage(initialProject?.wideImage ?? "");
    setApproach(initialProject?.approach ?? "");
    setUploadCount(0);
  }, [initialProject]);

  const isValid =
    title.trim() &&
    breadcrumb.trim() &&
    stateField.trim() &&
    town.trim() &&
    area.trim() &&
    story.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isUploading || disabled) return;

    /** @type {Project} */
    const project = {
      id: initialProject?.id ?? Date.now(),
      title,
      breadcrumb,
      heroImage: heroImage || undefined,
      img: img || undefined,
      mainImage: mainImage || undefined,
      state: stateField,
      town,
      area,
      designImages: [designImage1 || undefined, designImage2 || undefined],
      story,
      wideImage: wideImage || undefined,
      approach: approach || undefined,
    };

    onSubmit(project);
  };

  const imageUploadProps = { onUploadStart, onUploadEnd };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 max-w-4xl">
      {/* Text fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Title *
          </span>
          <input
            required
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Breadcrumb *
          </span>
          <input
            required
            placeholder="breadcrumb"
            value={breadcrumb}
            onChange={(e) => setBreadcrumb(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            State *
          </span>
          <input
            required
            placeholder="state"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Town *
          </span>
          <input
            required
            placeholder="town"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Area *
          </span>
          <input
            required
            placeholder="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Story *
        </span>
        <textarea
          required
          placeholder="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="min-h-28 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Approach
        </span>
        <textarea
          placeholder="approach"
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          className="min-h-24 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
        />
      </label>

      {/* Image fields */}
      <div className="border-t border-slate-800 pt-4">
        <p className="mb-4 text-xs uppercase tracking-wider text-slate-500">
          Images — upload a file or paste a URL
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <ImageField
            label="Hero Image"
            value={heroImage}
            onChange={setHeroImage}
            {...imageUploadProps}
          />
          <ImageField
            label="Listing Image (img)"
            value={img}
            onChange={setImg}
            {...imageUploadProps}
          />
          <ImageField
            label="Main Image"
            value={mainImage}
            onChange={setMainImage}
            {...imageUploadProps}
          />
          <ImageField
            label="Wide Image"
            value={wideImage}
            onChange={setWideImage}
            {...imageUploadProps}
          />
          <ImageField
            label="Design Image 1"
            value={designImage1}
            onChange={setDesignImage1}
            {...imageUploadProps}
          />
          <ImageField
            label="Design Image 2"
            value={designImage2}
            onChange={setDesignImage2}
            {...imageUploadProps}
          />
        </div>
      </div>

      {isUploading && (
        <p className="text-xs text-amber-400">
          Waiting for image uploads to complete…
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={!isValid || isUploading || disabled}
          className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-600 px-4 py-2 text-slate-100 transition hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
