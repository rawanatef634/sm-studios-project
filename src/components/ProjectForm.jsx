import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Title *</span>
        <input
        required
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Breadcrumb *</span>
        <input
        required
        placeholder="breadcrumb"
        value={breadcrumb}
        onChange={(e) => setBreadcrumb(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Hero Image</span>
        <input
        placeholder="heroImage"
        value={heroImage}
        onChange={(e) => setHeroImage(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Image</span>
        <input
        placeholder="img"
        value={img}
        onChange={(e) => setImg(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Main Image</span>
        <input
        placeholder="mainImage"
        value={mainImage}
        onChange={(e) => setMainImage(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">State *</span>
        <input
        required
        placeholder="state"
        value={stateField}
        onChange={(e) => setStateField(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Town *</span>
        <input
        required
        placeholder="town"
        value={town}
        onChange={(e) => setTown(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Area *</span>
        <input
        required
        placeholder="area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Design Image 1</span>
        <input
        placeholder="designImage1"
        value={designImage1}
        onChange={(e) => setDesignImage1(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Design Image 2</span>
        <input
        placeholder="designImage2"
        value={designImage2}
        onChange={(e) => setDesignImage2(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Story *</span>
        <textarea
        required
        placeholder="story"
        value={story}
        onChange={(e) => setStory(e.target.value)}
        className="border rounded-md px-3 py-2 min-h-24"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Wide Image</span>
        <input
        placeholder="wideImage"
        value={wideImage}
        onChange={(e) => setWideImage(e.target.value)}
        className="border rounded-md px-3 py-2"
      />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Approach</span>
        <textarea
        placeholder="approach"
        value={approach}
        onChange={(e) => setApproach(e.target.value)}
        className="border rounded-md px-3 py-2 min-h-24"
      />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!isValid}
          className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border rounded-md px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
