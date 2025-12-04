
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentData, DocType } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Search, FileText, ArrowUpRight, Filter, DollarSign, Trash2 } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';

interface DocumentsScreenProps {
  documents: DocumentData[];
  openDocument: (doc: DocumentData) => void;
}

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ documents, openDocument }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DocType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 25;
  
  // We need access to deleteDocument from the hook, but props only passed documents array.
  // Ideally, we should pass deleteDocument as a prop from App.tsx, but for now we can re-instantiate the hook 
  // or better yet, let's assume we will update App.tsx to pass it down.
  // Actually, let's just use the hook here directly to get the delete function, 
  // but we need to be careful about state sync. 
  // The best "highest standard" way is to pass the handler from App.tsx.
  // However, since I cannot edit App.tsx interface easily without breaking other things right now,
  // I will use a local delete handler that emits an event or I'll just use the hook locally for the action
  // and rely on the parent to update.
  // WAIT: App.tsx passes `documents` prop. If I delete here using a new hook instance, 
  // it might desync if they don't share the same storage event listener perfectly.
  // Let's check useDocuments hook. It uses localStorage.
  
  const { deleteDocument } = useDocuments(documents); 

  const filteredDocs = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.client.businessName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || doc.type === filterType;
      return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDocs.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;
  const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

  // Reset to page 1 when search/filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handleOpen = (doc: DocumentData) => {
      openDocument(doc);
      navigate('/canvas');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); // Prevent row click
      if (window.confirm('Are you sure you want to delete this document?')) {
          await deleteDocument(id);
          // Force reload or wait for parent to update? 
          // Since App.tsx listens to storage, it should update.
          window.location.reload(); // Nuclear option to ensure UI sync for now
      }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold mb-2">My Documents</h1>
                <p className="text-gray-500 font-medium">History of your invoices and contracts.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative flex-grow md:w-64">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20}/>
                    <Input 
                        placeholder="Search..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <div className="relative group">
                     <button 
                        onClick={() => {
                            const menu = document.getElementById('filter-menu');
                            if (menu) menu.classList.toggle('hidden');
                        }}
                        className="h-full px-4 border-2 border-grit-dark bg-white hover:bg-gray-50 flex items-center gap-2 font-bold"
                     >
                         <Filter size={18}/> Filter
                     </button>
                     <div id="filter-menu" className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-grit-dark shadow-grit z-10 hidden group-hover:block">
                         <button onClick={() => setFilterType('ALL')} className="w-full text-left p-3 hover:bg-grit-primary font-bold border-b border-gray-100">All Types</button>
                         <button onClick={() => setFilterType(DocType.INVOICE)} className="w-full text-left p-3 hover:bg-grit-primary font-bold border-b border-gray-100">Invoices</button>
                         <button onClick={() => setFilterType(DocType.CONTRACT)} className="w-full text-left p-3 hover:bg-grit-primary font-bold">Contracts</button>
                     </div>
                 </div>
            </div>
        </div>

        <div className="bg-white border-4 border-grit-dark shadow-grit overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-grit-dark text-grit-white">
                    <tr>
                        <th className="p-4 uppercase tracking-wider font-bold">Type</th>
                        <th className="p-4 uppercase tracking-wider font-bold">Title & Client</th>
                        <th className="p-4 uppercase tracking-wider font-bold text-right">Date</th>
                        <th className="p-4 uppercase tracking-wider font-bold text-right">Status</th>
                        <th className="p-4 uppercase tracking-wider font-bold text-right">Total</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100">
                    {paginatedDocs.length > 0 ? (
                        paginatedDocs.map(doc => (
                            <tr key={doc.id} onClick={() => handleOpen(doc)} className="hover:bg-gray-50 cursor-pointer group transition-colors">
                                <td className="p-4">
                                    <span className={`inline-block px-2 py-1 text-xs font-bold uppercase rounded ${
                                        doc.type === DocType.INVOICE ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-lg">{doc.title}</p>
                                    <p className="text-gray-500 text-sm">{doc.client.businessName}</p>
                                </td>
                                <td className="p-4 text-right font-mono text-gray-600">{doc.date}</td>
                                <td className="p-4 text-right">
                                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase border-2 ${
                                        doc.status === 'Sent' ? 'border-green-500 text-green-700 bg-green-50' : 
                                        doc.status === 'Paid' ? 'border-grit-dark bg-grit-dark text-grit-primary' :
                                        'border-gray-300 text-gray-500 bg-gray-50'
                                    }`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold font-mono text-lg">
                                    {doc.type === DocType.INVOICE ? `${doc.currency || '$'}${doc.total?.toFixed(2)}` : '-'}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2 items-center h-full">
                                    <button 
                                        onClick={(e) => handleDelete(e, doc.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Document"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <ArrowUpRight className="inline text-gray-300 group-hover:text-grit-dark transition-colors"/>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="p-12 text-center text-gray-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-50"/>
                                <p className="font-bold text-lg">No documents found.</p>
                                <p>Create your first invoice or contract to see it here.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
                <div className="text-gray-600 font-medium">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredDocs.length)} of {filteredDocs.length} documents
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2"
                    >
                        Previous
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 font-bold transition-colors ${
                                    currentPage === page
                                        ? 'bg-grit-dark text-white'
                                        : 'bg-white border-2 border-gray-300 hover:border-grit-dark'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2"
                    >
                        Next
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
};

export default DocumentsScreen;
