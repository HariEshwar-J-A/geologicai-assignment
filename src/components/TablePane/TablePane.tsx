import { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { AppDispatch } from '../../store';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setSelectedId } from '../../features/ui/selectionSlice';
import type { Earthquake } from '../../features/data/dataSlice';

let dispatch: AppDispatch;

const PAGE_SIZE = 15;
const columnOrder: (keyof Earthquake)[] = [
  'id',
  'time',
  'mag',
  'place',
  'latitude',
  'longitude',
  'depth',
  'magType',
  'nst',
  'gap',
  'dmin',
  'rms',
  'net',
  'updated',
  'type',
  'horizontalError',
  'depthError',
  'magError',
  'magNst',
  'status',
  'locationSource',
  'magSource',
];

export default function TablePane() {
  dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.data.items);
  const minMag = useAppSelector((s) => s.filter.minMagnitude);
  const selectedId = useAppSelector((s) => s.selection.selectedId);

  // console.log('[TablePane] items =', items, 'minMag =', minMag, 'selectedId =', selectedId);
  // If you ever need an additional sort at the table level (for example, after filtering), you can also chain a .sort() in your filtered calculation

  const filtered = useMemo(
    () => items.filter((eq) => eq.mag >= minMag).sort((a, b) => b.mag - a.mag),
    [items, minMag],
  );

  // const filtered = useMemo(() => items.filter((eq) => eq.mag >= minMag), [items, minMag]);

  const [pageIndex, setPageIndex] = useState(0);

  // jump to page with selected row
  useEffect(() => {
    const idx = filtered.findIndex((eq) => eq.id === selectedId);
    if (idx >= 0) setPageIndex(Math.floor(idx / PAGE_SIZE));
  }, [selectedId, filtered]);

  // reset if current page out of range
  useEffect(() => {
    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    if (pageIndex >= pageCount) setPageIndex(0);
  }, [filtered, pageIndex]);

  const pageData = useMemo(
    () => filtered.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE),
    [filtered, pageIndex],
  );

  const columns = useMemo<ColumnDef<Earthquake, unknown>[]>(
    () =>
      columnOrder.map((key) => {
        const header = key === 'mag' ? 'Magnitude' : key.charAt(0).toUpperCase() + key.slice(1);
        const col: ColumnDef<Earthquake, unknown> = { accessorKey: key, header };
        if (key === 'time' || key === 'updated') {
          col.cell = (info) =>
            new Date(info.getValue<string>()).toLocaleString('ca', {
              hour12: false,
            });
        }
        return col;
      }),
    [],
  );

  const table = useReactTable({
    data: pageData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-3 h-full flex flex-col overflow-hidden bg-[var(--panel-bg)]">
      {/* Table area: scrolls internally, fixed to parent height */}
      <div className="flex-1 overflow-auto max-h-full min-h-[270px]">
        <table className="table-auto w-max text-left text-[var(--panel-fg)]">
          <thead className="sticky top-0 bg-[var(--panel-bg)] z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-2 py-1 border-b ${
                      header.column.id === 'place' ? 'whitespace-nowrap' : ''
                    }`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isSel = row.original.id === selectedId;
              return (
                <tr
                  key={row.id}
                  onClick={() => dispatch(setSelectedId(row.original.id))}
                  className={`cursor-pointer transition-colors ${
                    isSel
                      ? 'bg-[var(--selected-bg)] text-[var(--selected-fg)]'
                      : 'even:bg-[var(--even-row-bg)] hover:bg-[var(--hover-bg)]'
                  }`}
                  style={{ minHeight: '270px' }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-2 py-1 border-b ${
                        cell.column.id === 'place' ? 'whitespace-nowrap' : 'break-words'
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setPageIndex((i) => Math.max(i - 1, 0))}
          disabled={pageIndex === 0}
          className="
            px-3 py-1 border rounded
            bg-[var(--bg)] text-[var(--fg)] border-[var(--panel-fg)]
            hover:bg-[var(--hover-bg)]
            disabled:opacity-50
          "
        >
          Previous
        </button>
        <span className="text-[var(--fg)]">
          Page {pageIndex + 1} of {Math.ceil(filtered.length / PAGE_SIZE)}
        </span>
        <button
          onClick={() =>
            setPageIndex((i) => Math.min(i + 1, Math.ceil(filtered.length / PAGE_SIZE) - 1))
          }
          disabled={pageIndex + 1 === Math.ceil(filtered.length / PAGE_SIZE)}
          className="
           px-3 py-1 border rounded
           bg-[var(--bg)] text-[var(--fg)] border-[var(--panel-fg)]
           hover:bg-[var(--hover-bg)]
           disabled:opacity-50
         "
        >
          Next
        </button>
      </div>
    </div>
  );
}
