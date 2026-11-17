import { useEffect, useMemo, useState } from "react";
import { TiltedGridHero, type TiltedGridImage } from "./components/ui/tilted-grid-hero";
import ExcuseCard from "./components/ExcuseCard";
import ExcuseForm from "./components/ExcuseForm";
import { deleteExcuse, getAll, type Excuse } from "./api/excuses";

const U = "https://images.unsplash.com";

// Background pictures. Each excuse gets one of these, in turn.
const PHOTOS = [
  `${U}/photo-1506905925346-21bda4d32df4?w=900&q=80`,
  `${U}/photo-1470071459604-3b5ec3a7fe05?w=900&q=80`,
  `${U}/photo-1441974231531-c6227db76b6e?w=900&q=80`,
  `${U}/photo-1500530855697-b586d89ba3ee?w=900&q=80`,
  `${U}/photo-1472214103451-9374bd1c798e?w=900&q=80`,
  `${U}/photo-1469474968028-56623f02e42e?w=900&q=80`,
];

// The text written on top of a moving picture.
// u(0.08) means "8% of the tile height", so the text grows and shrinks with the tile.
function excuseCaption(situation: string, text: string, score?: number) {
  return (u: (n: number) => string) => (
    <div
      className="absolute inset-0 flex flex-col justify-end text-white"
      style={{
        padding: u(0.06),
        background:
          "linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.35) 60%, transparent)",
      }}
    >
      {score !== undefined && (
        <span
          className="absolute rounded-full bg-white/90 font-medium text-black"
          style={{
            top: u(0.05),
            right: u(0.05),
            padding: `${u(0.01)} ${u(0.03)}`,
            fontSize: u(0.055),
          }}
        >
          {score}%
        </span>
      )}
      <p className="font-semibold leading-tight" style={{ fontSize: u(0.085) }}>
        {situation}
      </p>
      <p
        className="leading-snug opacity-90"
        style={{
          fontSize: u(0.062),
          marginTop: u(0.015),
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default function App() {
  // state = data the page remembers; changing it redraws the page
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Excuse | null>(null);

  // READ: ask the backend for all excuses
  async function loadExcuses() {
    try {
      setExcuses(await getAll());
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExcuses();
  }, []);

  // after create or update: leave edit mode and refresh the list
  function handleSaved() {
    setEditing(null);
    loadExcuses();
  }

  // UPDATE (step 1): put the excuse into the form
  function handleEdit(ex: Excuse) {
    setEditing(ex);
    document.getElementById("excuse-form")?.scrollIntoView({ behavior: "smooth" });
  }

  // DELETE
  async function handleDelete(ex: Excuse) {
    if (ex.id === undefined) return;
    if (!window.confirm(`Delete "${ex.situation}"?`)) return;
    try {
      await deleteExcuse(ex.id);
      if (editing?.id === ex.id) setEditing(null);
      await loadExcuses();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  // Turn the excuses into moving pictures with the excuse text on top
  const slides: TiltedGridImage[] = useMemo(() => {
    if (excuses.length === 0) {
      return [
        {
          src: PHOTOS[0],
          alt: "No excuses yet",
          caption: excuseCaption("No excuses yet", "Add your first excuse below."),
        },
      ];
    }
    return excuses.map((ex, i) => ({
      src: PHOTOS[i % PHOTOS.length],
      alt: ex.situation,
      caption: excuseCaption(ex.situation, ex.excuse, ex.believality),
    }));
  }, [excuses]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TiltedGridHero
        images={slides}
        tileHeight={40}
        className="h-[640px] w-full border-b border-border"
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-between py-10 text-center">
          <h1 className="px-6 text-4xl font-medium tracking-tight sm:text-5xl">
            Got an excuse?
            <br />
            Keep it handy.
          </h1>
          <p className="max-w-md px-6 text-sm text-muted-foreground">
            Every excuse you save floats by here, with how believable it is.
          </p>
        </div>
      </TiltedGridHero>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* key changes when you click Edit, so the form refills itself */}
        <ExcuseForm
          key={editing?.id ?? "new"}
          editing={editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />

        <h2 className="mb-6 text-2xl font-medium">All excuses ({excuses.length})</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}
        {!loading && !error && excuses.length === 0 && <p>No excuses yet.</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {excuses.map((ex) => (
            <ExcuseCard
              key={ex.id}
              item={ex}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
