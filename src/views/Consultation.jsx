import React, { useState, useEffect } from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import Cookies from 'js-cookie'
import io from "socket.io-client";
import Axios  from 'axios';

import {BsCircleFill} from 'react-icons/bs';
import {FaArrowLeft} from 'react-icons/fa';

import ContactBanner from './../assets/img/contact.png'
import './consultation.css'
import benguerir from './../assets/img/villes/benguerir.jpg'
import casablanca from './../assets/img/villes/casablanca.jpg'
import eljadida from './../assets/img/villes/eljadida.jpg'
import safi from './../assets/img/villes/safi.jpg'
import youssoufia from './../assets/img/villes/youssoufia.jpg'
import khouribga from './../assets/img/villes/khouribga.jpg'
import laayoune from './../assets/img/villes/laayoune.jpg'
// import medecin from './../assets/img/medecin/doctor.png'
import medecine from './../assets/img/medecin/female-doctor.png'

import baseUrl from './../config'

import Banner from './../components/BannerSimple'

import ChatPAtient from './../components/patientChat/index'
import VideoCall from './../components/patientChat/videoChat'
import { CSSTransition } from 'react-transition-group';

let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let socket;


const imageVilles = [
    benguerir,
     casablanca,
     eljadida ,
     khouribga ,
     laayoune ,
     safi ,
     youssoufia
     
];


export default function Home() {
    const [ville, setVille] = useState("")
    const [medecin, setMedecin] = useState("")
    const [medecinsOnligne, setMedecinsOnligne] = useState([])
    const [user, setUser ] = useState({});
    const [number, setNumber] = useState("")
    const [onConsuting, setConsulting] = useState("");

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [inCall, setInCall] = useState("")

    const ENDPOINT =  baseUrl.node;
  
    useEffect(() => {
      socket = io(ENDPOINT);
      let idGenerated =  Math.random().toString().substr(3, 9)
      let nameGenerated =  Math.random().toString(36).substr(3, 9)
      let userSocket = {name: nameGenerated, id: parseInt(idGenerated), type: "patient"}
        setUser(userSocket)
  
      socket.emit('join',  userSocket , (response) => {
        if(response.error) {
          alert(response.message);
        }else{
            setMedecinsOnligne(response.medecins)
        }

      });
      socket.on("medecin-switch", ({ medecins }) => {
        setMedecinsOnligne(medecins.users)
      });
      socket.on("call-entring", ({ type }) => {
        setInCall(type)
        console.log(type)
        // callback('en ligne & ready');
      });
      socket.on("ticket-switch", ({ type, tickets }) => {
        setConsulting(type)
        if(type === "fin"){
            let count= 0;
            tickets.forEach(ticketVerify => {
              if(ticketVerify.status === 0 || ticketVerify.status === 1){
                count++;
                if(ticketVerify.id === user.id){
                    setNumber(count)
                    return
                }
              }
            });
        }
      });
  
    }, [ENDPOINT]);

    const addTicket = () => {
        socket.emit('add-tickets',  {medecin: medecin, user : user} , (response) => {
            if(response.error) {
              console.log(response.message);
            }else{
                setNumber(response.nombre)
            }
          });   
    }

    useEffect(() => {
        socket.on("medecin-switch", ({ medecins }) => {
          setMedecinsOnligne(medecins.users)
        });
        socket.on('message', (message) => {
            setMessages(messages => [ ...messages, message ]);
          });
    }, []);

    const sendMessage = (event) => {

        event.preventDefault();
        if(message) {
            socket.emit('sendMessage', {message, selectedUser: medecin, user }, () => setMessage(''));
        }
    }
   
    if(inCall === "video" || inCall === "audio"){
        return (
            <VideoCall socket={socket} medecin={medecin} patient={user} type={inCall} setInCall={setInCall} />
        )
    }
    
      return (
        <div className="page">
            <Banner title={content.title[lang]} subtitle={content.subtitle[lang]} style={{color:'white'}} banner={ContactBanner}  />
            <Container className="mt-5"> 
                <CSSTransition
                    in={ville==="" && medecin === ""  && onConsuting === ""}
                    timeout={300}
                    classNames="villes"
                    unmountOnExit >
                        <Villes setVille={setVille} />
                </CSSTransition>
                <CSSTransition
                    in={ville !== "" && medecin === ""  && onConsuting === ""}
                    timeout={300}
                    classNames="medecins"
                    unmountOnExit >
                        <ListeMedecin medecinsOnligne={medecinsOnligne} setMedecin={setMedecin} ville={ville} setVille={setVille} />
                </CSSTransition>
                <CSSTransition
                    in={medecin !== "" && onConsuting === ""}
                    timeout={300}
                    classNames="chat"
                    unmountOnExit >
                        <Lobby medecin={medecin} addTicket={addTicket} number={number} user={user} medecinsOnligne={medecinsOnligne}/>
                </CSSTransition>
                {
                    onConsuting !== "" &&
                    <Chat 
                        setMessage={setMessage} 
                        messages={messages} 
                        message={message}  
                        onConsuting={onConsuting} 
                        medecin={medecin} 
                        user={user} 
                        sendMessage={sendMessage}
                    />
                }
            </Container>
        </div>
    )
}

