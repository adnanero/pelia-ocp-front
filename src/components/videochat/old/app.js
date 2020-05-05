import React, { Component, useState } from 'react';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
import autoBind from 'react-autobind';
import Axios from 'axios'
import Cookies from 'js-cookie'

import { Redirect } from "react-router-dom";

import baseUrl from './../../config'

import LogoPng from './../../assets/img/pelia-logo.png'

import {IconButton, CircularProgress, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Row, Col} from 'react-bootstrap'
import {FaPhoneSlash, FaPhone, FaVideo, FaCheck} from 'react-icons/fa'
import {TiMessages} from 'react-icons/ti'

import callerTone from './../../assets/media/callertone.mp3'

import './../../assets/css/video-call.css';

export default function CallUsers(props){
    let medecin = Cookies.get('medecinAuth')
    let userAuth = Cookies.getJSON('user')
    let isMedecin = (medecin === undefined) ? false: true;
    const [calling, setCalling] = useState(false);
    const [patient, setPatiet] = useState(props.match.params.name)
    let isPatient = (props.match.params.name === undefined) ? false : true;
    
    const switchPage = (patient) =>{
        setPatiet(patient)
        setCalling(true)
    }
    if(!isPatient && !isMedecin ){
        return(
            <Redirect to="/" />
        )
    }
    return(
        <section>
            { calling || isPatient ?
                    <ElemenetsCall patient={patient} {...props} medecin ={isMedecin} regenereLien={() => setCalling(false)} /> :
                    <AddPatient {...props} roomId={userAuth.prenom} idIdGenerated={(patient) => switchPage(patient)} medecin={medecin} />  
            }
        </section>
    )
}

