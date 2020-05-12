import React, { useState, useEffect } from 'react'
import {Row, Col, Container, Modal, Button} from 'react-bootstrap'
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
import medecine from './../assets/img/medecin/homme.png'
import medecineFemme from './../assets/img/medecin/femme.png'

import baseUrl from './../config'

import Banner from './../components/BannerSimple'

import ChatPAtient from './../components/patientChat/index'
import VideoCall from './../components/patientChat/videoChat'
import Feedback from './../components/patientChat/feedback'
import { CSSTransition } from 'react-transition-group';

import TextField from '@material-ui/core/TextField';


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

export default function Consultation(){
    const [show, setShow] = useState(true);
    const [pseudoName , setPseudo] =useState("");
    let pseudo = Cookies.get('pseudo');
    const SavePseudo = () =>{
        Cookies.set('pseudo', pseudoName);
        setShow(false);
    }
    const handleChange = (e) => {
        setPseudo(e.target.value)
    }
    
    if(pseudo === undefined){
        return(
            <Modal show={show}>
            <Modal.Header>
              <Modal.Title>  {content.modal.titre[lang]} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="my-4"> {content.modal.body[lang]} </p>
                 <TextField fullWidth label="Pseudo" onChange={handleChange} />
            </Modal.Body>
        
            <Modal.Footer>
              <Button variant="primary" onClick={SavePseudo}>
              {content.modal.button[lang]}
              </Button>
            </Modal.Footer>
          </Modal>
        )
    }
    return(
        <Home pseudo={pseudo} />
    )
}

