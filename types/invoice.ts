export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  clientName: string;
  companyName: string;
  items: InvoiceItem[];
  discount: number;
}