export function generateCSV(data: Record<string, any>[], columns: string[]): string {
  if (data.length === 0) return '';

  // Header row
  const header = columns.join(',');

  // Data rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const value = item[col] ?? '';
        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [header, ...rows].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function downloadExcel(content: string, filename: string): void {
  // For Excel, we use the same CSV format since proper Excel export
  // would require a library like exceljs. This creates a CSV that
  // Excel can open directly.
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.xls') ? filename : `${filename}.xls`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
