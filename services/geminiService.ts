
/**
 * Gemini Service - Wrapper around Supabase Edge Function
 * 
 * This now calls a secure backend Edge Function instead of making
 * client-side API calls. The actual API key is stored securely on Supabase.
 */

import { generateDocumentViaEdgeFunction } from './supabaseClient';
import { DocType } from '../types';

export const generateDocumentContent = async (
  prompt: string,
  docType: DocType,
  clientName: string,
  businessName: string
) => {
  try {
    // Call the Supabase Edge Function (which securely uses GENAI_API_KEY)
    const result = await generateDocumentViaEdgeFunction(
      prompt,
      docType === DocType.INVOICE ? 'INVOICE' : docType === DocType.CONTRACT ? 'CONTRACT' : 'HRDOC',
      clientName,
      businessName
    );

    return result;
  } catch (error) {
    console.error("Document generation error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate document.");
  }
};
