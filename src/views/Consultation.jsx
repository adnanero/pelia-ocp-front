import React, { useState, useEffect } from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import Cookies from 'js-cookie'
import io from "socket.io-client";
import Axios  from 'axios';

import {BsCircleFill} from 'react-icons/bs';
import {FaArrowLeft} from 'react-icons/fa';

import ContactBanner from './../assets/img/contact.png'
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
import Feedback from './../components/patientChat/feedback'
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
            setMedecin(response.medecin)
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
   
    
    return (

        <div className="page">
            <Banner title={content.title[lang]} subtitle={content.subtitle[lang]} style={{color:'white'}} banner={ContactBanner}  />
            {
                ticket.name === user.name ?  
                <Container className = "mt-5">
                    <Ticket
                        setMessage={setMessage} 
                        messages={messages} 
                        message={message}  
                        medecin={medecin} 
                        user={user} 
                        sendMessage={sendMessage}
                        socket={socket}
                        ticket={ticket}
                        setInCall={setInCall}
                        setTicket={setTicket}
                        inCall={inCall}
                        medecinsOnligne={medecinsOnligne}
                        setshowVilles={setshowVilles}
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

function Ticket(props){
    const [ready, setReadys] = useState(false)
    const [medecinHorsLigne, setMedecinHorsLigne]= useState(false)
    const [idTicket, setIdTicket] = useState(null)
    const setReady = () => {
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"ready", medecin : props.medecin});
        setReadys(true)
    }
    useEffect(() => {
        let thisMedecin = props.medecinsOnligne.find((med) => med.id === props.medecin.id);
        if (thisMedecin === undefined){
            setMedecinHorsLigne(true);
        }else{
            if(thisMedecin.state === "disconnected"){
                setMedecinHorsLigne(true);
            }else{
                if (medecinHorsLigne) {
                    setMedecinHorsLigne(false);
                }
            }
        }
    })
    const saveTicket = () => {
        let datetime = Date.now() - this.state.timeAppel;
        datetime = datetime.toString();
       Axios.post(`${baseUrl.lumen}api/ticket` , {datetime: datetime, id_medecin : props.medecin.id}, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            setIdTicket(res.id_appel);
       });
    }

    const deleteTicket = () => {
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"delete"}, () =>{} )
        props.setshowVilles(true)
    }

    const finTicket  = () => {
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"delete"}, () =>{} )
        props.setshowVilles(true)
        // finTicket
    }
    if( props.inCall === "video" || props.inCall === "audio"){
        return (
            <VideoCall idTicket={idTicket} socket={props.socket} medecin={props.medecin} patient={props.user} type={props.inCall} setInCall={props.setInCall} />
        )
    }

    else if(medecinHorsLigne){
        return (
            <div>
                Ce médecin est hors ligne
                <button className="btn btn-primary" onClick={deleteTicket}> je veux plus attendre ce médecin </button>
            </div>
        )
    }
    else if(props.ticket.status === -1){
       return(
        <div>
            <ChatPAtient 
                setMessage={props.setMessage} 
                medecin={props.medecin} 
                user={props.user} 
                message={props.message} 
                messages={props.messages}
                sendMessage={props.sendMessage}
                idTicket={idTicket}
            />
        </div>
    ) 

    }
    else if (props.ticket.status === 0){
        return(
            <div>
            <h4>Bienvenue au lobby </h4>
            <h5>Vous êtes maintenant au queue d'attente du médecin {props.medecin.nom} votre tours viens après {props.number} personne. Chaque personne prend génèralement 5 à 10 minute </h5>
            <p>Quand votre tours vas arriver vous passez directement en discusion avec votre mèdecins</p>
            <div className="col text-center mt-4 mb-5">
            <button className="btn btn-primary" onClick={deleteTicket}> Je veux plus attendre ce médecin </button>
            </div>
        </div>
        )
    }
    else if(props.ticket.status === -2){
        return(
         <div>
             Fin de la discussion avec votre médecin
             <Feedback finTicket={finTicket} id_ticket ={idTicket} />
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
        paragraphe.innerText = 'Ce médecin est hors ligne'
    }
    
   }
    return(
        <Container className="mt-5">
             <div className="retour-ville"> <span onClick={ () => props.setShowVille("")}> <FaArrowLeft color="#fff" /> Retour </span>  </div>
        <Row>
            {
                medecins.map((medecin, index) =>
                <Col lg="4" key={index} className="my-3">
                    <div onClick={ (e) => handleClick(medecin, e)} className={medecin.onligne ? "medecin onligne" : "medecin offligne"} >
                        <MedecinImage onligne={medecin.onligne} name={"docteur "+ (index + 1)} image={medecine} />
                    </div>
                </Col>
                )
            }
        </Row>
    </Container>
    )
}


function MedecinImage(props){
    return(
        <figure style={{  background: "#038DFE"  }} className="">
        <img src={props.image} alt={props.name} />
        <figcaption className={props.onligne ? "onligne": "offline"}>
            <div className={props.onligne ? "onligne status": "status offline"}>
                <BsCircleFill color={props.onligne ? "#5cb85c": "#d9534f"} />
    <span>{ props.onligne? "en ligne": "hors ligne"}</span>
            </div>
            <p className="p">{props.subtitle}</p>
            <div className="d-flex flex-column justify-content-end align-items-center h-100">
                <h5 className="">{props.name}</h5>
                
            </div> 
        </figcaption>
    </figure>
    )
}

function HoverableImage(props){
    return(
        <figure className="effect-apollo">
        <img src={props.image} alt={props.name} />
        <figcaption>
            <div className="layer"></div>
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
        .catch(error =>{ console.log("On n'a pas pus se connécter au serveur")})

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
                        <div onClick={ () => props.setVille(ville.id)} className="ville" >
                            <HoverableImage name={ville.nom_ville} image={imageVilles[ville.id -1]} />
                        </div>
                    </Col>
                    )
                }
            </Row>
        </Container>
    )
}
let content = {
    title:{fr:"Consultation en ligne",ar:"الإستشارة عن بعد"},
    subtitle:{fr:"Choisir votre ville de résidence ensuite votre médecin et attendez votre tours", 
        ar:"أختر المدينة التي تقطن فيها و بعد ذلك الطبيب الذي تريد أن تستشيره و انتظر دورك"}
}