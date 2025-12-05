import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Sparkles, Save, X, Package, FileText, Loader } from 'lucide-react';
import { Button } from '../components/Button';
import { TemplateBlock, DocType, InvoiceItem, ContractClause, ContractType, UserProfile } from '../types';
import { triggerHaptic } from '../App';
import { generateDocumentContent } from '../services/geminiService';

interface TemplatesScreenProps {
  templates: TemplateBlock[];
  saveTemplate: (template: TemplateBlock) => Promise<any>;
  deleteTemplate: (id: string) => Promise<void>;
  profile: UserProfile;
}

const UNIT_TYPES = [
  { value: 'hrs', label: 'Hours' },
  { value: 'ea', label: 'Each' },
  { value: 'm', label: 'Meters' },
  { value: 'sqm', label: 'm²' },
  { value: 'set', label: 'Set' },
  { value: 'day', label: 'Days' },
];

const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ templates, saveTemplate, deleteTemplate, profile }) => {
  const navigate = useNavigate();
  
  // UI State
  const [activeTab, setActiveTab] = useState<'invoice' | 'contract'>('invoice');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateBlock | null>(null);
  
  // Template Creation Form State
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [contractType, setContractType] = useState<ContractType>(ContractType.SERVICE_AGREEMENT);
  
  // Invoice Items State (for invoice templates)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [tempItemDesc, setTempItemDesc] = useState('');
  const [tempItemPrice, setTempItemPrice] = useState('');
  const [tempItemQty, setTempItemQty] = useState('1');
  const [tempItemUnit, setTempItemUnit] = useState('ea');
  
  // Contract Clauses State (for contract templates)
  const [contractClauses, setContractClauses] = useState<ContractClause[]>([]);
  const [tempClauseTitle, setTempClauseTitle] = useState('');
  const [tempClauseContent, setTempClauseContent] = useState('');
  
  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Filter templates by active tab
  const filteredTemplates = templates.filter(t => 
    activeTab === 'invoice' ? t.type === DocType.INVOICE : t.type === DocType.CONTRACT
  );

  // Group templates by category
  const groupedTemplates = filteredTemplates.reduce((acc, t) => {
    const category = t.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(t);
    return acc;
  }, {} as Record<string, TemplateBlock[]>);

  const handleAddInvoiceItem = () => {
    if (!tempItemDesc || !tempItemPrice) return;
    
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: tempItemDesc,
      quantity: parseFloat(tempItemQty) || 1,
      unitType: tempItemUnit,
      price: parseFloat(tempItemPrice) || 0,
    };
    
    setInvoiceItems([...invoiceItems, newItem]);
    setTempItemDesc('');
    setTempItemPrice('');
    setTempItemQty('1');
    triggerHaptic('light');
  };

  const handleRemoveInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
    triggerHaptic('light');
  };

  const handleAddClause = () => {
    if (!tempClauseTitle || !tempClauseContent) return;
    
    const newClause: ContractClause = {
      id: `clause-${Date.now()}-${Math.random()}`,
      title: tempClauseTitle,
      content: tempClauseContent,
      order: contractClauses.length + 1,
    };
    
    setContractClauses([...contractClauses, newClause]);
    setTempClauseTitle('');
    setTempClauseContent('');
    triggerHaptic('light');
  };

  const handleRemoveClause = (id: string) => {
    setContractClauses(contractClauses.filter(clause => clause.id !== id));
    triggerHaptic('light');
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingAI(true);
    try {
      const result = await generateDocumentContent(
        aiPrompt,
        activeTab === 'invoice' ? DocType.INVOICE : DocType.CONTRACT,
        'Template Client',
        profile.companyName,
        profile.industry,
        undefined,
        templates
      );

      if (result.success && result.data) {
        if (activeTab === 'invoice' && result.data.items) {
          // Add AI-generated invoice items
          const aiItems = result.data.items.map((item: any) => ({
            id: `ai-item-${Date.now()}-${Math.random()}`,
            description: item.description || item.name || 'Item',
            quantity: item.quantity || 1,
            unitType: item.unitType || item.unit || 'ea',
            price: item.price || item.rate || 0,
          }));
          setInvoiceItems([...invoiceItems, ...aiItems]);
          triggerHaptic('success');
        } else if (activeTab === 'contract' && result.data.clauses) {
          // Add AI-generated contract clauses
          const aiClauses = result.data.clauses.map((clause: any, index: number) => ({
            id: `ai-clause-${Date.now()}-${Math.random()}-${index}`,
            title: clause.title || `Clause ${contractClauses.length + index + 1}`,
            content: clause.content || clause.text || '',
            order: contractClauses.length + index + 1,
            category: clause.category,
          }));
          setContractClauses([...contractClauses, ...aiClauses]);
          triggerHaptic('success');
        }
        setAiPrompt('');
      } else {
        alert('AI generation failed. Please try again.');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate with AI. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (activeTab === 'invoice' && invoiceItems.length === 0) {
      alert('Please add at least one invoice item');
      return;
    }

    if (activeTab === 'contract' && contractClauses.length === 0) {
      alert('Please add at least one contract clause');
      return;
    }

    const newTemplate: TemplateBlock = {
      id: editingTemplate?.id || `template-${Date.now()}`,
      name: templateName,
      category: templateCategory || 'General',
      type: activeTab === 'invoice' ? DocType.INVOICE : DocType.CONTRACT,
      items: activeTab === 'invoice' ? invoiceItems : undefined,
      clauses: activeTab === 'contract' ? contractClauses : undefined,
      contractType: activeTab === 'contract' ? contractType : undefined,
    };

    try {
      const result = await saveTemplate(newTemplate);
      if (result.error) {
        alert('Failed to save template: ' + result.error.message);
        return;
      }
      
      triggerHaptic('success');
      handleCloseModal();
    } catch (error) {
      console.error('Save template error:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleEditTemplate = (template: TemplateBlock) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateCategory(template.category);
    setContractType(template.contractType || ContractType.SERVICE_AGREEMENT);
    setInvoiceItems(template.items || []);
    setContractClauses(template.clauses || []);
    setActiveTab(template.type === DocType.INVOICE ? 'invoice' : 'contract');
    setShowCreateModal(true);
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await deleteTemplate(id);
      triggerHaptic('light');
    } catch (error) {
      console.error('Delete template error:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateCategory('');
    setInvoiceItems([]);
    setContractClauses([]);
    setAiPrompt('');
    setTempItemDesc('');
    setTempItemPrice('');
    setTempItemQty('1');
    setTempClauseTitle('');
    setTempClauseContent('');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-grit-dark">Templates</h1>
            <p className="text-gray-600 mt-1">Create and manage reusable invoice blocks and contract clauses</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-grit-primary border-2 border-grit-dark shadow-grit-sm hover:translate-y-[1px] hover:shadow-none"
          >
            <Plus size={20} />
            Create Template
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-grit-dark">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-6 py-3 font-bold border-2 border-b-0 border-grit-dark transition-all ${
              activeTab === 'invoice'
                ? 'bg-grit-white -mb-0.5 z-10'
                : 'bg-grit-warm hover:bg-grit-white/50'
            }`}
          >
            <Package size={18} className="inline mr-2" />
            Invoice Blocks
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-6 py-3 font-bold border-2 border-b-0 border-grit-dark transition-all ${
              activeTab === 'contract'
                ? 'bg-grit-white -mb-0.5 z-10'
                : 'bg-grit-warm hover:bg-grit-white/50'
            }`}
          >
            <FileText size={18} className="inline mr-2" />
            Contract Clauses
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto">
        {Object.keys(groupedTemplates).length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-grit-warm border-2 border-grit-dark shadow-grit-md mb-4">
              {activeTab === 'invoice' ? <Package size={48} /> : <FileText size={48} />}
            </div>
            <h3 className="text-xl font-bold text-grit-dark mb-2">
              No {activeTab === 'invoice' ? 'Invoice Blocks' : 'Contract Clauses'} Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create reusable templates to speed up your document creation
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-grit-primary border-2 border-grit-dark shadow-grit-sm"
            >
              <Plus size={20} />
              Create Your First Template
            </Button>
          </div>
        ) : (
          Object.entries(groupedTemplates).map(([category, categoryTemplates]: [string, TemplateBlock[]]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold text-grit-dark mb-4 px-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map(template => (
                  <div
                    key={template.id}
                    className="bg-grit-white border-2 border-grit-dark shadow-grit-sm p-4 hover:shadow-grit-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-grit-dark flex-1">{template.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="p-1.5 hover:bg-grit-warm border border-transparent hover:border-grit-dark transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id, template.name)}
                          className="p-1.5 hover:bg-red-50 border border-transparent hover:border-red-500 text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {template.contractType && (
                      <p className="text-sm text-gray-600 mb-2">{template.contractType}</p>
                    )}
                    
                    <div className="text-sm text-gray-700">
                      {template.items && template.items.length > 0 && (
                        <p>{template.items.length} invoice {template.items.length === 1 ? 'item' : 'items'}</p>
                      )}
                      {template.clauses && template.clauses.length > 0 && (
                        <p>{template.clauses.length} contract {template.clauses.length === 1 ? 'clause' : 'clauses'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-grit-white border-2 border-grit-dark shadow-grit-lg max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-grit-dark text-grit-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Info */}
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-grit-dark mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Bathroom Renovation Package"
                    className="w-full px-4 py-2 border-2 border-grit-dark focus:outline-none focus:ring-2 focus:ring-grit-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-grit-dark mb-2">Category</label>
                  <input
                    type="text"
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                    placeholder="e.g., Plumbing, Legal, Marketing"
                    className="w-full px-4 py-2 border-2 border-grit-dark focus:outline-none focus:ring-2 focus:ring-grit-primary"
                  />
                </div>

                {activeTab === 'contract' && (
                  <div>
                    <label className="block font-bold text-grit-dark mb-2">Contract Type</label>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value as ContractType)}
                      className="w-full px-4 py-2 border-2 border-grit-dark focus:outline-none focus:ring-2 focus:ring-grit-primary"
                    >
                      {Object.values(ContractType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* AI Generation Section */}
              <div className="bg-grit-warm border-2 border-grit-dark p-4">
                <label className="block font-bold text-grit-dark mb-2 flex items-center gap-2">
                  <Sparkles size={18} className="text-grit-primary" />
                  Generate with AI
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={
                      activeTab === 'invoice'
                        ? "Describe the invoice items you need (e.g., 'Standard bathroom plumbing package with fixtures')"
                        : "Describe the contract clauses you need (e.g., 'Payment terms for milestone-based project')"
                    }
                    rows={3}
                    className="flex-1 px-4 py-2 border-2 border-grit-dark focus:outline-none focus:ring-2 focus:ring-grit-primary resize-none"
                  />
                  <Button
                    onClick={handleGenerateWithAI}
                    disabled={isGeneratingAI || !aiPrompt.trim()}
                    className="bg-grit-primary border-2 border-grit-dark shadow-grit-sm h-fit"
                  >
                    {isGeneratingAI ? <Loader size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  </Button>
                </div>
              </div>

              {/* Invoice Items Section */}
              {activeTab === 'invoice' && (
                <div>
                  <h3 className="font-bold text-grit-dark mb-3">Invoice Items</h3>
                  
                  {/* Add Item Form */}
                  <div className="grid grid-cols-12 gap-2 mb-4">
                    <input
                      type="text"
                      value={tempItemDesc}
                      onChange={(e) => setTempItemDesc(e.target.value)}
                      placeholder="Description"
                      className="col-span-5 px-3 py-2 border-2 border-grit-dark text-sm"
                    />
                    <input
                      type="number"
                      value={tempItemQty}
                      onChange={(e) => setTempItemQty(e.target.value)}
                      placeholder="Qty"
                      className="col-span-2 px-3 py-2 border-2 border-grit-dark text-sm"
                    />
                    <select
                      value={tempItemUnit}
                      onChange={(e) => setTempItemUnit(e.target.value)}
                      className="col-span-2 px-2 py-2 border-2 border-grit-dark text-sm"
                    >
                      {UNIT_TYPES.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={tempItemPrice}
                      onChange={(e) => setTempItemPrice(e.target.value)}
                      placeholder="Price"
                      className="col-span-2 px-3 py-2 border-2 border-grit-dark text-sm"
                    />
                    <Button
                      onClick={handleAddInvoiceItem}
                      disabled={!tempItemDesc || !tempItemPrice}
                      className="col-span-1 bg-grit-primary border-2 border-grit-dark p-2"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {invoiceItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No items added yet</p>
                    ) : (
                      invoiceItems.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-white border border-grit-dark p-3"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.description}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.unitType} × {profile.currency}{item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveInvoiceItem(item.id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Contract Clauses Section */}
              {activeTab === 'contract' && (
                <div>
                  <h3 className="font-bold text-grit-dark mb-3">Contract Clauses</h3>
                  
                  {/* Add Clause Form */}
                  <div className="space-y-2 mb-4">
                    <input
                      type="text"
                      value={tempClauseTitle}
                      onChange={(e) => setTempClauseTitle(e.target.value)}
                      placeholder="Clause Title (e.g., Payment Terms)"
                      className="w-full px-3 py-2 border-2 border-grit-dark"
                    />
                    <textarea
                      value={tempClauseContent}
                      onChange={(e) => setTempClauseContent(e.target.value)}
                      placeholder="Clause content..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-grit-dark resize-none"
                    />
                    <Button
                      onClick={handleAddClause}
                      disabled={!tempClauseTitle || !tempClauseContent}
                      className="w-full bg-grit-primary border-2 border-grit-dark"
                    >
                      <Plus size={16} />
                      Add Clause
                    </Button>
                  </div>

                  {/* Clauses List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {contractClauses.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No clauses added yet</p>
                    ) : (
                      contractClauses.map(clause => (
                        <div
                          key={clause.id}
                          className="bg-white border border-grit-dark p-3"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-grit-dark">{clause.title}</h4>
                            <button
                              onClick={() => handleRemoveClause(clause.id)}
                              className="p-1 hover:bg-red-50 text-red-500 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{clause.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t-2 border-grit-dark">
                <Button
                  onClick={handleCloseModal}
                  className="flex-1 bg-grit-warm border-2 border-grit-dark"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="flex-1 bg-grit-primary border-2 border-grit-dark shadow-grit-sm"
                >
                  <Save size={20} />
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesScreen;
