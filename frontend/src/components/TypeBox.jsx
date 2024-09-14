import React, { useState } from "react";
import "./TypeBox.css";
import TypeIcon from "./../assets/TypeIcon.png";

const TypeBox = ({ value, onValueChange, isActive }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    c;
    onValueChange(event.target.value);
  };

  return (
    <div className={`type-box ${isActive ? "" : "processing"}`}>
      <img src={TypeIcon} alt="Type Icon" className="type-icon" />
      <input
        value={inputValue}
        type="text"
        className="type-input"
        placeholder="Type your message..."
        onChange={handleChange}
      />
    </div>
  );
};

export default TypeBox;
