import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import NotesContent from "./Notes.client";
import Link from "next/link";
import css from "./NotesPage.module.css";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes(1, 12, ""),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydratedState}>
        <NotesContent />
      </HydrationBoundary>

       <div className={css.buttonWrapper}>
        <Link href="/notes/filter/all" className={css.filterButton}>
          Go to Filtered Notes
        </Link>
      </div>


    </main>
  );
}


