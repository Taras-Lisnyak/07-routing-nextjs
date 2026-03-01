import NotePreview from "@/components/NotePreview/NotePreview";
import { fetchNoteById } from "@/lib/api";

export default async function NotePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const normalizedId = id.replace(/\(\.\)/g, "");
  const note = await fetchNoteById(normalizedId);

  return <NotePreview note={note} />;
}
