import React, { Component } from 'react';
import Peer from 'simple-peer';
import autoBind from 'react-autobind';

import {CircularProgress} from '@material-ui/core';
import { Button, Row, Col} from 'react-bootstrap'
import {FaPhoneSlash, FaCheck} from 'react-icons/fa'

import callerTone from './../../../assets/media/ringPhone.mp3'

import LogoPng from './../../../assets/img/pelia_logo.png'


export default class ElemenetsCall extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            stream: null,
            medecin: props.medecin,
            patient: props.patient
        };
    }
    
    componentDidMount() {
        let socket = this.props.socket;
        socket.emit('call-patient', { selectedUser: this.state.patient, type: this.props.type });

        socket.on('reject-call-medecin', (response) => {
            if(this.state.passingCall) {
                this.stopStream();
                this.setState({ respondingProcess:false, passingCall: false, stream : null, responding:false});  
                this.props.setInCall("")
            }
        })
        socket.on('signal-call', ({data}) => {
            this.setUpPeer({data})
        })
        
        socket.on('ready-patient', (response) => {
            if(this.props.type === "video"){
                socket.emit('client-call', {selectedUser: this.state.patient,})
                this.setState({callFrom: this.state.patient.name, hisOnline: true});
            }
            
        })
        
        if(this.props.type === "video"){
            this.initiatorCallVideo()
        }else{
            this.initiatorCallAudio()
        }
    }
    componentWillUnmount(){
        this.props.socket.removeAllListeners('reject-call-medecin')
        this.props.socket.removeAllListeners('signal-call')
        this.props.socket.removeAllListeners('ready-patient')

        if(this.state.peer){
            this.state.peer.destroy();
        }
    }

    setUpPeer({data}){
        const peer = new Peer({
            initiator: false,
            stream: this.state.stream,
            config: { iceServers: 
                [
                    {
                      urls: "stun:pelia.ma:3478",
                    },
                    {
                      urls: "turn:pelia.ma:3478",
                      username: "peliaturn",
                      credential: "ejfLUNE6C=fM&4P!"
                    }
                ]
            },
            trickle: false
        });

        peer.on('signal', (data) => {
            this.props.socket.emit('medecin-confirm-call', {selectedUser: this.state.patient, data})
        })
        
        peer.on('stream', (stream) => {
            if(this.props.type === "video"){
                try {
                    this.userVideo.srcObject = stream;
                    this.userVideo.play();
                } catch (e) {
                    this.userVideo.src = URL.createObjectURL(stream)
                }                    
            }else{
                try {
                    this.userAudio.srcObject = stream;
                } catch (e) {
                    this.userAudio.src = URL.createObjectURL(stream)
                }
                this.userAudio.play();
            }
            this.callerTone.pause();
            this.setState({passingCall: true, respondingProcess:false, timeAppel: Date.now() })
            
        })
        peer.on('close', () =>{
            if(this.state.peer){
                this.state.peer.destroy()
            }
        })
        this.setState({responding: true, peer})
        peer.signal(data);
    }
 

     async initiatorCallVideo(){
	     let options ={
	    	mimeType: 'video/webm;codes=H264'
	     }
            await navigator.mediaDevices.getUserMedia({video: true, audio:true})
                .then((stream) => {
                    window.streamReference = stream;
                    this.setState({ stream : stream})
                        let videoStream = new MediaStream(stream.getVideoTracks(), options);
                        try {
                            this.myVideo.srcObject = videoStream;
                        } catch (e) {
                            this.myVideo.src = URL.createObjectURL(videoStream)
                        }
                        // si c'est un medecin on débute le caller tone
                        try {
                            this.callerTone.src = callerTone
                        } catch (e) {
                            this.callerTone.srcObject =  URL.createObjectURL(callerTone) 
                        }
                        this.callerTone.play();
                    
                })
                .catch(err => {
                    console.log(`Unable to fetch stream`)
                })
    }

    async initiatorCallAudio(){
        await navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                this.setState({stream : stream, isCallAudio:true});
            })
            .catch(err => {
                console.log(`Unable to fetch stream`);
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

    rejectCall(){
        this.props.socket.emit('medecin-reject', {selectedUser: this.props.patient , reject: true })
        this.stopStream();
        this.setState({ respondingProcess:false, passingCall: false, stream : null, responding:false});  
        this.props.setInCall("")
        
    }
      
    render() {
        let { responding, passingCall, respondingProcess} = this.state;
        return (
            <div className="video medecin">
                
                <audio ref={ref => this.callerTone = ref} playsInline />
                <audio ref={ref => this.notifTone = ref} playsInline />
                <div className="container-fluid">
                { this.props.type === "video" ?
                    <Row className={responding && "repondre"}>
                        <video id="peerVid" ref={(ref) => {this.userVideo = ref;}} playsInline autoPlay />
                        <video id="myVid" ref={(ref) => {this.myVideo = ref;}}  playsInline autoPlay />
                    </Row>
               :
                <Row className={responding && "repondre"}>
                    <audio id="peerAudio" ref={(ref) => {this.userAudio = ref}} />
                </Row>
                } 
                { (this.props.type === "video" || this.props.type === "audio") &&
                    <Row className={!passingCall ? "responding process": "responding"}>   
                        <Col style={{paddingLeft:0}}>
                        <Row className="text-center justify-content-around banner-call">  
                    <div>
                        <img src={LogoPng} width="20%" alt="pelia logo" /> 
                    </div> 
                </Row> 
                            <div className="layer"></div>
                            { !passingCall &&                      
                                <Row className="text-center d-flex justify-content-around w-100 p-4 ml-1 mt-5">   
                                    <p className="text-center caller " style={{maxHeight: "20%"}}> appel en cours ...</p>
                                </Row>    
                            }
                            <Row className="end-call">
                                <ButtonProcess 
                                    className="action" 
                                    onClick={() => this.rejectCall()} 
                                    type="button"   
                                    variant="danger" 
                                    success={false} 
                                    valeur="" 
                                    sending={respondingProcess} 
                                    IconSuccess={FaCheck} 
                                    Icon={<FaPhoneSlash size="1.5rem" />}
                                    />
                            </Row>
                        </Col>
                    </Row>
                }
               
                </div>
            </div>
        );
    }
}

function ButtonProcess(props) {
  return (
      <div style={{
        margin: "5px",
        display:"flex",
        justifyContent:"center",
        position: 'relative',
      }}>
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
        {props.sending && <CircularProgress size={24} style={{
      color: "#8dc63f",
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    
  }} />}
      </div>
  );
}

