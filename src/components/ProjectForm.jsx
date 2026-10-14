import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useSiteSettings } from "../context/SiteSettingsContext";
import ImageFramingEditor from "./admin/ImageFramingEditor";
import { IMAGE_SLOTS, isDefaultFrame } from "../utils/imageFraming";

/** @typedef {import("../types/project").Project} Project */

// ---------------------------------------------------------------------------
// ImageField — upload a file to /api/upload or paste a URL manually
// ---------------------------------------------------------------------------
function ImageField({
  slotKey,
  value,
  onChange,
  frame,
  onFrameChange,
  onUploadStart,
  onUploadEnd,
}) {
  const slot = IMAGE_SLOTS[slotKey];
  const label = slot.label;
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
      onFrameChange(undefined);
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
    <div className="grid gap-2 border-t border-slate-800 pt-4 first:border-t-0 first:pt-0">
      <div className="grid gap-0.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          {label}
        </span>
        <span className="text-[11px] text-slate-400">{slot.description}</span>
        <span className="text-[11px] text-slate-500">
          Recommended: {slot.recommended.width} × {slot.recommended.height}px (
          {slot.recommended.width >= slot.recommended.height
            ? "landscape"
            : "portrait"}
          )
        </span>
      </div>

      {/* Uploading preview */}
      {uploading && displayed && (
        <div className="relative w-fit">
          <img
            src={displayed}
            alt=""
            className="h-20 max-w-[180px] rounded-md object-cover border border-slate-700"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/55">
            <span className="text-xs text-white">Uploading…</span>
          </div>
        </div>
      )}

      {/* Framing editor */}
      {value && !uploading && (
        <ImageFramingEditor
          key={value}
          src={value}
          frame={frame}
          onChange={onFrameChange}
          slot={slot}
        />
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
              onFrameChange(undefined);
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
        onChange={(e) => {
          onChange(e.target.value);
          onFrameChange(undefined);
        }}
        className="max-w-md rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-400 placeholder:text-slate-600"
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
  const { settings } = useSiteSettings();
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [category, setCategory] = useState(
    initialProject?.category ?? settings.categories[0] ?? "",
  );
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
  const [imageFraming, setImageFraming] = useState(
    initialProject?.imageFraming ?? {},
  );

  const frameProps = (slotKey) => ({
    slotKey,
    frame: imageFraming[slotKey],
    onFrameChange: (frame) =>
      setImageFraming((prev) => {
        const next = { ...prev };
        if (!frame || isDefaultFrame(frame)) delete next[slotKey];
        else next[slotKey] = frame;
        return next;
      }),
  });

  // Track concurrent image uploads to block form submission while any are running
  const [uploadCount, setUploadCount] = useState(0);
  const isUploading = uploadCount > 0;

  const onUploadStart = () => setUploadCount((c) => c + 1);
  const onUploadEnd = () => setUploadCount((c) => Math.max(0, c - 1));

  useEffect(() => {
    setTitle(initialProject?.title ?? "");
    setCategory(initialProject?.category ?? settings.categories[0] ?? "");
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
    setImageFraming(initialProject?.imageFraming ?? {});
    setUploadCount(0);
    // Only reset when switching projects, not when categories reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProject]);

  const categoryOptions =
    category && !settings.categories.includes(category)
      ? [...settings.categories, category]
      : settings.categories;

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
      ...initialProject,
      id: initialProject?.id ?? Date.now(),
      title,
      category: category || undefined,
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
      imageFraming: Object.keys(imageFraming).length ? imageFraming : undefined,
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
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          >
            {categoryOptions.map((name) => (
              <option key={name} value={name}>
                {settings.categories.includes(name)
                  ? name
                  : `${name} (not in category list)`}
              </option>
            ))}
          </select>
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
        <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">
          Images — upload a file or paste a URL
        </p>
        <p className="mb-4 text-[11px] text-slate-500">
          Listed in the order they appear on the project page. After uploading,
          choose the focus point and zoom — the previews show exactly how each
          image will be cropped on desktop, tablet and mobile.
        </p>
        <div className="grid gap-6">
          <ImageField
            value={heroImage}
            onChange={setHeroImage}
            {...frameProps("heroImage")}
            {...imageUploadProps}
          />
          <ImageField
            value={mainImage}
            onChange={setMainImage}
            {...frameProps("mainImage")}
            {...imageUploadProps}
          />
          <ImageField
            value={designImage1}
            onChange={setDesignImage1}
            {...frameProps("designImage1")}
            {...imageUploadProps}
          />
          <ImageField
            value={designImage2}
            onChange={setDesignImage2}
            {...frameProps("designImage2")}
            {...imageUploadProps}
          />
          <ImageField
            value={wideImage}
            onChange={setWideImage}
            {...frameProps("wideImage")}
            {...imageUploadProps}
          />
          <ImageField
            value={img}
            onChange={setImg}
            {...frameProps("img")}
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