class ElemenetsCall extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            isMedecin : props.match.params.name === undefined ? true : false,
            user : { prenom : ""},
            stream: null,
            serchingMedecin: false,
            patientIsLoggedIn:false,
            medecinNotFounding: true
        };
        this.peers = {};
        this.patientId = props.patient
    }
    setupPusher(data) {
        this.pusher = new Pusher('2e923196325bd5eddb8c', {
            authEndpoint: `${baseUrl.node}video-call/start`,
            cluster: 'eu',
            auth: {
                params: { name:data.username },
                headers: {
                    'Authorization': `Bearer ${ data.token }`
                }
            }
        });

        this.channel = this.pusher.subscribe('presence-video-channel');
        this.channel.bind(`client-signal-${data.username}`, (signal) => {
            let peer = this.peers[signal.userName];
            if(peer === undefined) {
                peer = this.startPeer(signal.userName, false);
            }
            this.setState({responding: true})
            peer.signal(signal.data);
        });

        this.channel.bind(`client-online-${data.username}`, (msg) =>{
            if( msg.from === "medecin" && this.state.medecinNotFounding && msg.username === this.props.match.params.medecin && !this.state.isMedecin){
                this.setState({serchingMedecin: true, medecinNotFounding:false})
                    this.channel.trigger(`client-online-${this.props.match.params.medecin}`, {
                        type: 'online',
                        username: this.state.user.prenom,
                        from : "patient"
                })
            }
            else if( msg.from === "patient", msg.username === this.patientId){
                this.setState({ patientIsLoggedIn: true  })
                this.channel.trigger(`client-online-${this.patientId}`, {
                    type: 'online',
                    username: this.state.user.prenom,
                    from: "medecin"
                })
            }
        })
        this.channel.bind('pusher:subscription_succeeded', () => {
            if(this.state.isMedecin && !this.state.responding){
                this.channel.trigger(`client-online-${this.patientId}`, {
                    type: 'online',
                    username: this.state.user.prenom,
                    from: "medecin"
                })
            }else if ( ! this.state.isMedecin && !this.state.responding){
                this.channel.trigger(`client-online-${this.props.match.params.medecin}`, {
                    type: 'online',
                    username: this.state.user.prenom,
                    from: "medecin"
            })
            }
        });
        this.channel.bind(`client-call-${data.username}`, (msg) =>{
            if(msg.type === "call-video"){
                this.initiatorCallVideo()
                this.setState({ callFrom: msg.data.from})
            }else{
                this.initiatorCallAudio()
                this.setState({ callFrom: msg.data.from})
            }
            window.addEventListener('beforeunload', function (e) {
                e.preventDefault();
                e.returnValue = '';
            });
        });
        this.channel.bind(`client-reject-${data.username}`, (msg) =>{
            this.setState({callRejected: true})
            let peer = this.peers[msg.userName];
            if(peer === undefined) {
                this.rejectCall(this.patientId)
            }
            this.stopStream()
            this.setState({respondingProcess:false, callEnd:true,passingCall: false, isCallVideo:false, isCallAudio:false, stream : null, responding:false})
        })
        // /*   la fin d'initiation du pusher et leur channel  */
    }

    startPeer(userName, initiator = true) {
        const peer = new Peer({
            initiator,
            stream: this.state.stream,
            trickle: false
        });

        peer.on('signal', (data) => {
            this.channel.trigger(`client-signal-${userName}`, {
                type: 'signal',
                userName: this.state.user.prenom,
                data: data
            })
        })
 
        peer.on('stream', (stream) => {
            if(this.state.isCallVideo){

                try {
                    this.userVideo.srcObject = stream;
                } catch (e) {
                    this.userVideo.src = URL.createObjectURL(stream)
                }
                this.userVideo.play();
            }else{
                try {
                    this.userAudio.srcObject = stream;
                } catch (e) {
                    this.userAudio.src = URL.createObjectURL(stream)
                }
                this.userAudio.play();
            }
            if(stream !== null){
                this.setState({passingCall: true, respondingProcess:false })
            }
          
        })
        peer.on('close', () => {

        })
        return peer;
    }

    componentDidMount() {
        if(this.state.isMedecin){
            let token = Cookies.get('token')
            let userObject = JSON.parse(Cookies.get('user'))
            this.setState({user: userObject})
            this.setupPusher({token: token, username: userObject.prenom }); 
        }else{
                // Math.random should be unique because of its seeding algorithm.
                // Convert it to base 36 (numbers + letters), and grab the first 9 characters
                // after the decimal.
            let id = Math.random().toString(36).substr(3, 5);
            this.setState({user: {prenom: this.patientId}})
            Axios.post(`${baseUrl.node}video-call/patient`, { id: id, name: this.patientId})
            .then((res) => {
            this.setupPusher({token: res.data.access_token, username: this.patientId });
            }).catch((r) => console.error(r))
        }
    }

     async initiatorCallVideo(){
	     let options ={
	    	mimeType: 'video/webm;codes=H264'
	     }

            await navigator.mediaDevices.getUserMedia({video: true, audio:true})
                .then((stream) => {
                    window.streamReference = stream;
                    this.setState({ stream : stream, isCallVideo:true})
                        let videoStream = new MediaStream(stream.getVideoTracks(), options);
                        try {
                            this.myVideo.srcObject = videoStream;
                        } catch (e) {
                            this.myVideo.src = URL.createObjectURL(videoStream)
                        }
                        this.myVideo.play();
                    if(!this.state.isMedecin){
                        try {
                            this.callerTone.src = callerTone
                        } catch (e) {
                            this.callerTone.srcObject =  URL.createObjectURL(callerTone) 
                        }
                        this.callerTone.play();
                    }
                })
                .catch(err => {
                    throw new Error(`Unable to fetch stream ${err}`)
                })
    }

    async initiatorCallAudio(){
        await navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                this.setState({stream : stream, isCallAudio:true});
            })
            .catch(err => {
                throw new Error(`Unable to fetch stream ${err}`);
            })
    }

    stopStream() {
        if (!window.streamReference) return;
        window.streamReference.getAudioTracks().forEach(function(track) {
            track.stop();
        });
        window.streamReference.getVideoTracks().forEach(function(track) {
            track.stop();
        });
        window.streamReference = null;
    }
    callVideoTo(){
        this.setState({respondingProcess: true})
            this.initiatorCallVideo()
            this.channel.trigger(`client-call-${this.patientId}`, {
                type: 'call-video',
                userName: this.state.user.prenom,
                data:{from: this.state.user.prenom}
            })
            this.setState({respondingProcess: false, callFrom: this.patientId})

            window.addEventListener('beforeunload', function (e) {
                e.preventDefault();
                e.returnValue = '';
            });
    }

    callTo() {
        this.setState({respondingProcess: true})
        this.initiatorCallAudio()
        this.channel.trigger(`client-call-${this.patientId}`, {
            type: 'call-audio',
            userName: this.state.user.prenom,
            data:{from: this.state.user.prenom}
        });
        this.setState({respondingProcess: false, callFrom: this.patientId})
        window.addEventListener('beforeunload', function (e) {
            e.preventDefault();
            e.returnValue = '';
        });
    }

    confirmCall(){
        this.peers[this.state.callFrom] = this.startPeer(this.state.callFrom);
        this.setState({ respondingProcess: true})
        this.callerTone.pause();
    }

    rejectCall(userName){
        this.channel.trigger(`client-reject-${userName}`, {
            type: 'reject-call',
            userName: this.state.user.prenom
        });
        this.stopStream()
        this.setState({callEnd:true, respondingProcess:false, passingCall: false, isCallVideo:false,isCallAudio:false, responding:false})
    }
      
    render() {
        let {  isMedecin, isCallVideo, isCallAudio, responding,callFrom, callEnd, passingCall, respondingProcess, patientIsLoggedIn, serchingMedecin, medecinNotFounding } = this.state;
        return (
            <div className="video">
                <audio ref={ref => this.callerTone = ref} playsInline />
                <div className="container-fluid">
                { isCallVideo &&
                    <Row className={responding && "repondre"}>
                        <video id="peerVid" ref={(ref) => {this.userVideo = ref;}} playsInline />
                        <video id="myVid" ref={(ref) => {this.myVideo = ref;}}  playsInline />
                    </Row>
                }
                { isCallAudio &&
                <Row className={responding && "repondre"}>
                    <audio id="peerAudio" ref={(ref) => {this.userAudio = ref}} />
                </Row>
                } 
                { (isCallVideo || isCallAudio) &&
                    <Row className={!passingCall ? "responding process": "responding"}>   
                    <Col style={{paddingTop:"4rem", paddingLeft:0}}>
                        <div className="background"></div>
                    { !passingCall && !isMedecin &&                       
                        <Row className="text-center d-flex justify-content-around w-100 p-4 ml-1 mt-5">   
                            <p className="text-center caller " style={{maxHeight: "20%"}}> Un appel entrant de la part de votre médecin
                            <span className="name-caller">  {callFrom}</span>  </p>
                        </Row>    
                    }
                    <Row className="end-call">
                        <ButtonProcess 
                                className="action" 
                                onClick={() => this.rejectCall(callFrom)} 
                                type="button"   
                                variant="danger" 
                                success={false} 
                                valeur="" 
                                sending={respondingProcess} 
                                IconSuccess={FaCheck} 
                                Icon={<FaPhoneSlash size="1.5rem" />}
                            />
                                
                        { !passingCall && !isMedecin &&
                            <ButtonProcess 
                                className="action" 
                                onClick={this.confirmCall} 
                                type="button"   
                                variant="success" 
                                success={false} 
                                valeur="" 
                                sending={respondingProcess} 
                                IconSuccess={FaCheck} 
                                Icon={<FaPhone size="1.5rem" />}
                            />
                        }
                    </Row>
                    </Col>
                   
                        
                    </Row>
                }
                <Row className="mt-2">    
                    { isMedecin && !(isCallVideo || isCallAudio ) &&
                    <MedecinAccueil 
                        patientIsLoggedIn={patientIsLoggedIn}
                        respondingProcess={respondingProcess}
                        callEnd={callEnd}
                        callTo={this.callTo}
                        callVideoTo={this.callVideoTo}
                    />
                    }
                    { !isMedecin && !(isCallVideo || isCallAudio ) &&
                        <Col sm="12" className="text-center">
                                <PatientAcceuil 
                                serching={serchingMedecin} 
                                notFiding={medecinNotFounding} 
                                callEnd={callEnd}
                                 />
                        </Col>
                    }
                </Row>
                </div>
            </div>
        );
    }
}

