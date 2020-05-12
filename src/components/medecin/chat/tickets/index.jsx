import React from 'react';


import { useEffect } from 'react';

const TextContainer = ({ tickets,metVeille,passingConsulting, finishingConsult, resolved, setConsulting,nmbr_ticket, setNombreTicket, onConsuting }) => {
  
  useEffect (() =>{
    
    let count = 0;
    tickets.forEach(ticketVerify => {
      if((ticketVerify.status === 0) && ticketVerify.state === "conected" ){
        count++;
      }
    });
    setNombreTicket(count);
    console.log(tickets)
  },[tickets]);
  useEffect (() =>{
    // passingConsulting()
  },[]);
  
  const finTicket = () => {
    setConsulting(false)
    finishingConsult()
  }
  const attenteTicket = () => {
    setConsulting(false)
    metVeille()
  }
  // console.log(onConsuting)
return(
  <div className="sidepanel">
     
    <div className="tickets">
      <div className="tickets-infos">
      { nmbr_ticket ?
      <div>
        <h5 className="text-center"> Vous avez ecore : {nmbr_ticket} patients en attente </h5><br />
          { !onConsuting && nmbr_ticket > 0 &&
            <div className="col text-center"> 
            <button className="btn btn-primary mt-5" onClick={ passingConsulting }>diagnostiquer le prochain patient</button>
          </div>
          }
      </div>
      :
      <div className="tickets d-flex active text-center col">
        <h5 className="text-center"> Vous n'avez encore aucun patient sur votre liste </h5>
         
      </div>
      }

      {
            onConsuting &&
            <div className="action-consulting col text-center align-items-center">
              <button className="btn btn-primary" onClick={ finTicket }>Fermer le ticket</button>
              <button className="btn btn-primary" onClick={ attenteTicket }>Mettre en attente</button>
            </div>
          }
    
      </div>

      
    </div>
    <div className="resolved text-center">
      Vous avez faite {resolved} consultation aujourd'hui
    </div>
  </div>
);
}
export default TextContainer;
