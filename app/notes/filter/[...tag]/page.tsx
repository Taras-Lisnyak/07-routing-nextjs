import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import axios from "axios";

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ tag?: string[] }>;
}) {
  const resolved = await params;
  const tag = resolved.tag?.[0] || "all";

  const normalizedTag =
    tag === "all" ? undefined : tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();

  let notes: Note[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await fetchNotes(1, 12, undefined, normalizedTag);
    notes = data.notes;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      errorMessage = "Too many requests right now. Please wait 30-60 seconds and try again.";
    } else {
      errorMessage =
        "Could not fetch the list of notes. Please check your backend connection.";
    }
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!notes || notes.length === 0) {
    return <p>No notes found for this tag.</p>;
  }

  return (
    <div>
      <h2>{tag === "all" ? "All Notes" : `Notes tagged "${normalizedTag}"`}</h2>
      <NoteList notes={notes} />
    </div>
  );
}


