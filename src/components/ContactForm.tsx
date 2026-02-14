import { useState } from 'react';
import type { FormEvent } from 'react';
import './ContactForm.css';

interface ContactFormProps {
  onAddContact: (name: string, phone: string) => void;
}

const ContactForm = ({ onAddContact }: ContactFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && phone.trim()) {
      onAddContact(name.trim(), phone.trim());
      setName('');
      setPhone('');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Add New Contact</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter contact name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
        />
      </div>
      <button type="submit" className="add-button">
        Add Contact
      </button>
    </form>
  );
};

export default ContactForm;
