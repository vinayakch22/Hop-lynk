import { Button } from '../ui/Button';

export const UrlPagination = ({ pagination, onPageChange }) => {
  const { page, pages, total, limit } = pagination;
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const nums = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-(--border)">
      <p className="text-sm text-(--text-muted)">
        Showing <span className="font-medium text-(--text-secondary)">{start}–{end}</span> of{' '}
        <span className="font-medium text-(--text-secondary)">{total}</span> URLs
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          id="pagination-prev"
        >
          Prev
        </Button>

        {page > 3 && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onPageChange(1)}>1</Button>
            {page > 4 && <span className="text-(--text-muted) px-1">…</span>}
          </>
        )}

        {getPageNumbers().map((num) => (
          <Button
            key={num}
            variant={num === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(num)}
            className={num === page ? '!px-3' : ''}
          >
            {num}
          </Button>
        ))}

        {page < pages - 2 && (
          <>
            {page < pages - 3 && <span className="text-(--text-muted) px-1">…</span>}
            <Button variant="ghost" size="sm" onClick={() => onPageChange(pages)}>{pages}</Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          id="pagination-next"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
