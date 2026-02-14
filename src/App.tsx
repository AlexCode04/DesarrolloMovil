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
      resolve([]);
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
        <h1>Contact Manager</h1>
        <p>Manage your contacts easily</p>
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
