import Papa from "papaparse";

/** Downloads selected QR values as a single-column CSV. */
export function downloadProcurementCsv(values: string[], heading: string, filename: string) {
    const csv = Papa.unparse({fields: [heading], data: values.map(value => [value])}, {quotes: true, newline: "\r\n"}) + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], {type: "text/csv;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
