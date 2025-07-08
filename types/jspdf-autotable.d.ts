import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

declare module 'jspdf-autotable' {
  interface AutoTableOptions {
    head?: any[][];
    body?: any[][];
    startY?: number;
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    theme?: 'striped' | 'grid' | 'plain';
    margin?: { left?: number; right?: number; top?: number; bottom?: number };
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default autoTable;
}
