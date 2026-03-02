import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import css from "../NotesPage.module.css";

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  const slug = resolved.slug?.[0] || "all";

  const normalizedTag =
    slug === "all" ? undefined : slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", normalizedTag ?? "all"],
    queryFn: () => fetchNotes(1, 12, "", normalizedTag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydratedState}>
        <NotesClient slug={slug} normalizedTag={normalizedTag} />
      </HydrationBoundary>
    </main>
  );
}
