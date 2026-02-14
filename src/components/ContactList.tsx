import type { Contact } from '../types/Contact';
import ContactItem from './ContactItem';
import './ContactList.css';

interface ContactListProps {
  contacts: Contact[];
  onDeleteContact: (id: string) => void;
}

const ContactList = ({ contacts, onDeleteContact }: ContactListProps) => {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <p>No contacts yet. Add your first contact above!</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      <h2>Contacts ({contacts.length})</h2>
      <div className="contact-list-items">
        {contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onDelete={onDeleteContact}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
