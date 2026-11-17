import { useState, type FormEvent } from "react";
import { createExcuse, updateExcuse, type Excuse } from "../api/excuses";

type Props = {
  editing: Excuse | null; // null = adding a new excuse
  onSaved: () => void;
  onCancel: () => void;
};

// One form for both CREATE and UPDATE.
// The page gives it a new `key` when you click Edit, so it starts
// with the values of that excuse.
export default function ExcuseForm({ editing, onSaved, onCancel }: Props) {
  const [situation, setSituation] = useState(editing?.situation ?? "");
  const [excuse, setExcuse] = useState(editing?.excuse ?? "");
  const [believality, setBelievality] = useState(editing?.believality ?? 50);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    const data = { situation, excuse, believality };
    try {
      if (editing?.id !== undefined) {
        await updateExcuse(editing.id, data); // PUT  /excuses/update/{id}
      } else {
        await createExcuse(data); // POST /excuses/create
        setSituation("");
        setExcuse("");
        setBelievality(50);
      }
      setError("");
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const input = "w-full rounded-md border border-border bg-background p-2";

  return (
    <form
      id="excuse-form"
      onSubmit={handleSubmit}
      className="mb-10 grid gap-4 rounded-lg border border-border p-5"
    >
      <h2 className="text-xl font-medium">
        {editing ? "Edit excuse" : "Add a new excuse"}
      </h2>

      <input
        className={input}
        placeholder="Situation (e.g. Late to class)"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        required
      />
      <textarea
        className={input}
        placeholder="Your excuse"
        value={excuse}
        onChange={(e) => setExcuse(e.target.value)}
        required
      />
      <label className="text-sm text-muted-foreground">
        Believability (0 - 100)
        <input
          type="number"
          min={0}
          max={100}
          className={`${input} mt-1`}
          value={believality}
          onChange={(e) => setBelievality(Number(e.target.value))}
          required
        />
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background"
        >
          {editing ? "Update excuse" : "Save excuse"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
