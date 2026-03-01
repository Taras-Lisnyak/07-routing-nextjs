import { notFound } from "next/navigation";
import { fetchNoteById } from "../../../lib/api";
import NotePreview from "@/components/NotePreview/NotePreview";

export default async function NoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let note;

  try {
    note = await fetchNoteById(id);
  } catch {
    notFound();
  }

  return (
    <NotePreview note={note} />
  );
}

