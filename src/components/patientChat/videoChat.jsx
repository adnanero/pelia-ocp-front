import React, { Component } from 'react';
import Peer from 'simple-peer';
import autoBind from 'react-autobind';
import Axios from 'axios'

import baseUrl from './../../config'

import {CircularProgress} from '@material-ui/core';
import { Button, Row, Col} from 'react-bootstrap'
import {FaPhoneSlash, FaPhone, FaCheck} from 'react-icons/fa'

import callerTone from './../../assets/media/callertone.mp3'

import LogoPng from './../../assets/img/pelia_logo.png'


export default class ElemenetsCall extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            stream: null,
            isCalling:false,
            medecin: props.medecin,
            patient: props.patient
        };
    }
    componentDidMount() {
      
        if(this.props.type === "video"){
            this.initiatorCallVideo()
        }else{
            this.initiatorCallAudio()
        }
        this.setupSocket()
    }
    componentWillUnmount(){
        this.props.socket.removeAllListeners('patient-signal-call')
        this.props.socket.removeAllListeners('patient-call')
        this.props.socket.removeAllListeners('reject-call-patient')
        this.props.socket.removeAllListeners('reject-call-patient')

        if(this.state.peer){
            this.state.peer.destroy();
        }
    }
    setupSocket(){
        let socket = this.props.socket;
        socket.emit('patient-ready', {selectedUser: this.state.medecin} )
        
        socket.on('patient-call', (response) => {
            this.setState({ isCalling: true});
        })
        socket.on('reject-call-patient', (response) => {
            let duree = Date.now() - this.state.timeAppel;
            duree = duree.toString();
           Axios.post(`${baseUrl.lumen}api/appel` , {duree: duree}, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
            this.stopStream();
            this.setState({ respondingProcess:false, passingCall: false,responding:false,  id_appel: res.id_appel});
            this.props.setInCall("")
           });
        })
        socket.on('patient-signal-call', ({data}) => {
            this.setState({responding: true})
            this.state.peer.signal(data);
        })
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
        window.streamReference.getAudioTracks().forEach( (track) => {
            track.stop();
        });
        window.streamReference.getVideoTracks().forEach( (track) => {
            track.stop();
        });
        window.streamReference = null;
    }


    confirmCall(){
    const peer = new Peer({
        initiator:true,
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
        this.props.socket.emit('confirm-call', {selectedUser: this.state.medecin, data })
    })

    peer.on('stream', (stream) => {
        this.callerTone.pause();
        if(this.props.type === "video"){
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
            this.setState({passingCall: true, respondingProcess:false, timeAppel: Date.now() })
        }
    })
    this.setState({ respondingProcess: true, peer});
    
    }

    rejectCall(){
        let duree = Date.now() - this.state.timeAppel;
        duree = duree.toString();
       Axios.post(`${baseUrl.lumen}api/appel` , {duree: duree}, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
        this.stopStream();
        this.setState({ respondingProcess:false, passingCall: false, responding:false,  id_appel: res.id_appel});
        this.props.socket.emit('patient-reject-call', {selectedUser: this.state.medecin})
        this.props.setInCall("")
       });
    }
      
    render() {
        let {responding, passingCall, respondingProcess, isCalling } = this.state;
        return (
            <div className="video patient">
               
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

                { (this.props.type === "video" || this.props.type === "audio") && isCalling &&
                    <Row className={!passingCall ? "responding process": "responding"}>   

                        <Col style={{ paddingLeft:0}}>
                        <Row className="text-center justify-content-around banner-call">  
                    <div>
                        <img src={LogoPng} width="20%" alt="pelia logo" /> 
                    </div> 
                </Row> 
                            <div className="layer"></div>
                            <div className="background"></div>
                                { !passingCall &&                      
                                    <Row className="text-center d-flex justify-content-around w-100 p-4 ml-1 mt-5">   
                                        <p className="text-center caller " style={{maxHeight: "20%"}}> Un appel entrant de la part de votre médecin
                                        <span className="name-caller">  { "Dr. " + this.state.medecin.nom + " " +this.state.medecin.prenom}</span>  </p>
                                    </Row>    
                                }
                            <Row className="end-call">
                                <ButtonProcess 
                                        className="action" 
                                        onClick={this.rejectCall} 
                                        type="button"   
                                        variant="danger" 
                                        success={false} 
                                        valeur="" 
                                        sending={respondingProcess} 
                                        IconSuccess={FaCheck} 
                                        Icon={<FaPhoneSlash size="1.5rem" />}
                                    />
                                        
                                { !passingCall &&
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
               
                </div>
            </div>
        );
    }
}

function ButtonProcess(props) {
  return (
      <div style={{
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
        {props.sending && <CircularProgress size={24} style={ {color: "#8dc63f", position: 'absolute',top: '50%', left: '50%',marginTop: -12,marginLeft: -12}}  />}
      </div>
  );
}