function MedecinAccueil(props){
    return(
        <Col style={{paddingTop:"4rem"}} sm="12" className="text-center avant-appel mt-5">
            <Row className="justify-content-around mx-5">
                <h3> vous aurez le choix d'appeler votre patient par un appel vidéo ou appel vocal. </h3>
            </Row>
            <Row className="justify-content-around mx-5">
                {props.patientIsLoggedIn ?
                    <h4>  votre patient attend votre appel appelez le maintenant. </h4> :
                    <h4> votre patient n'est pas enligne attendez le un moment où bien envoyée lui un message. </h4>
                }
            </Row>
            <Row className="justify-content-around mx-5">
                <ButtonProcess 
                    className="action"
                    onClick={props.callTo} 
                    type="button"   
                    variant="success" 
                    success={false} 
                    valeur="" 
                    sending={props.respondingProcess === true || !props.patientIsLoggedIn} 
                    IconSuccess={FaCheck} 
                    Icon={<FaPhone size="1.5rem" />}
                />
                <ButtonProcess 
                    className="action" 
                    onClick={props.callVideoTo} 
                    type="button"   
                    variant="info"
                    success={false} 
                    valeur="" 
                    sending={props.respondingProcess === true || !props.patientIsLoggedIn} 
                    IconSuccess={FaCheck} 
                    Icon={<FaVideo size="1.5rem" />}
                />
            </Row>
            <Row className="justify-content-around mx-5">
                <Button onClick={() => window.location.reload()}>
                Régénérer un autre lien
                </Button>
            </Row>
        </Col>
    )
}

