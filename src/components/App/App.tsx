import { useMemo, useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, type FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 400);

  
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryKey = useMemo(
    () => ["notes", page, PER_PAGE, debouncedSearch],
    [page, debouncedSearch]
  );

  const { data, isLoading, isError, error, isFetching } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p className={css.status}>Loading…</p>}
      {isError && <p className={css.status}>Error: {(error as Error)?.message}</p>}

      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p className={css.status}>No notes found.</p>
      )}

      {isFetching && !isLoading && <p className={css.status}>Updating…</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}