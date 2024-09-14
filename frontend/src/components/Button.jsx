import React from 'react';
import './Button.css';

const Button = ({ icon, altText, onClick, isActive, isRight }) => {
  return (
    <div className={`button ${isActive ? 'active' : 'nactive'} ${isRight ? 'button-right' : 'button-left'}`} onClick={onClick}>
      <img src={icon} alt={altText} className={`button-icon  ${isActive ? 'active' : 'nactive'}`} />
    </div>
  );
};

export default Button;
