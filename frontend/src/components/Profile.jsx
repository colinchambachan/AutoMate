import React from 'react';
import './Profile.css';

const Profile = ({ picture, name }) => {
  return (
    <div className="profile">
      <img src={picture} alt="Profile" className="profile-picture" />
      <div className="profile-name">{name}</div>
    </div>
  );
};

export default Profile;
