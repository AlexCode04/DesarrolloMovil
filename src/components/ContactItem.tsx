import type { Contact } from '../types/Contact';
import './ContactItem.css';

interface ContactItemProps {
  contact: Contact;
  onDelete: (id: string) => void;
}

const ContactItem = ({ contact, onDelete }: ContactItemProps) => {
  return (
    <div className="contact-item">
      <div className="contact-info">
        <h3>{contact.name}</h3>
        <p>{contact.phone}</p>
      </div>
      <button 
        className="delete-button"
        onClick={() => onDelete(contact.id)}
        aria-label={`Delete ${contact.name}`}
      >
        Delete
      </button>
    </div>
  );
};

export default ContactItem;
