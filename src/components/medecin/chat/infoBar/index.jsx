import React from 'react';
import medecin from './../../../../assets/img/medecin/doctor.png'

// import onlineIcon from '../../icons/onlineIcon.png';
import {BsCircleFill} from 'react-icons/bs';

const InfoBar = ({ selectedUser, user, resolved }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
        <BsCircleFill />
          <div className="profile">
          <img className="profile-img" src={medecin} className="" alt="" />
          <p className="upper"> { "dr. " + user.name} { (selectedUser) &&  selectedUser.id} </p>
        </div>
     
      
    </div>
    <div className="centerInnerContainer">
   
        <h3>la consultation numéro {resolved + 1} aujourd'hui </h3>
      
    </div>
    <div className="rightInnerContainer">
    </div>
  </div>
);

export default InfoBar;