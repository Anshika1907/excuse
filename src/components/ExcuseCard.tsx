import type { Excuse } from "../api/excuses";

type Props = {
  item: Excuse;
  onEdit: (ex: Excuse) => void;
  onDelete: (ex: Excuse) => void;
};

// Shows ONE excuse with Edit and Delete buttons.
// It does not talk to the backend itself, the page does that.
export default function ExcuseCard({ item, onEdit, onDelete }: Props) {
  const percent = Math.min(100, Math.max(0, item.believality));

  return (
    <div className="flex flex-col rounded-lg border border-border bg-background p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Situation</p>
      <h3 className="mb-3 text-lg font-medium">{item.situation}</h3>

      <p className="text-xs uppercase tracking-wide text-muted-foreground">Excuse</p>
      <p className="mb-4">{item.excuse}</p>

      <p className="mb-1 text-xs text-muted-foreground">
        Believability: {item.believality} / 100
      </p>
      <div className="mb-4 h-2 w-full rounded bg-muted">
        <div className="h-2 rounded bg-foreground" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
