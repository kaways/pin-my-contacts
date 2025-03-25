import { useState, useEffect } from 'react';
import { LocalStorageService } from '@/services/localStorageService';
import { useNotification } from '@/context/NotificationProvider';
import { Contact } from '../types/contact';

export const useContacts = () => {
  const currentUser = LocalStorageService.getCurrentUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    setContacts(LocalStorageService.getContacts(currentUser?.email));
  }, [currentUser?.email]);

  const addContact = (contact: Contact) => {
    const updatedContacts = [...contacts, contact];
    LocalStorageService.saveContacts(currentUser?.email, updatedContacts);
    setContacts(updatedContacts);
    notify('success', 'Contato adicionado', 'O contato foi adicionado com sucesso');
  };

  const updateContact = (updatedContact: Contact) => {
    const updatedContacts = contacts.map(contact => 
      contact.cpf === updatedContact.cpf ? updatedContact : contact
    );
    LocalStorageService.saveContacts(currentUser?.email, updatedContacts);
    setContacts(updatedContacts);
    notify('success', 'Contato atualizado', 'O contato foi atualizado com sucesso');
  };

  const deleteContact = (cpf: string) => {
    const updatedContacts = contacts.filter(contact => contact.cpf !== cpf);
    LocalStorageService.saveContacts(currentUser?.email, updatedContacts);
    setContacts(updatedContacts);
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    currentUser
  };
};