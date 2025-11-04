import { useState } from 'react';
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

import { useDebounce } from 'use-debounce';
import css from './App.module.css';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import {
  fetchNotes,
  deleteNote,
  type FetchNotesResponse,
  type DeleteNoteResponse,
} from '../../services/noteService';
import type { Note } from '../../types/note';

const PER_PAGE = 12;

// helper без any: дістає id або _id
function extractId(n: Note): string | undefined {
  const m = n as unknown as { id?: string; _id?: string };
  return m.id ?? m._id;
}

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const [isOpen, setIsOpen] = useState(false);

  const key = ['notes', page, debouncedSearch, PER_PAGE] as const;

  const notesQuery = useQuery<FetchNotesResponse>({
    queryKey: key as unknown as QueryKey,
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const notes = notesQuery.data?.items ?? [];
  const totalPages = notesQuery.data?.totalPages ?? 1;

  const qc = useQueryClient();

  type Ctx = { previous?: FetchNotesResponse };

  // типи: TData=DeleteNoteResponse, TVariables=string, TContext=Ctx
  const delMutation = useMutation<DeleteNoteResponse, unknown, string, Ctx>({
    mutationFn: (id) => deleteNote(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key as unknown as QueryKey });

      const previous = qc.getQueryData<FetchNotesResponse>(key as unknown as QueryKey);

      // оптимістичне видалення без any
      qc.setQueryData<FetchNotesResponse>(key as unknown as QueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((n) => extractId(n) !== id),
        };
      });

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData<FetchNotesResponse>(key as unknown as QueryKey, ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key as unknown as QueryKey });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={(p) => setPage(p)} />
        )}

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {notesQuery.isLoading && <Loader />}
      {notesQuery.isError && <ErrorMessage text="Failed to load notes" />}

      {notes.length > 0 && (
        <NoteList
          items={notes}
          onDelete={(id) => delMutation.mutate(id)}
          isDeleting={delMutation.isPending}
          deletingId={(delMutation.variables as string | undefined) ?? undefined}
        />
      )}

      {!notesQuery.isLoading && !notesQuery.isError && notes.length === 0 && (
        <div style={{ padding: 16, opacity: 0.7 }}>No notes yet</div>
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onCreated={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
