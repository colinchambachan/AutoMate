import React from 'react';
import './Step.css';
import RightArrow from "./../assets/RightArrow.png";

const Step = ({ isActive, title, description }) => {
  return (
    <div className={`step ${isActive ? 'active' : ''}`}>
      <div className="step-text">
        <div className="step-title">{title}</div>
        <div className="step-desc">{description}</div>
      </div>
        <img src={RightArrow} className={`step-button`} />
    </div>
  );
};

export default Step;
