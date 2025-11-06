import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number; 
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="…"
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1} // react-paginate ожидает 0-based
      onPageChange={(ev) => onPageChange(ev.selected + 1)}
      containerClassName={css.pagination}
      pageClassName={css.page}
      pageLinkClassName={css.pageLink}
      activeClassName={css.active}
      previousClassName={css.page}
      nextClassName={css.page}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakClassName={css.page}
      breakLinkClassName={css.pageLink}
    />
  );
}