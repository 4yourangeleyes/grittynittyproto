import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User, FileText, Send, Loader, Package, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Client, DocType, UserProfile, TemplateBlock, InvoiceItem, ContractClause, ContractType, DocumentData } from '../types';
import { triggerHaptic } from '../App';
import { generateDocumentContent } from '../services/geminiService';

interface QuickScreenProps {
  clients: Client[];
  profile: UserProfile;
  templates: TemplateBlock[];
  saveTemplate: (template: TemplateBlock) => Promise<any>;
  onDocGenerated: (doc: DocumentData) => void;
}

const STEPS = [
  { id: 1, label: 'Client', icon: <User size={18} /> },
  { id: 2, label: 'Type', icon: <FileText size={18} /> },
  { id: 3, label: 'Describe', icon: <Sparkles size={18} /> },
];

const QuickScreen: React.FC<QuickScreenProps> = ({ 
  clients, 
  profile, 
  templates, 
  saveTemplate,
  onDocGenerated 
}) => {
  const navigate = useNavigate();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [docType, setDocType] = useState<'invoice' | 'contract'>('invoice');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Client Search
  const [clientSearch, setClientSearch] = useState('');
  const filteredClients = clientSearch
    ? clients.filter(c => c.businessName.toLowerCase().includes(clientSearch.toLowerCase()))
    : clients;

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.businessName);
    setStep(2);
    triggerHaptic('light');
  };

  const handleSelectDocType = (type: 'invoice' | 'contract') => {
    setDocType(type);
    setStep(3);
    triggerHaptic('light');
  };

  const handleGenerateDocument = async () => {
    if (!selectedClient || !description.trim()) return;

    setIsProcessing(true);
    try {
      // Call AI to generate document structure
      const result = await generateDocumentContent(
        description,
        docType === 'invoice' ? DocType.INVOICE : DocType.CONTRACT,
        selectedClient.businessName,
        profile.companyName,
        profile.industry,
        undefined,
        templates
      );

      if (!result.success || !result.data) {
        alert('Failed to generate document. Please try again.');
        setIsProcessing(false);
        return;
      }

      const aiData = result.data;
      
      // Process invoice items or contract clauses
      let generatedItems: InvoiceItem[] = [];
      let generatedClauses: ContractClause[] = [];
      
      if (docType === 'invoice' && aiData.items) {
        generatedItems = aiData.items.map((item: any, index: number) => ({
          id: `quick-item-${Date.now()}-${index}`,
          description: item.description || item.name || 'Item',
          quantity: parseFloat(item.quantity) || 1,
          unitType: item.unitType || item.unit || 'ea',
          price: parseFloat(item.price) || parseFloat(item.rate) || 0,
        }));

        // Save items as a template block for future use
        const templateBlock: TemplateBlock = {
          id: `quick-template-${Date.now()}`,
          name: `Quick: ${description.substring(0, 50)}`,
          category: 'Quick Generated',
          type: DocType.INVOICE,
          items: generatedItems,
        };
        
        await saveTemplate(templateBlock);
      } else if (docType === 'contract' && aiData.clauses) {
        generatedClauses = aiData.clauses.map((clause: any, index: number) => ({
          id: `quick-clause-${Date.now()}-${index}`,
          title: clause.title || `Clause ${index + 1}`,
          content: clause.content || clause.text || '',
          order: index + 1,
          category: clause.category,
          required: clause.required,
        }));

        // Save clauses as a template for future use
        const templateBlock: TemplateBlock = {
          id: `quick-template-${Date.now()}`,
          name: `Quick: ${description.substring(0, 50)}`,
          category: 'Quick Generated',
          type: DocType.CONTRACT,
          clauses: generatedClauses,
          contractType: aiData.contractType || ContractType.SERVICE_AGREEMENT,
        };
        
        await saveTemplate(templateBlock);
      }

      // Calculate totals for invoice
      let subtotal = 0;
      let taxTotal = 0;
      let total = 0;
      
      if (docType === 'invoice') {
        subtotal = generatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        taxTotal = profile.taxEnabled ? subtotal * (profile.taxRate || 0) / 100 : 0;
        total = subtotal + taxTotal;
      }

      // Create the document
      const newDoc: DocumentData = {
        id: `quick-doc-${Date.now()}`,
        type: docType === 'invoice' ? DocType.INVOICE : DocType.CONTRACT,
        status: 'Draft',
        title: aiData.title || `${docType === 'invoice' ? 'Invoice' : 'Contract'} for ${selectedClient.businessName}`,
        client: selectedClient,
        date: new Date().toISOString().split('T')[0],
        dueDate: aiData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: profile.currency,
        theme: aiData.theme || 'geometric',
        contractTheme: aiData.contractTheme || 'modern',
        items: docType === 'invoice' ? generatedItems : undefined,
        subtotal: docType === 'invoice' ? subtotal : undefined,
        taxTotal: docType === 'invoice' ? taxTotal : undefined,
        total: docType === 'invoice' ? total : undefined,
        clauses: docType === 'contract' ? generatedClauses : undefined,
        contractType: docType === 'contract' ? (aiData.contractType || ContractType.SERVICE_AGREEMENT) : undefined,
        scopeOfWork: aiData.scopeOfWork || description,
        notes: aiData.notes,
      };

      // Pass document to parent and navigate to Canvas
      onDocGenerated(newDoc);
      triggerHaptic('success');
      navigate('/canvas');

    } catch (error) {
      console.error('Quick generation error:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedClient !== null;
    if (step === 2) return true;
    if (step === 3) return description.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (step === 3) {
      handleGenerateDocument();
    } else if (canProceed()) {
      setStep(step + 1);
      triggerHaptic('light');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      triggerHaptic('light');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 bg-grit-primary border-2 border-grit-dark shadow-grit-md mb-4">
            <Zap size={40} className="text-grit-dark" />
          </div>
          <h1 className="text-4xl font-bold text-grit-dark mb-2">Quick Create</h1>
          <p className="text-gray-600 text-lg">
            AI-powered document generation in seconds
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 px-4">
          {STEPS.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 border-2 border-grit-dark flex items-center justify-center transition-all ${
                    step >= s.id
                      ? 'bg-grit-primary shadow-grit-sm'
                      : 'bg-grit-warm'
                  }`}
                >
                  {s.icon}
                </div>
                <span className={`text-sm font-bold mt-2 ${step >= s.id ? 'text-grit-dark' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${step > s.id ? 'bg-grit-dark' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-grit-white border-2 border-grit-dark shadow-grit-lg p-6 min-h-[400px]">
          {/* Step 1: Select Client */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-grit-dark mb-4">Select Client</h2>
              <p className="text-gray-600 mb-6">Who is this document for?</p>
              
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full px-4 py-3 border-2 border-grit-dark focus:outline-none focus:ring-2 focus:ring-grit-primary mb-4"
                autoFocus
              />

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No clients found</p>
                    <Button
                      onClick={() => navigate('/clients')}
                      className="bg-grit-primary border-2 border-grit-dark"
                    >
                      Add New Client
                    </Button>
                  </div>
                ) : (
                  filteredClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className={`w-full text-left p-4 border-2 transition-all ${
                        selectedClient?.id === client.id
                          ? 'border-grit-primary bg-grit-primary/10 shadow-grit-sm'
                          : 'border-grit-dark hover:border-grit-primary hover:bg-grit-warm'
                      }`}
                    >
                      <p className="font-bold text-grit-dark">{client.businessName}</p>
                      {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Document Type */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-grit-dark mb-4">Document Type</h2>
              <p className="text-gray-600 mb-6">What would you like to create?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectDocType('invoice')}
                  className={`p-8 border-2 transition-all ${
                    docType === 'invoice'
                      ? 'border-grit-primary bg-grit-primary/10 shadow-grit-md'
                      : 'border-grit-dark hover:border-grit-primary hover:bg-grit-warm'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Package size={48} className="mb-4 text-grit-dark" />
                    <span className="font-bold text-lg">Invoice</span>
                    <span className="text-sm text-gray-600 mt-2">Itemized billing document</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectDocType('contract')}
                  className={`p-8 border-2 transition-all ${
                    docType === 'contract'
                      ? 'border-grit-primary bg-grit-primary/10 shadow-grit-md'
                      : 'border-grit-dark hover:border-grit-primary hover:bg-grit-warm'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <FileText size={48} className="mb-4 text-grit-dark" />
                    <span className="font-bold text-lg">Contract</span>
                    <span className="text-sm text-gray-600 mt-2">Legal agreement with clauses</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Describe Work */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-grit-dark mb-4">Describe the Work</h2>
              <p className="text-gray-600 mb-6">
                Tell us what you need in the {docType}. Our AI will generate the appropriate{' '}
                {docType === 'invoice' ? 'line items' : 'contract clauses'}.
              </p>

              <div className="mb-4">
                <label className="block font-bold text-grit-dark mb-2">
                  Client: <span className="text-grit-primary">{selectedClient?.businessName}</span>
                </label>
                <label className="block font-bold text-grit-dark mb-2">
                  Type: <span className="text-grit-primary capitalize">{docType}</span>
                </label>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  docType === 'invoice'
                    ? "Example: 'Bathroom renovation including new toilet, basin, and tiling. Labor for 3 days plus materials.'"
                    : "Example: 'Website development project with 3 milestones: design, development, and deployment. Payment on completion of each milestone.'"
                }
                rows={8}
                className="w-full px-4 py-3 border-2 border-grit-dark focus:outline-none focus:ring-2 focus:ring-grit-primary resize-none font-mono text-sm"
                autoFocus
              />

              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200">
                <div className="flex items-start gap-2">
                  <Sparkles size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-bold mb-1">AI will automatically:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      {docType === 'invoice' ? (
                        <>
                          <li>Break down your description into line items</li>
                          <li>Suggest quantities and pricing</li>
                          <li>Save items as a reusable template</li>
                          <li>Calculate totals with tax</li>
                        </>
                      ) : (
                        <>
                          <li>Generate relevant contract clauses</li>
                          <li>Structure payment and delivery terms</li>
                          <li>Save clauses as a reusable template</li>
                          <li>Format for legal clarity</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          {step > 1 && (
            <Button
              onClick={handleBack}
              disabled={isProcessing}
              className="flex-1 bg-grit-warm border-2 border-grit-dark shadow-grit-sm"
            >
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isProcessing}
            className="flex-1 bg-grit-primary border-2 border-grit-dark shadow-grit-sm"
          >
            {isProcessing ? (
              <>
                <Loader size={20} className="animate-spin" />
                Generating...
              </>
            ) : step === 3 ? (
              <>
                <Send size={20} />
                Generate Document
              </>
            ) : (
              <>
                Next
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </div>

        {/* Example Templates Preview */}
        {step === 3 && templates.length > 0 && (
          <div className="mt-8 p-4 bg-grit-warm border-2 border-grit-dark">
            <h3 className="font-bold text-grit-dark mb-3">Your Saved Templates ({templates.filter(t => 
              docType === 'invoice' ? t.type === DocType.INVOICE : t.type === DocType.CONTRACT
            ).length})</h3>
            <p className="text-sm text-gray-600">
              AI will use your previous templates to generate better suggestions.
              <button
                onClick={() => navigate('/templates')}
                className="ml-2 text-grit-primary hover:underline font-bold"
              >
                View Templates →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickScreen;
