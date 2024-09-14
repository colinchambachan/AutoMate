import React from 'react';
import './Step.css';

const Step = ({ isActive, title, description }) => {
  return (
    <div className={`step ${isActive ? 'active' : ''}`}>
      <div className="step-text">
        <div className="step-title">{title}</div>
        <div className="step-desc">{description}</div>
      </div>
      <div className="step-button">
        <div className="arrow-right" />
        <div className="vector" />
        <div className="vector" />
        <div className="vector" />
      </div>
    </div>
  );
};

export default Step;
