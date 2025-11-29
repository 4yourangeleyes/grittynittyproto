import React, { useState } from 'react';
import { Client, DocumentData } from '../types';
import { Search, FileText, Mail, MapPin, Phone, Trash2 } from 'lucide-react';
import { Input } from '../components/Input';

interface ClientsScreenProps {
    clients: Client[];
    documents: DocumentData[];
    deleteClient: (id: string) => Promise<void>;
}

const ClientsScreen: React.FC<ClientsScreenProps> = ({ clients, documents, deleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientDocs = (clientId: string) => {
      return documents.filter(d => d.client.id === clientId || d.client.businessName === clients.find(c => c.id === clientId)?.businessName).slice(0, 3);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold mb-2">Clients</h1>
                <p className="text-gray-500 font-medium">Manage your relationships and view history.</p>
            </div>
            <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20}/>
                <Input 
                    placeholder="Search clients..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {filteredClients.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-400 font-bold text-lg">No clients found.</p>
                <p className="text-gray-400">Add clients via the Settings page or by creating a new invoice.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => {
                    const clientDocs = getClientDocs(client.id);
                    return (
                        <div key={client.id} className="bg-white border-2 border-grit-dark shadow-grit p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-grit-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {client.businessName.charAt(0)}
                                </div>
                                <div className="flex gap-2 items-start">
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                                        {clientDocs.length} Docs
                                    </span>
                                    <button 
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if(window.confirm('Delete this client?')) {
                                                await deleteClient(client.id);
                                            }
                                        }}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-1 truncate" title={client.businessName}>{client.businessName}</h3>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} className="text-grit-primary" /> 
                                    <span className="truncate">{client.email}</span>
                                </div>
                                {client.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} className="text-grit-primary" /> 
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="border-t-2 border-gray-100 pt-4">
                                <p className="text-xs uppercase font-bold text-gray-400 mb-3">Recent Activity</p>
                                {clientDocs.length > 0 ? (
                                    <div className="space-y-2">
                                        {clientDocs.map(doc => (
                                            <div key={doc.id} className="flex items-center justify-between text-sm group cursor-default">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-gray-400 group-hover:text-grit-dark"/> 
                                                    <span className="font-medium truncate max-w-[120px]">{doc.title}</span>
                                                </div>
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${doc.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No documents yet.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};

export default ClientsScreen;