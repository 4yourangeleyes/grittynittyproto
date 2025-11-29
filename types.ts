
export enum DocType {
  INVOICE = 'Invoice',
  CONTRACT = 'Contract',
  HR_DOC = 'HR Document'
}

export type DocStatus = 'Draft' | 'Sent' | 'Paid' | 'Signed';
export type InvoiceTheme = 'swiss' | 'geometric' | 'blueprint' | 'modernist' | 'minimal' | 'artisan' | 'corporate' | 'brutalist' | 'asymmetric';

export interface Client {
  id: string;
  businessName: string;
  registrationNumber?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitType: string; // e.g., 'hrs', 'm', 'ea', 'days', 'items'
  price: number;
  templateBlockName?: string; // Optional: name of template block this item belongs to
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
}

export interface DocumentData {
  id: string;
  type: DocType;
  status: DocStatus;
  title: string;
  client: Client;
  date: string;
  dueDate?: string; // Payment due date
  currency: string;
  theme?: InvoiceTheme; // New field for styling
  contractId?: string; // Optional: selected contract to attach when sending
  notes?: string; // Invoice notes/terms displayed before totals
  shareableLink?: string; // Link to publicly view invoice
  // Invoice specific
  items?: InvoiceItem[];
  subtotal?: number;
  taxTotal?: number;
  total?: number;
  vat_enabled?: boolean; // SA compliance - whether to show VAT
  tax_rate?: number; // SA compliance - tax percentage
  // Contract specific
  clauses?: ContractClause[];
  // HR/Generic
  bodyText?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  companyName: string;
  industry?: string;
  registrationNumber?: string;
  vatRegistrationNumber?: string; // SA VAT compliance
  businessType?: 1 | 2; // 1 = registered, 2 = unregistered
  jurisdiction?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  website?: string;
  // Financials
  currency: string;
  taxEnabled: boolean;
  taxName?: string; // e.g. VAT, GST
  taxRate?: number; // e.g. 20
}

export interface TemplateBlock {
  id: string;
  name: string; 
  category: string; 
  type: DocType; 
  items?: InvoiceItem[]; 
  clause?: ContractClause; 
}

// Web Speech API Types
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}