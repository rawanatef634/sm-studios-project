import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  DEFAULT_FRAME,
  MAX_ZOOM,
  frameStyle,
  isDefaultFrame,
  normalizeFrame,
} from "../../utils/imageFraming";

const PREVIEW_HEIGHT = 110;

function FramePreview({ src, frame, placement }) {
  return (
    <figure className="grid gap-1">
      <div
        className="relative overflow-hidden rounded border border-slate-700 bg-slate-900"
        style={{ height: PREVIEW_HEIGHT, aspectRatio: placement.ratio }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={frameStyle(frame)}
        />
        {placement.overlay && (
          <div className="absolute inset-0 bg-[#161B1E]/60" />
        )}
      </div>
      <figcaption className="text-[11px] leading-tight text-slate-400">
        {placement.label}
      </figcaption>
    </figure>
  );
}

/**
 * Focal point + zoom picker with live previews of every place the image appears.
 * @param {{
 *   src: string,
 *   frame: { x: number, y: number, zoom: number } | undefined,
 *   onChange: (frame: { x: number, y: number, zoom: number }) => void,
 *   slot: import("../../utils/imageFraming").IMAGE_SLOTS[keyof import("../../utils/imageFraming").IMAGE_SLOTS],
 * }} props
 */
export default function ImageFramingEditor({ src, frame, onChange, slot }) {
  const imageRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [natural, setNatural] = useState(null);
  const current = normalizeFrame(frame);

  const setFromPointer = (event) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect?.height) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onChange(
      normalizeFrame({
        ...current,
        x: Math.round(x),
        y: Math.round(y),
      }),
    );
  };

  const tooSmall =
    natural &&
    (natural.width < slot.recommended.width * 0.75 ||
      natural.height < slot.recommended.height * 0.75);

  return (
    <div className="grid gap-4 rounded-md border border-slate-800 bg-slate-950/60 p-3 lg:grid-cols-[minmax(0,280px)_1fr]">
      <div className="grid content-start gap-3">
        <p className="text-[11px] text-slate-400">
          Click or drag on the image to choose the part that must stay visible.
        </p>
        <div
          className="relative w-fit max-w-full cursor-crosshair touch-none select-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
            setFromPointer(event);
          }}
          onPointerMove={(event) => dragging && setFromPointer(event)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <img
            ref={imageRef}
            src={src}
            alt=""
            draggable={false}
            onLoad={(event) =>
              setNatural({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }
            className="block max-h-64 max-w-full rounded"
          />
          <div
            className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.6)]"
            style={{ left: `${current.x}%`, top: `${current.y}%` }}
          >
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400" />
          </div>
        </div>

        <label className="grid gap-1">
          <span className="flex justify-between text-[11px] text-slate-400">
            <span>Zoom</span>
            <span>{current.zoom.toFixed(2)}×</span>
          </span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.05}
            value={current.zoom}
            onChange={(event) =>
              onChange(
                normalizeFrame({ ...current, zoom: Number(event.target.value) }),
              )
            }
            className="accent-cyan-400"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isDefaultFrame(current)}
            onClick={() => onChange({ ...DEFAULT_FRAME })}
            className="inline-flex items-center gap-1.5 rounded border border-slate-600 px-2.5 py-1 text-[11px] text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={11} />
            Reset to center
          </button>
          {natural && (
            <span className="text-[11px] text-slate-500">
              Uploaded: {natural.width} × {natural.height}px
            </span>
          )}
        </div>

        {tooSmall && (
          <p className="text-[11px] text-amber-400">
            This image is smaller than recommended ({slot.recommended.width} ×{" "}
            {slot.recommended.height}px) and may look blurry on large screens.
          </p>
        )}
      </div>

      <div className="grid content-start gap-2">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">
          How it will look on the site
        </p>
        <div className="flex flex-wrap items-start gap-3">
          {slot.placements.map((placement) => (
            <FramePreview
              key={placement.label}
              src={src}
              frame={current}
              placement={placement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
