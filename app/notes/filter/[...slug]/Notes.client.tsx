"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";

export default function NotesClient({ tag }: { tag: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", tag],
    queryFn: () => tag === "all" ? fetchNotes(1, 20) : fetchNotes(1, 20, undefined, tag),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading notes.</p>;

  return (
    <ul>
      {data?.notes?.map((note: any) => (
        <li key={note.id}>
          <strong>{note.title}</strong> — {note.content} ({note.tag})
        </li>
      ))}
    </ul>
  );
}

