import React from 'react';
import './TypeBox.css';
import TypeIcon from "./../assets/TypeIcon.png";

const TypeBox = () => {
  return (
    <div className="type-box">
      <img src={TypeIcon} alt="Type Icon" className="type-icon" />
      <input type="text" className="type-input" placeholder="Type your message..." />
    </div>
  );
};

export default TypeBox;
