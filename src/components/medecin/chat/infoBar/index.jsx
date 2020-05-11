import React from 'react';
import medecin from './../../../../assets/img/medecin/femme.png'
import { makeStyles } from '@material-ui/core/styles';
import {CircularProgress} from '@material-ui/core';

import { Button} from 'react-bootstrap'

import {BsCircleFill} from 'react-icons/bs';
import { FaPhone, FaVideo, FaCheck ,FaArrowAltCircleLeft} from 'react-icons/fa'
import {BsFillChatFill, BsChat, BsArrowLeft} from 'react-icons/bs'
import {FiPhoneCall, FiVideo} from 'react-icons/fi'

const InfoBar = ({ user, resolved, titre, audioCall, videoCall, onConsuting, respondingProcess,showConversationHandler,chatIcon,showConversation }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
        <BsCircleFill className="circle_online" />
          <div className="profile">
          <img className="profile-img" src={medecin} alt="" />
          {user.type === 'patient' ? <p className="upper"> {'Medecin de la ville : ' + titre} </p>  :<p className="upper"> pseudo patient:  {titre} </p>}          
        </div>
     
      
    </div>
    {user.type === "medecin" &&
    <div className="centerInnerContainer">
        <h4 className="text-white d-none"> {(resolved === 0) ? "vous n'avez fait aucune consultation aujourd'hui" : "la consultation numéro " + resolved + " aujourd'hui" }  </h4>
    </div>
    }
    {user.type === "medecin" && onConsuting &&
    <div className="rightInnerContainer">
        <div className="phone-call m-0">
        <ButtonProcess 
            className="action" 
            onClick={audioCall} 
            type="button"   
            variant="success" 
            success={false} 
            valeur="" 
            sending={respondingProcess} 
            IconSuccess={FaCheck} 
            Icon={<FiPhoneCall size="1.5rem" />}
        />
          {/* <FaPhone /> */}
        </div>
        <div className="video-call m-0">
        <ButtonProcess 
            className="action m-0" 
            onClick={videoCall} 
            type="button"   
            variant="success" 
            success={false} 
            valeur="" 
            sending={respondingProcess} 
            IconSuccess={FaCheck} 
            Icon={<FiVideo size="1.5rem" />}
        />
        {/* <FaVideo /> */}
        </div>
        {chatIcon ? <div className="video-call m-0">
        <ButtonProcess 
            className="action" 
            onClick={showConversationHandler} 
            type="button"   
            variant="success" 
            success={false} 
            valeur="" 
            sending={respondingProcess} 
            IconSuccess={FaCheck} 
            Icon={showConversation ? <BsArrowLeft size="2rem" stroke-width="1.4" /> : < BsChat size="1.8rem" stroke-width=".6"/>}
        />
        {/* <FaVideo /> */}
        </div>:null}
        
        
    </div>
    }
  </div>
);

export default InfoBar;


const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: "#8dc63f",
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function ButtonProcess(props) {
  const classes = useStyles();
  return (
      <div className={classes.wrapper}>
        <Button
        onClick={props.onClick}
        className={props.className}
          type={props.type}
          variant= {props.variant}
          disabled={props.sending}
        >
          {props.valeur}
          {props.success ? <props.IconSuccess /> : props.Icon }
        </Button>
        {props.sending && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
  );
}