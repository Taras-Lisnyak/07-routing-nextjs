import NotePreview from "@/components/NotePreview/NotePreview";
import { fetchNoteById } from "@/lib/api";

export default async function NotePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const normalizedIdMatch = id.match(/[a-z0-9]{20,}$/i);
  const normalizedId = normalizedIdMatch ? normalizedIdMatch[0] : id;

  try {
    const note = await fetchNoteById(normalizedId);
    return <NotePreview note={note} />;
  } catch {
    return <NotePreview errorMessage="Could not fetch note details. Please try again." />;
  }
}