function PatientAcceuil(props) {
    return(
            <Col>
               <Row className="justify-content-center my-5">
                <h4 className="p-patient">
                Bonjour cher utilisateur, bienvenue dans votre plateforme Pelia. <span style={{width:"10%"}}> <img src={LogoPng} width="10%" /> </span>
                </h4>
                </Row>
                {props.serching && !props.callEnd &&
                    <Row className="justify-content-center my-5">
                    <h5>
                    Veuillez attendre SVP. Un médecin va vous répondre.
                    </h5>
                    <span style={{padding:"2px 25px"}}>
                        <CircularProgress size={24} 
                        style={{color: "#8dc63f"}}/>
                    </span>
                </Row>
                }
                {props.notFiding && !props.callEnd &&
                    <Row className="justify-content-center my-5">
                        <h5>
                            Aucun médecin n'est disponible actuellement. Veuillez attendre SVP.
                        </h5>
                        <p>
                            Si votre temps d’attente est anormalement long, veuillez revenir sur Whatsapp et informez par message votre médecin.
                        </p>
                    </Row>
                }
                {props.callEnd &&
                    <Row className="justify-content-center my-5">
                    <h5>
                    Votre appel est terminé.
                    </h5>
                </Row>
                }
            </Col>
    )
}

function AddPatient(props){
    const [patient, setPatient] =useState(Math.random().toString(36).substr(3, 9))
    const [copySuccess, setCopySuccess] = useState(false)


    const genereId = () =>{
        let idGenerated =  Math.random().toString(36).substr(3, 9)
        setPatient(idGenerated)
    }
    const copyCodeToClipboard = (e) => {
        e.preventDefault()
        setCopySuccess(true)
        setTimeout(() => {
            props.idIdGenerated(patient)
        }, 400);
      }
      const handleChange =(e) =>{
          if(e.target.name === "link"){
            e.target.select()
          }
         
      }
      
 
    return(
        <div className="generate-container"> 
        <Col>
            <Row className="text-center justify-content-around mt-5">
                <h3>
                    Bonjour cher médecin <span style={{color:"#038DFE"}}> {props.medecin}</span>. Bienvenue dans votre espace.
                </h3>
            </Row>
            <Row className="my-5 justify-content-around ">
                <div className= "link-container" style={{width:"70%"}} id="example-collapse-text">
                    <Col >
                        <Row className="text-center justify-content-around">
                            <h4 className="text-center">Il faut envoyer le lien d’invitation au patient afin qu'il puisse vous rejoindre dans l'appel</h4>
                        </Row>
                        <Row>
                            
                            <TextField 
                            id="standard-basic" 
                            fullWidth
                            onChange={handleChange}
                            onClick={handleChange}
                            style={{fontFamily:'Pacifico'}}
                            name="link"
                            value={`${baseUrl.overlays}/call-video/${patient}/${props.roomId}`} 
                            />
                        </Row>
                        <Row className="text-center justify-content-around  mt-3">
                                <h4 className="h6">Si vous avez partagé ce lien avec votre patient, cliquez sur le bouton "Démarrer la téléconsultation" pour aller à la page d'appel</h4>
                        </Row>
                        <Row className="my-4 justify-content-around">
                            <IconButton onClick={copyCodeToClipboard} className={ !copySuccess ? "copy-button" : "copy-button copy-success"} type="button" aria-label="coupier le lien">
                                Démarrer la téléconsultaion
                            </IconButton>
                            <IconButton className="copy-button" onClick={genereId}>Générer un autre lien </IconButton>
                        </Row>                        
                    </Col>                   
                </div>                
            </Row> 
        </Col>
                      
        </div>
    )
}

  
const useStyles = makeStyles(theme => ({
    wrapper: {
      margin: theme.spacing(1),
      display:"flex",
      justifyContent:"center",
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
      <div className={classes.wrapper} style={{width:"20%"}}>
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

