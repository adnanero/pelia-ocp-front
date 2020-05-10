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
    const [ville, setVilleSoiced] = useState("")
    const [medecin, setMedecin] = useState("")
    const [medecinsOnligne, setMedecinsOnligne] = useState([])
    const [user, setUser ] = useState({});
    const [ticket, setTicket] = useState({})
    const [number, setNumber] = useState("");

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [inCall, setInCall] = useState("")

    const [showVilles, setshowVilles] = useState(true)
    const [showMedecins, setshowMedecins] = useState(false)

    const ENDPOINT =  baseUrl.node;
  
    useEffect(() => {
      socket = io(ENDPOINT);
        let nameGenerated = Cookies.get('name');
        let idGenerated = Cookies.get('id');
      if(nameGenerated === undefined || idGenerated === undefined){
        idGenerated =  Math.random().toString().substr(3, 9);
        nameGenerated =  Math.random().toString(36).substr(3, 9);
        Cookies.set("name",nameGenerated, { expires: 1 });
        Cookies.set("id",idGenerated, { expires: 1 });
      }
      let userSocket = {name: nameGenerated, id: parseInt(idGenerated), type: "patient"}

      setUser(userSocket)
  
      socket.emit('join',  userSocket , (response) => {
        if(response.error) {
          alert(response.message);
        }else{
            setMedecinsOnligne(response.medecinsOnligne)
            setTicket(response.ticket)
        }
      });

      socket.on("medecin-switch", ({ user, type, medecinsOnligne }) => {
          if(type === "diconnected"){
              if(user.id === medecin.id){
                  alert("ce médecin est déconnecter")
              }

          }
        setMedecinsOnligne(medecinsOnligne)
      });
      socket.on('message', (message) => {
        setMessages(messages => [ ...messages, message ]);
      });
      socket.on("call-entring", ({ type }) => {
        setInCall(type)
      });
      socket.on("ticket-switch", ({ type, tickets, ticket }) => {
        setTicket(ticket)
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

    const setVille = (ville) => {
        setVilleSoiced(ville)
        setshowVilles(false)
        setshowMedecins(true)
    }
    const addTicket = (medecin) => {
        socket.emit('add-tickets',  {medecin, user : user} , (response) => {
            if(response.error) {
              console.log(response.message);
            }else{
                setNumber(response.nombre)
                setTicket(response.ticket)
            }
          });   
    }

    const setShowVille = () => {
        setshowVilles(true)
        setshowMedecins(false)
    }

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
    console.log(ticket)
    return (

        <div className="page">
            <Banner title={content.title[lang]} subtitle={content.subtitle[lang]} style={{color:'white'}} banner={ContactBanner}  />
            {
                    ticket.name === user.name ?  
                    <Container>
                        <Chat
                            setMessage={setMessage} 
                            messages={messages} 
                            message={message}  
                            medecin={medecin} 
                            user={user} 
                            sendMessage={sendMessage}
                            socket={socket}
                            ticket={ticket}
                            setTicket={setTicket}
                        />
                    </Container>                      
                   
                    :
                    <Container className="mt-5"> 
                    <CSSTransition
                        in={showVilles}
                        timeout={300}
                        classNames="villes"
                        unmountOnExit >
                            <Villes setVille={setVille} />
                    </CSSTransition>
                    <CSSTransition
                        in={showMedecins}
                        timeout={300}
                        classNames="medecins"
                        unmountOnExit >
                            <ListeMedecin addTicket={addTicket} medecinsOnligne={medecinsOnligne} setshowMedecins={setshowMedecins} setMedecin={setMedecin} ville={ville} setShowVille={setShowVille} />
                    </CSSTransition>
                </Container>
                }
           
        </div>
    )
}

function Chat(props){
    const [ready, setReadys] = useState(false)
    const setReady = () => {
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"ready", medecin : props.medecin});
        setReadys(true)
    }

    const deleteTicket = () => {
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"delete"}, () =>{} )
    }
    if(props.ticket.status === -1){
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
    else if (props.ticket.status === 0){
        return(
            <Lobby medecin={props.medecin} number={props.number} deleteTicket={deleteTicket} user={props.user}  />

        )
    }
    else if(props.ticket.status === -2){
        return(
         <div>
             fin de la discussion avec votre médecin
         </div>
     ) 
 
     }
     else if(props.ticket.status === 1){
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

    return(
        <div>
            <h4>bienvenue au lobby </h4>
            <h5>vous êtes maintenant au queue d'attente du médecin {props.medecin.nom   } votre tours viens après {props.number} personne. Chaque personne prend génèralement 5 à 10 minute </h5>
            <p>quand votre tours vas arriver vous passez directement en discusion avec votre mèdecins</p>
            <button className="btn btn-primary" onClick={props.deleteTicket}> je veux plus attendre ce médecin </button>
        </div>
    )
}


function ListeMedecin(props){
    const [medecins, setMedecins] = useState([])    
   useEffect(() => {
       Axios.get(`${baseUrl.lumen}api/medecins?id_ville=${props.ville}&&app_key=base64:HWKowqxmoXiNlACwEpk+ZqDie3DAQgtqvUncFXotLy4=` , {headers: {'Content-Type': 'application/json'}})
       .then(res => {
           res.data.map((medecin )=>{ 
               let user = props.medecinsOnligne.find((user) => user.id === medecin.id && user.state === "conected")
               return (user === undefined) ? medecin.onligne= false : medecin.onligne=true
            } )
           setMedecins(res.data)
       })
       .catch(error =>{ console.log(error)})
   
   }, []);

    useEffect(() => {
        // let newMedecin = medecins
        medecins.map((medecin) => {
            let etat =  props.medecinsOnligne.find((user) => user.id === medecin.id && user.state === "conected" )
            return (etat === undefined) ? medecin.onligne = false : medecin.onligne= true
        })
        setMedecins([...medecins])
    },[props.medecinsOnligne]);
    
   const handleClick = (medecin, event) => {
       if(medecin.onligne){
            props.setMedecin(medecin)
            props.setshowMedecins(false)
            props.addTicket(medecin)
       }else{
           
        let medecinDiv = event.currentTarget
        let paragraphe = medecinDiv.querySelector(".p")
        paragraphe.innerText = 'vous pouvez joindre ce médecin'
    }
    
   }
    return(
        <Container>
             <div className="retour-ville"> <span onClick={ () => props.setShowVille("")}> <FaArrowLeft color="#fff" /> retour </span>  </div>
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
        let isSubscribed = true

        Axios.get(`${ENDPOINT}api/villes?app_key=base64:HWKowqxmoXiNlACwEpk+ZqDie3DAQgtqvUncFXotLy4=` , {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            if (isSubscribed) {
                setVilles(res.data)
              }
            
        })
        .catch(error =>{ console.log("on n'a pas pus se connécter au serveur")})

        return () => {
            // Do unmounting stuff here
            isSubscribed = false
        }
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