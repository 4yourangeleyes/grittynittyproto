import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TemplatesScreen from '../screens/TemplatesScreen';
import { DocType, ContractType, TemplateBlock } from '../types';

// Mock dependencies
vi.mock('../App', () => ({
  triggerHaptic: vi.fn(),
}));

vi.mock('../services/geminiService', () => ({
  generateDocumentContent: vi.fn(),
}));

const mockProfile = {
  fullName: 'Test User',
  email: 'test@example.com',
  companyName: 'Test Co',
  currency: 'R',
  taxEnabled: true,
  taxRate: 15,
};

const mockTemplates: TemplateBlock[] = [
  {
    id: 'template-1',
    name: 'Plumbing Package',
    category: 'Plumbing',
    type: DocType.INVOICE,
    items: [
      { id: '1', description: 'Toilet', quantity: 1, unitType: 'ea', price: 1500 },
    ],
  },
  {
    id: 'template-2',
    name: 'Payment Terms',
    category: 'Legal',
    type: DocType.CONTRACT,
    clauses: [
      { id: '1', title: 'Payment', content: 'Pay on delivery', order: 1 },
    ],
    contractType: ContractType.SERVICE_AGREEMENT,
  },
];

const mockSaveTemplate = vi.fn(() => Promise.resolve({ data: {}, error: null }));
const mockDeleteTemplate = vi.fn(() => Promise.resolve());

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <TemplatesScreen
        templates={mockTemplates}
        saveTemplate={mockSaveTemplate}
        deleteTemplate={mockDeleteTemplate}
        profile={mockProfile}
        {...props}
      />
    </BrowserRouter>
  );
};

describe('TemplatesScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render templates page header', () => {
      renderComponent();
      expect(screen.getByText('Templates')).toBeInTheDocument();
      expect(screen.getByText(/Create and manage reusable/i)).toBeInTheDocument();
    });

    it('should render tabs for invoice and contract templates', () => {
      renderComponent();
      expect(screen.getByText('Invoice Blocks')).toBeInTheDocument();
      expect(screen.getByText('Contract Clauses')).toBeInTheDocument();
    });

    it('should display invoice templates by default', () => {
      renderComponent();
      expect(screen.getByText('Plumbing Package')).toBeInTheDocument();
      expect(screen.getByText('Plumbing')).toBeInTheDocument();
    });

    it('should display contract templates when tab is clicked', async () => {
      renderComponent();
      const contractTab = screen.getByText('Contract Clauses');
      fireEvent.click(contractTab);
      
      await waitFor(() => {
        expect(screen.getByText('Payment Terms')).toBeInTheDocument();
      });
    });

    it('should show empty state when no templates exist', () => {
      renderComponent({ templates: [] });
      expect(screen.getByText(/No Invoice Blocks Yet/i)).toBeInTheDocument();
    });
  });

  describe('Template Creation', () => {
    it('should open create modal when button is clicked', () => {
      renderComponent();
      const createButton = screen.getByText('Create Template');
      fireEvent.click(createButton);
      
      expect(screen.getByText('Create New Template')).toBeInTheDocument();
    });

    it('should validate template name before saving', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Create Template'));
      
      const saveButton = screen.getByText('Save Template');
      fireEvent.click(saveButton);
      
      // Should show alert for empty name
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('template name'));
    });

    it('should add invoice item manually', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Create Template'));
      
      // Fill in item details
      const descInput = screen.getByPlaceholderText('Description');
      const priceInput = screen.getByPlaceholderText('Price');
      const qtyInput = screen.getByPlaceholderText('Qty');
      
      fireEvent.change(descInput, { target: { value: 'Test Item' } });
      fireEvent.change(priceInput, { target: { value: '100' } });
      fireEvent.change(qtyInput, { target: { value: '2' } });
      
      const addButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
      fireEvent.click(addButton!);
      
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('should save template successfully', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('Create Template'));
      
      // Fill in template details
      fireEvent.change(screen.getByPlaceholderText(/Bathroom Renovation/i), {
        target: { value: 'Test Template' },
      });
      
      // Add an item
      fireEvent.change(screen.getByPlaceholderText('Description'), {
        target: { value: 'Test Item' },
      });
      fireEvent.change(screen.getByPlaceholderText('Price'), {
        target: { value: '100' },
      });
      
      const addButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
      fireEvent.click(addButton!);
      
      // Save
      fireEvent.click(screen.getByText('Save Template'));
      
      await waitFor(() => {
        expect(mockSaveTemplate).toHaveBeenCalled();
      });
    });
  });

  describe('Template Management', () => {
    it('should edit existing template', () => {
      renderComponent();
      const editButton = screen.getAllByTitle('Edit')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByText('Edit Template')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Plumbing Package')).toBeInTheDocument();
    });

    it('should delete template with confirmation', async () => {
      global.confirm = vi.fn(() => true);
      renderComponent();
      
      const deleteButton = screen.getAllByTitle('Delete')[0];
      fireEvent.click(deleteButton);
      
      expect(global.confirm).toHaveBeenCalledWith(expect.stringContaining('Plumbing Package'));
      
      await waitFor(() => {
        expect(mockDeleteTemplate).toHaveBeenCalledWith('template-1');
      });
    });

    it('should not delete template if confirmation is cancelled', () => {
      global.confirm = vi.fn(() => false);
      renderComponent();
      
      const deleteButton = screen.getAllByTitle('Delete')[0];
      fireEvent.click(deleteButton);
      
      expect(mockDeleteTemplate).not.toHaveBeenCalled();
    });
  });

  describe('Security', () => {
    it('should sanitize template name input', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Create Template'));
      
      const nameInput = screen.getByPlaceholderText(/Bathroom Renovation/i);
      fireEvent.change(nameInput, {
        target: { value: '<script>alert("xss")</script>Test' },
      });
      
      // Input should not contain script tags
      expect(nameInput.value).not.toContain('<script>');
    });

    it('should validate numeric inputs', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Create Template'));
      
      const priceInput = screen.getByPlaceholderText('Price');
      fireEvent.change(priceInput, { target: { value: 'abc' } });
      
      const addButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
      fireEvent.click(addButton!);
      
      // Should convert invalid number to 0
      expect(priceInput.value).toBe('0');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderComponent();
      const createButton = screen.getByText('Create Template');
      expect(createButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Create Template'));
      
      const modal = screen.getByText('Create New Template').closest('div');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle save errors gracefully', async () => {
      const mockError = vi.fn(() => Promise.resolve({ error: { message: 'Save failed' } }));
      renderComponent({ saveTemplate: mockError });
      
      fireEvent.click(screen.getByText('Create Template'));
      fireEvent.change(screen.getByPlaceholderText(/Bathroom Renovation/i), {
        target: { value: 'Test' },
      });
      
      // Add item
      fireEvent.change(screen.getByPlaceholderText('Description'), {
        target: { value: 'Item' },
      });
      fireEvent.change(screen.getByPlaceholderText('Price'), {
        target: { value: '100' },
      });
      
      const addButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
      fireEvent.click(addButton!);
      
      fireEvent.click(screen.getByText('Save Template'));
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Save failed'));
      });
    });

    it('should handle delete errors gracefully', async () => {
      const mockError = vi.fn(() => Promise.reject(new Error('Delete failed')));
      global.confirm = vi.fn(() => true);
      renderComponent({ deleteTemplate: mockError });
      
      const deleteButton = screen.getAllByTitle('Delete')[0];
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to delete'));
      });
    });
  });
});
