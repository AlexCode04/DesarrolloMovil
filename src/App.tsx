import { useState, useEffect } from 'react'
import './App.css'
import type { Contact } from './types/Contact'
import Loader from './components/Loader'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'

// Simulate fetching initial contacts from an API
const fetchInitialContacts = (): Promise<Contact[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Try to load contacts from localStorage first
      const savedContacts = localStorage.getItem('contacts');
      if (savedContacts) {
        resolve(JSON.parse(savedContacts));
      } else {
        resolve([]);
      }
    }, 2000); // Simulate 2 second delay
  });
};

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial contacts on component mount
    fetchInitialContacts().then((initialContacts) => {
      setContacts(initialContacts);
      setLoading(false);
    });
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts, loading]);

  const handleAddContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone
    };
    setContacts([...contacts, newContact]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/logoapp.png" alt="ConectaFácil Logo" className="app-logo" />
        <h1>ConectaFácil</h1>
        <p>Administra tus contactos de manera sencilla</p>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <div className="app-content">
          <ContactForm onAddContact={handleAddContact} />
          <ContactList 
            contacts={contacts} 
            onDeleteContact={handleDeleteContact} 
          />
        </div>
      )}
    </div>
  )
}

export default App
