import React, { Component, useState } from 'react';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
import autoBind from 'react-autobind';
import Axios from 'axios'
import Cookies from 'js-cookie'

import baseUrl from './../../../config'

import {CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Row, Col} from 'react-bootstrap'
import {FaPhoneSlash, FaPhone, FaCheck} from 'react-icons/fa'

import callerTone from './../../../assets/media/callertone.mp3'
import notifTone from './../../../assets/media/double_ping.mp3'


export default class ElemenetsCall extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            stream: null,
        };
        this.peers = {};
        this.patient = props.patient
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
            if(!this.state.imOnline){
                this.channel.trigger(`client-online-${this.patient.name}`, {
                    type: 'online',
                });
                this.callVideoTo();
            }   
        })
        this.channel.bind('pusher:subscription_succeeded', () => {
                this.channel.trigger(`client-online-${this.patient.name}`, {
                    type: 'online',
                })
                this.props.medecinReady();
        });

        this.channel.bind(`client-reject-${data.username}`, (msg) =>{
            if(this.state.passingCall) {
                this.stopStream();
                this.setState({ respondingProcess:false, passingCall: false, stream : null, responding:false});  
                this.props.setInCall("")
            }
          
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
                userName: this.state.user.name,
                data: data
            })
        })
 
        peer.on('stream', (stream) => {
            if(this.props.type === "video"){
                try {
                        this.userVideo.srcObject = stream;
                        this.userVideo.play();
                } catch (e) {
                    console.log(e)
                    // this.userVideo.src = URL.createObjectURL(stream)
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

    componentDidMount() {

        let token = Cookies.get('token')
        this.setState({user: this.props.medecin})
        this.setupPusher({token: token, username: this.props.medecin.name  }); 
        if(this.props.type === "video"){
            this.initiatorCallVideo()
        }else{
            this.initiatorCallAudio()
        }
      
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

    callVideoTo() {
        this.channel.trigger(`client-call-${this.patient.name}`, {
            type: 'call-video',
            userName: this.state.user.name,
            data:{from: this.state.user.name}
        });
        this.setState({callFrom: this.patient.name, hisOnline: true});
    }

    callTo() {
        this.setState({respondingProcess: true})
        
        this.channel.trigger(`client-call-${this.patient.name}`, {
            type: 'call-audio',
            userName: this.state.user.name,
            data:{from: this.state.user.name}
        });
        this.setState({respondingProcess: false, callFrom: this.patient.name})
    }

    rejectCall(){
        this.channel.trigger(`client-reject-${this.state.callFrom}`, {
            type: 'reject-call',
        });
        this.stopStream();
        this.setState({ respondingProcess:false, passingCall: false, stream : null, responding:false});  
        this.props.setInCall("")
        
    }
      
    render() {
        let { responding, passingCall, respondingProcess} = this.state;
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
                { (this.props.type === "video" || this.props.type === "audio") &&
                    <Row className={!passingCall ? "responding process": "responding"}>   
                        <Col style={{paddingTop:"4rem", paddingLeft:0}}>
                            <div className="background"></div>
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

