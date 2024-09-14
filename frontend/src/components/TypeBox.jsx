import React from "react";
import "./TypeBox.css";
import TypeIcon from "./../assets/TypeIcon.png";

const TypeBox = ({ value, isActive }) => {
  return (
    <div className={`type-box ${ isActive ? '' : 'processing'}`}>
      <img src={TypeIcon} alt="Type Icon" className="type-icon" />
      <input value={value} type="text" className="type-input" placeholder="Type your message..." />
    </div>
  );
};

export default TypeBox;
