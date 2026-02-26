/**
 * Escapes a single CSV cell value.
 * - Wraps in double-quotes if the value contains a comma, double-quote, or newline.
 * - Escapes existing double-quotes by doubling them.
 */
function escapeCell(value: string): string {
  const needsQuoting = value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r');
  if (needsQuoting) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Builds a CSV string from headers and rows, then triggers a browser download.
 *
 * @param filename  The suggested download filename (e.g. "users.csv")
 * @param headers   Array of column header strings
 * @param rows      2-D array of string values; each inner array is one row
 */
export function downloadCSV(filename: string, headers: string[], rows: string[][]): void {
  const allRows = [headers, ...rows];
  const csv = allRows
    .map((row) => row.map(escapeCell).join(','))
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