function Home({pseudo}) {
    const [ville, setVilleSoiced] = useState("");
    const [nomVille , setNomVille] =useState("")
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
    const [changeBanner, setChangeBanner] = useState(false);

    const ENDPOINT =  baseUrl.node;
  
    useEffect(() => {
      socket = io(ENDPOINT+"packtchat");
        let nameGenerated = Cookies.get('name');
        let idGenerated = Cookies.get('id');
      if(nameGenerated === undefined || idGenerated === undefined){
        idGenerated =  Math.random().toString().substr(3, 9);
        nameGenerated =  Math.random().toString(36).substr(3, 9);
        Cookies.set("name",nameGenerated, { expires: 1 });
        Cookies.set("id",idGenerated, { expires: 1 });
      }
      let userSocket = {name: nameGenerated, pseudo, id: parseInt(idGenerated), type: "patient"}
  
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
        setVilleSoiced(ville.id);
        setNomVille(ville.nom_ville);
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
            socket.emit('sendMessage', {message, selectedUser: medecin, user }, (message) => {
                setMessage(''); 
                setMessages(messages => [ ...messages, message ]);
             })
        }
    }
   
    
    return (

        <div className="page chat_patient">
	    <Banner title={content.title[lang]} subtitle={!changeBanner ? content.subtitle[lang] : "Vous êtes dans la liste d'attente , patientez s'il vous plaît"} style={{color:'white'}} banner={ContactBanner}  />
            {
                ticket.name === user.name ?  
                <Container>
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
                        nomVille={nomVille}
                    />
                </Container>                      
                
                :
                <Container className="mt-5"> 
                <CSSTransition
                    in={showVilles}
                    timeout={300}
                    classNames="villes"
                    unmountOnExit >
                        <Villes setChangeBanner={setChangeBanner} setVille={setVille} />
                </CSSTransition>
                <CSSTransition
                    in={showMedecins}
                    timeout={300}
                    classNames="medecins"
                    unmountOnExit >
                        <ListeMedecin setChangeBanner={setChangeBanner} addTicket={addTicket} medecinsOnligne={medecinsOnligne} setshowMedecins={setshowMedecins} setMedecin={setMedecin} ville={ville} setShowVille={setShowVille} />
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
       Axios.post(`${baseUrl.lumen}api/ticket` , {id_medecin : props.medecin.id, nom_ticket: props.user.id}, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            setIdTicket(res.id_appel);
       });
    }

    const deleteTicket = () => {
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"delete"}, () =>{} );
        props.setshowVilles(true)
    }

    const finTicket  = (e) => {
        // e.preventDefault();
        props.socket.emit('switch-ticket',  { selectedUser : props.user, type:"delete"}, () =>{} );
        props.setshowVilles(true);
        // finTicket
    }
    if( props.inCall === "video" || props.inCall === "audio"){
        return (
            <VideoCall idTicket={idTicket} socket={props.socket} medecin={props.medecin} patient={props.user} type={props.inCall} setInCall={props.setInCall} />
        )
    }

    else if(medecinHorsLigne){
        return (
            <div className="col text-center">
                 <h3 className="mt-3">{content.ticket.horsLigne.message[lang]}</h3> 
                <button className="btn btn-primary mt-3" onClick={deleteTicket}> {content.ticket.horsLigne.button[lang]}  </button>
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
                nomVille={props.nomVille}
            />
        </div>
    ) 

    }
    else if (props.ticket.status === 0){
        return(
            <div>
            <h3 className="text-center mt-3"> {content.ticket.Loby.titre[lang]}  </h3>
            <h5 className="text-center mt-3">{content.ticket.Loby.soustitre[lang]} {props.nomVille}</h5>
            <p className="text-center mt-3"> {content.ticket.Loby.message[lang]} </p>
            <div className="col text-center mt-4 mb-5">
            <button className="btn btn-primary" onClick={deleteTicket}>{content.ticket.Loby.button[lang]}  </button>
            </div>
        </div>
        )
    }
    else if(props.ticket.status === -2){
        return(
         <div>
             <h3 className="text-center mt-5"> {content.ticket.end[lang]}  </h3>
             <Feedback finTicket={finTicket} id_ticket ={idTicket} />
         </div>
     ) 
 
     }
     else if(props.ticket.status === 1){
        return(
         <div className="col text-center">
           <h3 className="text-center mt-3"> {content.ticket.manquer.titre[lang]}</h3>
             {!ready ?
                 <button className="btn btn-primary mt-3" onClick={setReady} > {content.ticket.manquer.button[lang]} </button>
                 :
                <div> {content.ticket.manquer.pret[lang]} </div> 
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
       .catch(error =>{ console.log('On a pas pu récupérer la liste des médecin lié à la ville demander')})
   
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
            props.setChangeBanner(true);
            props.setMedecin(medecin)
            props.setshowMedecins(false)
            props.addTicket(medecin)
       }else{
           
        let medecinDiv = event.currentTarget
        let paragraphe = medecinDiv.querySelector(".p");
        paragraphe.innerText = content.listemedecins.horsligne[lang]
    }
    
   }
    return(
        <Container className="mt-5">
             <div className="retour-ville"> <span onClick={ () => props.setShowVille("")}> <FaArrowLeft color="#fff" /> {content.listemedecin.retour[lang]} </span>  </div>
        <Row>
            {
                medecins.map((medecin, index) =>
                <Col lg="4" key={index} className="my-3">
                    <div onClick={ (e) => handleClick(medecin, e)} className={medecin.onligne ? "medecin onligne" : "medecin offligne"} >
                        <MedecinImage medecin={medecin} onligne={medecin.onligne} name= {content.listemedecin.medecin[lang] + (index + 1)} image={medecin.sexe == 0 ?  medecine : medecineFemme } />
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
        <figure  className="effect-apollo">
	    <img src={props.image} className="w-100"   alt={props.name} />   
        <figcaption className={props.onligne ? "onligne": "offline"}>
            <div className={props.onligne ? "onligne status": "status offline"}>
                <BsCircleFill color={props.onligne ? "#5cb85c": "#d9534f"} />
    <span>{ props.onligne? content.listemedecin.medecinenligne[lang] : content.listemedecin.medecinhorsligne[lang]}</span>
            </div>
            <p className="p">{props.subtitle}</p>
            <div className="d-flex flex-column justify-content-end align-items-center h-100">
                <h3 className="mb-3">{props.name}</h3>
                
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

     const setChangeBanner = () =>{
        props.setChangeBanner(false)
     }
    useEffect(() => {
        setChangeBanner();
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
                        <div onClick={ () => props.setVille(ville)} className="ville" >
                            <HoverableImage name={ (lang === "fr") ? ville.nom_ville: ville.nom_ville_arabe } image={imageVilles[ville.id -1]} />
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
        ar:"أختر المدينة التي تقطن فيها و بعد ذلك الطبيب الذي تريد أن تستشيره و انتظر دورك"
    },
    modal:{
        titre:{ 
            fr:"Choisir un pseudo",
            ar:"اختر اسما يظهر للطبيب"
        },
        body:{
            fr:"Entrer un nom pour l'afficher à vos médecin lors des consultations",
            ar:"اختر اسما يظهر للطبيب"
        },
        button:{
            fr:"Enregistrer",
            ar:"تسجيل"
        }       
    },
    ticket:{
        horsLigne:{
            message:{
                fr:"Ce médecin est hors ligne",
                ar:"هذا الطبيب خارج الخط"  
            },
            button:{
                fr:"Je veux plus attendre ce médecin",
                ar:"لم أعد أريد انتظار دوري"
            }
        },
        Loby:{
            titre : {
                fr:"Bienvenue au file d'attente",
                ar:"مرحبًا بك في قائمة الانتظار"
            },
            soustitre : {
                fr:"Vous êtes maintenant au queue d'attente du médecin de la ville",
                ar:"أنت الآن في لائحة انتظار طبيب مدينة "
            },
            message : {
                fr:"Quand votre tours vas arriver vous passez directement en discussion avec votre médecin",
                ar:"عندما يحين دورك ، تذهب مباشرة إلى المحادثة مع طبيبك"
            },
            button : {
                fr:"Je veux plus attendre ce médecin",
                ar:"لم أعد أريد انتظار دوري"
            }
        },
        end:{
            fr:"Fin de la discussion avec votre médecin",
            ar:"نهاية المحادثة مع طبيبك"
        },
        manquer:{
            titre:{
                fr:"Vous avez manqué la discussion avec votre médecin attendre quelque instant, votre médecin vas vous repparler",
                ar:"فاتتك المحادثة مع طبيبك انتظر لحظة ، وسيتصل بك طبيبك مرة أخرى"
            },
            button:{
                fr:"Maintenant disponible",
                ar:"متاح حاليا"
            },
            pret:{
                fr:"Vous êtes maintenant prêt, vous serez le prochain à être consulter avec ce médecin ",
                ar:"أنت الآن جاهز لرؤية هذا الطبيب, أنت القادم"
            },
        },
    },
    listemedecin:{
        retour:{
            fr:"Retour",
            ar:"عودة"
        },
        horsligne:{
            fr:"Ce médecin est hors ligne",
            ar:"هذا الطبيب خارج الخط"
        },
        medecin:{
            fr:"medecin ",
            ar:"طبيب"
        },
        medecinhorsligne:{
            fr:"hors ligne",
            ar:"خارج الخط"
        },
        medecinenligne:{
            fr:"en ligne",
            ar:"على الخط"
        }

    }
    
}
