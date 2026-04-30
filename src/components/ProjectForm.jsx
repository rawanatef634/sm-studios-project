import { useEffect, useState } from "react";

/** @typedef {import("../types/project").Project} Project */

/**
 * @param {{
 * initialProject?: Project | null,
 * onSubmit: (project: Project) => void,
 * onCancel?: () => void,
 * submitLabel?: string
 * }} props
 */
export default function ProjectForm({
  initialProject = null,
  onSubmit,
  onCancel,
  submitLabel = "Save",
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
    if (!isValid) return;

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

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 max-w-4xl">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Title *</span>
        <input
        required
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Breadcrumb *</span>
        <input
        required
        placeholder="breadcrumb"
        value={breadcrumb}
        onChange={(e) => setBreadcrumb(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Hero Image</span>
        <input
        placeholder="heroImage"
        value={heroImage}
        onChange={(e) => setHeroImage(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Image</span>
        <input
        placeholder="img"
        value={img}
        onChange={(e) => setImg(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Main Image</span>
        <input
        placeholder="mainImage"
        value={mainImage}
        onChange={(e) => setMainImage(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">State *</span>
        <input
        required
        placeholder="state"
        value={stateField}
        onChange={(e) => setStateField(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Town *</span>
        <input
        required
        placeholder="town"
        value={town}
        onChange={(e) => setTown(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Area *</span>
        <input
        required
        placeholder="area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Design Image 1</span>
        <input
        placeholder="designImage1"
        value={designImage1}
        onChange={(e) => setDesignImage1(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Design Image 2</span>
        <input
        placeholder="designImage2"
        value={designImage2}
        onChange={(e) => setDesignImage2(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Story *</span>
        <textarea
        required
        placeholder="story"
        value={story}
        onChange={(e) => setStory(e.target.value)}
        className="min-h-28 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Wide Image</span>
        <input
        placeholder="wideImage"
        value={wideImage}
        onChange={(e) => setWideImage(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Approach</span>
        <textarea
        placeholder="approach"
        value={approach}
        onChange={(e) => setApproach(e.target.value)}
        className="min-h-24 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
      />
      </label>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={!isValid}
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
