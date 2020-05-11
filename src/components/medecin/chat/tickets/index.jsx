import React from 'react';


import { useEffect } from 'react';

const TextContainer = ({ tickets,metVeille,passingConsulting, finishingConsult, resolved, setConsulting,nmbr_ticket, setNombreTicket, onConsuting }) => {
  
  useEffect (() =>{
    
    let count = 0;
    tickets.forEach(ticketVerify => {
      if((ticketVerify.status === 0 || ticketVerify.status === -1) && ticketVerify.state === "conected" ){
        count++;
      }
    });
    setNombreTicket(count)
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
return(
  <div className="sidepanel">
     
    <div className="tickets">
      <div className="tickets-infos">
      { nmbr_ticket ?
      <div>
        vous avez ecore : {nmbr_ticket} en attente <br />
    
          {
            onConsuting &&
            <div className="action-consulting">
              <button className="btn btn-primary" onClick={ finTicket }>fermer le ticket</button>
              <button className="btn btn-primary" onClick={ attenteTicket }>mettre en attente</button>
            </div>
          }
          { !onConsuting && nmbr_ticket > 0 &&
            <button className="btn btn-primary" onClick={ passingConsulting }>patient suivant</button>
          }
      </div>
      :
      <div className="tickets d-flex active">
          vous n'avez encore aucun patient sur votre liste
      </div>
      }
    <div className="resolved">
      vous avez faite {resolved} consultation aujourd'hui
    </div>
      </div>

      
    </div>
  </div>
);
}
export default TextContainer;
