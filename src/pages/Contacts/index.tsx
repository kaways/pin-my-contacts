import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { useContacts } from '@/hooks/useContacts';
import { useGeocode } from '@/hooks/useGeocode';
import { ContactForm } from './ContactForm';
import { ContactTable } from './ContactTable';
import { ContactMap } from './ContactMap';
import { UserActionsDropdown } from './UserActionsDropdown';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNotification } from "@/context/NotificationProvider";
import { Plus } from 'lucide-react';
import { Contact } from '@/types/contact';
import { LocalStorageService } from "@/services/localStorageService";

const API_KEY = "";

export const ContactsPage = () => {
    const navigate = useNavigate();
    const { logout } = React.useContext(AuthContext)!;
    const {
        contacts,
        addContact,
        updateContact,
        deleteContact,
        currentUser
    } = useContacts();

    const { geocodeContactAddress } = useGeocode(API_KEY);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { notify } = useNotification();
    type ContactState = Contact | null;
    const [currentContact, setCurrentContact] = useState<ContactState>(null);
    const [mapCenter, setMapCenter] = useState({
        lat: -25.4284,
        lng: -49.2733
    });
    const [filters, setFilters] = useState({
        name: '',
        cpf: ''
    });

    const sortedContacts = [...contacts].sort((a, b) =>
        sortDirection === 'asc' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)
    );

    const filteredContacts = sortedContacts.filter(contact => {
        const nameMatch = contact.nome.toLowerCase().includes(filters.name.toLowerCase());
        const cpfMatch = contact.cpf.replace(/\D/g, '').includes(filters.cpf.replace(/\D/g, ''));
        return nameMatch && cpfMatch;
    });

    const handleSubmitContact = async (values: Contact) => {
        try {
            const contactWithLocation = await geocodeContactAddress(values);

            if (isEditMode) {
                updateContact(contactWithLocation);
            } else {
                const emailExists = contacts.some((u: { cpf: string }) => u.cpf === values.cpf);
                if (emailExists) {
                    notify('error', 'Erro', 'Este CPF já está cadastrado');
                    return;
                }

                addContact(contactWithLocation);
            }

            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    const closeEditDialog = () => {
        setIsDialogOpen(false);
    };

    const openAddDialog = () => {
        setIsEditMode(false);
        setCurrentContact(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (contact: Contact) => {
        setCurrentContact(contact);
        setIsEditMode(true);
        setIsDialogOpen(true);
    };

    const handleDelete = (cpf: string) => {
        deleteContact(cpf);
    };

    const handleRowClick = (lat: number, lng: number) => {
        setMapCenter({ lat, lng });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteAccount = async (password: string) => {
        if (currentUser?.password === password) {
            LocalStorageService.deleteAccount(currentUser.email);
            handleLogout();
            return true;
        }
        return false;
    };

    return (
        <div className="mx-auto min-h-screen flex flex-col p-8 gap-20 bg-[#F5F5F5]">
            <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-semibold">Tela de Contatos</h2>

                <UserActionsDropdown
                    email={currentUser?.email}
                    onLogout={handleLogout}
                    onDeleteAccount={handleDeleteAccount}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col gap-5 w-full md:w-1/2 p-6 rounded-xl bg-white">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild >
                            <Button className="w-[120px] self-end" onClick={openAddDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar
                            </Button>
                        </DialogTrigger>
                        <DialogContent key={isEditMode ? 'edit' : 'add'} className="w-2xl p-6 py-6 pl-12 pr-12">
                            <DialogHeader>
                                <DialogTitle>{isEditMode ? 'Atualizar' : 'Adicionar'} contato</DialogTitle>
                            </DialogHeader>
                            <ContactForm
                                onSubmit={handleSubmitContact}
                                defaultValues={currentContact}
                                isEdit={isEditMode}
                                closeOnEditDialog={closeEditDialog}
                            />
                        </DialogContent>
                    </Dialog>

                    <ContactTable
                        contacts={filteredContacts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRowClick={handleRowClick}
                        onSort={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        onNameFilterChange={(value) => setFilters(prev => ({ ...prev, name: value }))}
                        onCpfFilterChange={(value) => setFilters(prev => ({ ...prev, cpf: value }))}
                    />
                </div>

                <div className="w-full md:w-1/2 p-6 rounded-xl bg-white">
                    <ContactMap
                        apiKey={API_KEY}
                        center={mapCenter}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;