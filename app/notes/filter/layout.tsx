import SidebarNotes from "./@sidebar/SidebarNotes";
import css from "./LayoutNotes.module.css";

export default function NotesFilterLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>
        <SidebarNotes />
        {sidebar}
      </aside>
      <main className={css.content}>{children}</main>
    </div>
  );
}

