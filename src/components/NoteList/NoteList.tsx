import css from './NoteList.module.css';
import type { Note } from '../../types/note';

export interface NoteListProps {
  items: Note[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  deletingId?: string;
}

// guard без any для _id
function extractId(n: Note): string | undefined {
  const m = n as unknown as { id?: string; _id?: string };
  return m.id ?? m._id;
}

export default function NoteList({
  items,
  onDelete,
  isDeleting = false,
  deletingId,
}: NoteListProps) {
  return (
    <ul className={css.list}>
      {items.map((n) => {
        const id = extractId(n);
        const busy = isDeleting && deletingId === id;

        return (
          <li className={css.listItem} key={id ?? n.title}>
            <h2 className={css.title}>{n.title}</h2>
            <p className={css.content}>{n.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{n.tag}</span>
              {onDelete && (
                <button
                  className={css.button}
                  onClick={() => id && onDelete(id)}
                  disabled={busy || !id}
                  aria-busy={busy}
                  title={busy ? 'Deleting…' : 'Delete'}
                >
                  {busy ? 'Deleting…' : 'Delete'}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
