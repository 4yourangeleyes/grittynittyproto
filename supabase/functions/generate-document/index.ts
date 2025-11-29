// Supabase Edge Function: generate-document
// Deploy with: supabase functions deploy generate-document
// This function securely calls Google GenAI using your API key stored as a Supabase secret
// @ts-ignore - This is a Deno Edge Function, not Node.js/Browser code
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore - Deno/npm imports
import { GoogleGenAI, Type, Schema } from "npm:@google/genai@^1.30.0"

// Types
interface GenerateDocumentRequest {
  prompt: string
  docType: "INVOICE" | "CONTRACT" | "HRDOC"
  clientName: string
  businessName: string
}

interface DocumentItem {
  description: string
  quantity: number
  unitType: string
  price: number
}

interface DocumentClause {
  title: string
  content: string
}

interface GenerateDocumentResponse {
  title?: string
  items?: DocumentItem[]
  clauses?: DocumentClause[]
  bodyText?: string
  error?: string
}

// Zod-like validation helper
function validateRequest(body: unknown): GenerateDocumentRequest {
  const data = body as Record<string, unknown>
  
  if (!data.prompt || typeof data.prompt !== 'string') {
    throw new Error('Missing or invalid prompt')
  }
  if (!data.docType || !['INVOICE', 'CONTRACT', 'HRDOC'].includes(data.docType as string)) {
    throw new Error('Missing or invalid docType')
  }
  if (!data.clientName || typeof data.clientName !== 'string') {
    throw new Error('Missing or invalid clientName')
  }
  if (!data.businessName || typeof data.businessName !== 'string') {
    throw new Error('Missing or invalid businessName')
  }

  // @ts-ignore - Deno type casting
  return data as GenerateDocumentRequest
}

// Schema for structured output
const documentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the document" },
    items: {
      type: Type.ARRAY,
      description: "List of items for an invoice",
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitType: { type: Type.STRING, description: "Unit of measure: 'hrs', 'ea', 'm', 'days', 'ft', 'sqm'" },
          price: { type: Type.NUMBER }
        }
      }
    },
    clauses: {
      type: Type.ARRAY,
      description: "List of clauses for a contract",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        }
      }
    },
    bodyText: { type: Type.STRING, description: "General body text for HR docs" }
  }
}

serve(async (req: Request) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Parse and validate request
    const body = await req.json()
    
    // 0. Health Check (Ping)
    if (body.ping) {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'AI service is online' }),
        { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    }

    const request = validateRequest(body)

    // Rate limit check (basic: 10 requests per minute per IP)
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    const cacheKey = `rate_limit:${clientIp}`
    // In production, use Deno.redis or similar for rate limiting
    // For now, we'll rely on Supabase's built-in rate limiting

    // Get API key from environment
    // @ts-ignore - Deno global
    const apiKey = Deno.env.get('GENAI_API_KEY')
    if (!apiKey) {
      throw new Error('GENAI_API_KEY not configured on server')
    }

    // Initialize Google GenAI
    const ai = new GoogleGenAI({ apiKey })
    const modelName = 'gemini-2.5-flash'

    // Build system prompt
    const systemInstruction = `
      You are an expert business document generator for a service business called "${request.businessName}".
      The user is creating a "${request.docType}" for a client named "${request.clientName}".
      
      If it is an INVOICE: Generate a list of items based on the user's description. 
      - Infer the 'unitType' based on the item context (e.g., 'Labor' = 'hrs', 'Pipe' = 'm', 'Widget' = 'ea', 'Consulting' = 'days').
      - Assume standard market rates if not specified.
      
      If it is a CONTRACT: Generate professional legal clauses appropriate for the jurisdiction and service described.
      If it is an HR DOC: Generate professional, clear HR policy or letter text.

      Return ONLY the raw JSON object adhering to the schema. Do NOT wrap in markdown or code blocks.
    `

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: modelName,
      contents: request.prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: documentSchema
      }
    })

    const responseText = response.text || "{}"
    
    // Parse and validate response
    let result: GenerateDocumentResponse
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI model' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Basic sanitization: ensure numbers are valid
    if (result.items) {
      result.items = result.items.map(item => ({
        description: (item.description || '').substring(0, 500),
        quantity: Math.max(0, Number(item.quantity) || 1),
        unitType: (item.unitType || 'ea').substring(0, 20),
        price: Math.max(0, Number(item.price) || 0)
      }))
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const status = errorMessage.includes('rate limit') ? 429 : 500

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
