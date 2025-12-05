import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuickScreen from '../screens/QuickScreen';
import { DocType, Client } from '../types';

// Mock dependencies
vi.mock('../App', () => ({
  triggerHaptic: vi.fn(),
}));

vi.mock('../services/geminiService', () => ({
  generateDocumentContent: vi.fn(() =>
    Promise.resolve({
      success: true,
      data: {
        items: [
          { description: 'Test Item', quantity: 1, unitType: 'ea', price: 100 },
        ],
        clauses: [
          { title: 'Test Clause', content: 'Test content', order: 1 },
        ],
      },
    })
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProfile = {
  fullName: 'Test User',
  email: 'test@example.com',
  companyName: 'Test Co',
  currency: 'R',
  taxEnabled: true,
  taxRate: 15,
};

const mockClients: Client[] = [
  {
    id: 'client-1',
    businessName: 'ABC Plumbing',
    email: 'abc@example.com',
    phone: '123456789',
    address: '123 Main St',
  },
  {
    id: 'client-2',
    businessName: 'XYZ Construction',
    email: 'xyz@example.com',
  },
];

const mockSaveTemplate = vi.fn(() => Promise.resolve({ data: {}, error: null }));
const mockOnDocGenerated = vi.fn();

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <QuickScreen
        clients={mockClients}
        profile={mockProfile}
        templates={[]}
        saveTemplate={mockSaveTemplate}
        onDocGenerated={mockOnDocGenerated}
        {...props}
      />
    </BrowserRouter>
  );
};

describe('QuickScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Quick Create header', () => {
      renderComponent();
      expect(screen.getByText('Quick Create')).toBeInTheDocument();
      expect(screen.getByText(/AI-powered document generation/i)).toBeInTheDocument();
    });

    it('should render all 3 steps in progress indicator', () => {
      renderComponent();
      expect(screen.getByText('Client')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Describe')).toBeInTheDocument();
    });

    it('should start at step 1', () => {
      renderComponent();
      expect(screen.getByText('Select Client')).toBeInTheDocument();
      expect(screen.getByText('Who is this document for?')).toBeInTheDocument();
    });
  });

  describe('Step 1: Client Selection', () => {
    it('should display all clients', () => {
      renderComponent();
      expect(screen.getByText('ABC Plumbing')).toBeInTheDocument();
      expect(screen.getByText('XYZ Construction')).toBeInTheDocument();
    });

    it('should filter clients by search', () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Search clients...');
      fireEvent.change(searchInput, { target: { value: 'ABC' } });
      
      expect(screen.getByText('ABC Plumbing')).toBeInTheDocument();
      expect(screen.queryByText('XYZ Construction')).not.toBeInTheDocument();
    });

    it('should advance to step 2 when client is selected', () => {
      renderComponent();
      const clientButton = screen.getByText('ABC Plumbing').closest('button');
      fireEvent.click(clientButton!);
      
      expect(screen.getByText('Document Type')).toBeInTheDocument();
    });

    it('should show empty state when no clients exist', () => {
      renderComponent({ clients: [] });
      expect(screen.getByText('No clients found')).toBeInTheDocument();
      expect(screen.getByText('Add New Client')).toBeInTheDocument();
    });

    it('should navigate to clients page when Add New Client is clicked', () => {
      renderComponent({ clients: [] });
      const addButton = screen.getByText('Add New Client');
      fireEvent.click(addButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/clients');
    });
  });

  describe('Step 2: Document Type Selection', () => {
    it('should show invoice and contract options', () => {
      renderComponent();
      // Select client first
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      
      expect(screen.getByText('Invoice')).toBeInTheDocument();
      expect(screen.getByText('Contract')).toBeInTheDocument();
    });

    it('should advance to step 3 when document type is selected', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      
      const invoiceButton = screen.getByText('Invoice').closest('button');
      fireEvent.click(invoiceButton!);
      
      expect(screen.getByText('Describe the Work')).toBeInTheDocument();
    });
  });

  describe('Step 3: Work Description', () => {
    it('should display client and type selection summary', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      expect(screen.getByText(/ABC Plumbing/i)).toBeInTheDocument();
      expect(screen.getByText(/invoice/i)).toBeInTheDocument();
    });

    it('should show appropriate placeholder for invoice', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should show appropriate placeholder for contract', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Contract').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Website development/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should enable generate button when description is entered', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      fireEvent.change(textarea, { target: { value: 'Test work description' } });
      
      const generateButton = screen.getByText('Generate Document');
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('Document Generation', () => {
    it('should generate invoice document', async () => {
      const { generateDocumentContent } = await import('../services/geminiService');
      
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      fireEvent.change(textarea, { target: { value: 'Plumbing work' } });
      
      fireEvent.click(screen.getByText('Generate Document'));
      
      await waitFor(() => {
        expect(generateDocumentContent).toHaveBeenCalled();
      });
    });

    it('should save generated template', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      fireEvent.change(textarea, { target: { value: 'Test work' } });
      
      fireEvent.click(screen.getByText('Generate Document'));
      
      await waitFor(() => {
        expect(mockSaveTemplate).toHaveBeenCalled();
      });
    });

    it('should navigate to canvas after generation', async () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      fireEvent.change(textarea, { target: { value: 'Test work' } });
      
      fireEvent.click(screen.getByText('Generate Document'));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/canvas');
      });
    });
  });

  describe('Navigation', () => {
    it('should allow going back to previous steps', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      
      expect(screen.getByText('Select Client')).toBeInTheDocument();
    });

    it('should not show back button on step 1', () => {
      renderComponent();
      expect(screen.queryByText('Back')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle AI generation failure', async () => {
      const mockError = vi.fn(() =>
        Promise.resolve({ success: false, data: null })
      );
      
      vi.mocked(require('../services/geminiService').generateDocumentContent).mockImplementation(mockError);
      
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      fireEvent.change(textarea, { target: { value: 'Test' } });
      
      fireEvent.click(screen.getByText('Generate Document'));
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to generate'));
      });
    });
  });

  describe('Security', () => {
    it('should sanitize description input', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      fireEvent.change(textarea, {
        target: { value: '<script>alert("xss")</script>Test' },
      });
      
      // Should not contain script tags
      expect(textarea.value).not.toContain('<script>');
    });
  });

  describe('Accessibility', () => {
    it('should auto-focus search input on step 1', () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Search clients...');
      expect(document.activeElement).toBe(searchInput);
    });

    it('should auto-focus textarea on step 3', () => {
      renderComponent();
      fireEvent.click(screen.getByText('ABC Plumbing').closest('button')!);
      fireEvent.click(screen.getByText('Invoice').closest('button')!);
      
      const textarea = screen.getByPlaceholderText(/Bathroom renovation/i);
      expect(document.activeElement).toBe(textarea);
    });
  });
});
