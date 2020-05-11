import React from 'react';
import medecin from './../../../../assets/img/medecin/doctor.png'
import { makeStyles } from '@material-ui/core/styles';
import {CircularProgress} from '@material-ui/core';

import { Button} from 'react-bootstrap'

import {BsCircleFill} from 'react-icons/bs';
import { FaPhone, FaVideo, FaCheck ,FaArrowAltCircleLeft} from 'react-icons/fa'
import {BsFillChatFill} from 'react-icons/bs'

const InfoBar = ({ user, resolved, audioCall, videoCall, onConsuting, respondingProcess,showConversationHandler,chatIcon,showConversation }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
        <BsCircleFill />
          <div className="profile">
          <img className="profile-img" src={medecin} alt="" />
          <p className="upper"> { "dr. " + user.nom + " " + user.prenom} </p>
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
            Icon={<FaPhone size="1.5rem" />}
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
            Icon={<FaVideo size="1.5rem" />}
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
            Icon={showConversation ? <FaArrowAltCircleLeft size="1.5rem" /> : < BsFillChatFill size="1.5rem"/>}
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