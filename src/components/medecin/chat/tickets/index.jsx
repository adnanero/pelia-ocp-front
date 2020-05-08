import React from 'react';


import { useEffect } from 'react';

const TextContainer = ({ tickets,metVeille,passingConsulting, finishingConsult, resolved, setConsulting,nmbr_ticket, setNombreTicket, onConsuting }) => {
  
  useEffect (() =>{
    
    let count = 0;
    tickets.forEach(ticketVerify => {
      if(ticketVerify.status === 0 || ticketVerify.status === 1 ){
        count++;
      }
    });
    setNombreTicket(count)
  },[tickets]);
  
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
      { tickets.length ?

      <div>
        vous a vez ecore : {nmbr_ticket} <br />
        {
          onConsuting ?
          <div className="action-consulting">
            <button className="btn btn-primary" onClick={ finTicket }>fermer le ticket</button>
            <button className="btn btn-primary" onClick={ attenteTicket }>mettre en attente</button>
          </div>
          :
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
