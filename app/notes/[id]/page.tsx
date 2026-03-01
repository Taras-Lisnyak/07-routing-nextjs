import { notFound } from "next/navigation";
import { fetchNoteById } from "../../../lib/api";
import NotePreview from "@/components/NotePreview/NotePreview";
import type { Note } from "@/types/note";

export default async function NoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let note: Note;

  try {
    note = await fetchNoteById(id);
  } catch {
    return <NotePreview errorMessage="Could not fetch note details. Please try again." />;
  }

  if (!note) {
    notFound();
  }

  return <NotePreview note={note} />;
}

