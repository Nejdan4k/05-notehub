import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={(s) => onPageChange(s.selected + 1)}
      containerClassName={css.pagination}
      pageLinkClassName={css.pageLink}
      activeLinkClassName={css.active}
      previousLabel="‹"
      nextLabel="›"
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakLabel="…"
      breakLinkClassName={css.pageLink}
    />
  );
}
