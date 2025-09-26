import React, { useState } from 'react';

// A reusable accordion component
function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        {/* Simple arrow icon that rotates */}
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {/* The content is only rendered if isOpen is true */}
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default AccordionItem;