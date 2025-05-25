import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: string[][];
      startY?: number;
      theme?: string;
      styles?: {
        fontSize?: number;
        [key: string]: any;
      };
      headStyles?: {
        fillColor?: number[] | [number, number, number];
        [key: string]: any;
      };
      [key: string]: any;
    }) => jsPDF;
  }
}