function Chat(props){
    const [ready, setReadys] = useState(false)
    const setReady = () => {
        socket.emit('switch-ticket',  { selectedUser : props.user, type:"ready", medecin : props.medecin} , (response) => {
            if(response.send){
                setReadys(true)
            //   setTickets(response.tickets)
            }
        });
    }
  
    if(props.onConsuting === "debut"){
       return(
        <div>
            <ChatPAtient 
                setMessage={props.setMessage} 
                medecin={props.medecin} 
                user={props.user} 
                message={props.message} 
                messages={props.messages}
                sendMessage={props.sendMessage}
                
            />
        </div>
            
    ) 

    }
    else if(props.onConsuting === "fin"){
        return(
         <div>
             fin de la discussion avec votre médecin
         </div>
     ) 
 
     }
     else if(props.onConsuting === "attente"){
        return(
         <div>

             vous avez manquer la discussion avec votre médecin attender quelque instant, votre médecin vas vous repparler
             {!ready ?
                 <button className="btn btn-primary" onClick={setReady} > maintenant disponible </button>
                 :
                <div>vous êtes maintenant prêt </div> 
             }
                
         </div>
     ) 
 
     }
     return null
    
}

function Lobby (props){
  
    useEffect(() => {
        props.addTicket()
    }, []);
    useEffect (() =>{
        let index = props.medecinsOnligne.findIndex((med) => med.id === props.medecin.id)
        if(index === -1){
            alert('ce médecin à était déconnecter')
        }
    },[props.medecinsOnligne]);

    return(
        <div>
            <h4>bienvenue au lobby </h4>
            <h5>vous êtes maintenant au queue d'attente du médecin {props.medecin.nom   } votre tours viens après {props.number} personne. Chaque personne prend génèralement 5 à 10 minute </h5>
            {/* <ChatPAtient {...props} selectedMedecin={props.medecin} /> */}
            <p>quand votre tours vas arriver vous passez directement en discusion avec votre mèdecins</p>
        </div>
    )
}


function ListeMedecin(props){
    const [medecins, setMedecins] = useState([])
   useEffect(() => {
       Axios.get(`${baseUrl.lumen}api/medecins?id_ville=${props.ville}&&app_key=base64:HWKowqxmoXiNlACwEpk+ZqDie3DAQgtqvUncFXotLy4=` , {headers: {'Content-Type': 'application/json'}})
       .then(res => {
           res.data.map(medecin=> (props.medecinsOnligne.find((user) => user.id === medecin.id)) ? medecin.onligne=true: medecin.onligne=false )
           setMedecins(res.data)
       })
       .catch(error =>{ console.log("on n'a pas pus se connécter au serveur")})
   
   }, []);

    useEffect(() => {
        setMedecins(meds =>{
            meds.map(medecin=> (props.medecinsOnligne.find((user) => user.id === medecin.id)) ? medecin.onligne=true : medecin.onligne=false )
            return [...meds]
        });
    },[props.medecinsOnligne]);
   const handleClick = (medecin, event) => {
       if(medecin.onligne){
            props.setMedecin(medecin)
       }else{
           
        let medecinDiv = event.currentTarget
        let paragraphe = medecinDiv.querySelector(".p")
        paragraphe.innerText = 'vous pouvez joindre ce médecin'
    }
    
   }
    return(
        <Container>
             <div className="retour-ville"> <span onClick={ () => props.setVille("")}> <FaArrowLeft color="#fff" /> retour </span>  </div>
        <Row>
            {
                medecins.map((medecin, index) =>
                <Col lg="4" key={index} className="my-3">
                    <div onClick={ (e) => handleClick(medecin, e)} className={medecin.onligne ? "medecin onligne" : "medecin offligne"} >
                        <HoverableImage onligne={medecin.onligne} name={"dr. "+ medecin.nom + " " + medecin.prenom} image={medecine} />
                    </div>
                </Col>
                )
            }
        </Row>
    </Container>
    )
}
function HoverableImage(props){
    return(
        <figure className="effect-apollo">
        <img src={props.image} />
        <figcaption>
            <div className="layer"></div>
            <div className={props.onligne ? "onligne status": "status offline"}>
                <BsCircleFill color={props.onligne ? "#5cb85c": "#d9534f"} />
    <span>{ props.onligne? "en ligne": "hors ligne"}</span>
            </div>
            <p className="p">{props.subtitle}</p>
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <h5 className="text-white">{props.name}</h5>
                
            </div> 
        </figcaption>
    </figure>
    )
}
 function Villes(props) {
     const ENDPOINT = baseUrl.lumen
     const [villes, setVilles] = useState([])
    useEffect(() => {
        Axios.get(`${ENDPOINT}api/villes?app_key=base64:HWKowqxmoXiNlACwEpk+ZqDie3DAQgtqvUncFXotLy4=` , {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            setVilles(res.data)
        })
        .catch(error =>{ console.log("on n'a pas pus se connécter au serveur")})
    
    }, [ENDPOINT]);
    return (
        <Container>
            <Row>
                {
                    villes.map((ville, index) =>
                    <Col lg="4" key={index} className="my-3">
                        <a onClick={ () => props.setVille(ville.id)} className="ville" >
                            <HoverableImage name={ville.nom_ville} image={imageVilles[ville.id -1]} />
                        </a>
                    </Col>
                    )
                }
            </Row>
        </Container>
    )
}
let content = {
    title:{fr:"consultation en ligne",ar:"اتصل بنا"},
    subtitle:{fr:"choisir votre ville de résidence ensuite votre médecin et attendez votre tours", 
        ar:"سواء كان لديك سؤال حول الميزات أو التجارب أو الأسعار أو تحتاج إلى عرض توضيحي أو أي شيء آخر ، فإن فريقنا على استعداد للإجابة على جميع أسئلتك"}
}