import React, { Component, useState } from 'react';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
import autoBind from 'react-autobind';
import Axios from 'axios'

import baseUrl from './../../config'

import {CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Row, Col} from 'react-bootstrap'
import {FaPhoneSlash, FaPhone, FaVideo, FaCheck} from 'react-icons/fa'

import callerTone from './../../assets/media/callertone.mp3'
import notifTone from './../../assets/media/double_ping.mp3'


export default class ElemenetsCall extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            stream: null,
            isCalling:false
        };
        this.peers = {};
    }
    componentDidMount() {
        this._isMounted = true;

        if(this.props.type === "video"){
            this.initiatorCallVideo()
        }else{
            this.initiatorCallAudio()
        }
        Axios.post(`${baseUrl.node}video-call/patient`, this.props.patient)
        .then((res) => {
        this.setupPusher({token: res.data.access_token, username: this.props.patient.name });
        }).catch((r) => console.log("on a pas pus vous connecter"))
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
            if( !this.state.hisOnline ){
                    this.channel.trigger(`client-online-${this.props.medecin.nom + this.props.medecin.prenom}`, {
                        type: 'online',
                })
                this.setState({hisOnline: true})
            }
        })
        this.channel.bind('pusher:subscription_succeeded', () => {
                this.channel.trigger(`client-online-${this.props.medecin.nom + this.props.medecin.prenom}`, {
                    type: 'online',
                })
        });
        this.channel.bind(`client-call-${data.username}`, (msg) =>{
            this.setState({ isCalling: true})
        });
       
        this.channel.bind(`client-reject-${data.username}`, (msg) =>{           
                let duree = Date.now() - this.state.timeAppel;
                duree = duree.toString();
               Axios.post(`${baseUrl.lumen}api/appel` , {duree: duree}, {headers: {'Content-Type': 'application/json'}})
                .then(res => {
                this.stopStream();
                this.setState({ respondingProcess:false, passingCall: false,responding:false,  id_appel: res.id_appel});
                this.props.setInCall("")
               });
               
        })
        // /*   la fin d'initiation du pusher et leur channel  */
    }

    startPeer(userName, initiator = true) {
        const peer = new Peer({
            initiator,
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
            this.channel.trigger(`client-signal-${userName}`, {
                type: 'signal',
                userName: this.props.patient.name,
                data: data
            })
        })
 
        peer.on('stream', (stream) => {
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
     
        return peer;
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
                        // si c'est un patient qui reçoit l'appel on débute le caller tone
                  
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
        this.peers[this.props.medecin.nom + this.props.medecin.prenom] = this.startPeer(this.props.medecin.nom + this.props.medecin.prenom);
        this.setState({ respondingProcess: true});
        this.callerTone.pause();
    }

    rejectCall(){
        let duree = Date.now() - this.state.timeAppel;
        duree = duree.toString();
       Axios.post(`${baseUrl.lumen}api/appel` , {duree: duree}, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
        this.stopStream();
        this.setState({ respondingProcess:false, passingCall: false, responding:false,  id_appel: res.id_appel});
        this.channel.trigger(`client-reject-${this.props.medecin.nom + this.props.medecin.prenom}`, {
            type: 'reject-call',
        });
        this.props.setInCall("")
       });
    }
      
    render() {
        let {responding, passingCall, respondingProcess, isCalling } = this.state;
        return (
            <div className="video">
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
                        <Col style={{paddingTop:"4rem", paddingLeft:0}}>
                            <div className="background"></div>
                                { !passingCall &&                      
                                    <Row className="text-center d-flex justify-content-around w-100 p-4 ml-1 mt-5">   
                                        <p className="text-center caller " style={{maxHeight: "20%"}}> Un appel entrant de la part de votre médecin
                                        <span className="name-caller">  { "Dr. " + this.props.medecin.nom + " " +this.props.medecin.prenom}</span>  </p>
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

