
const users = [];
const medecins = [];
const tickets = {};
const resolved = {};


module.exports.addMedecin = ({ socket_id, name, id, nom, prenom, sexe }) => {
  if(!name) return { error: 'Username are required.' };

  name = name.trim().toLowerCase;
  const user = { socket_id, id, nom, prenom, name, sexe, type: "medecin", state: "conected" };
  
  const existingUser = medecins.findIndex((user) => user.id === id);
    if(existingUser === -1) {
      medecins.push(user);
      tickets[user.id] = [];
      resolved[user.id] = 0;
    }else{
      medecins[existingUser] = user;
    }
    
 
  return { error:false, medecinConnected: user, tickets: tickets[user.id] };  
}

module.exports.addPatient = ({ socket_id, name, id, pseudo }) => {
  if(!name) return { error: 'Username are required.' };

  name = name.trim().toLowerCase();
  const user = { socket_id, id, name, pseudo, type : "patient", state: "conected" };
 
    const existingUser = users.find((user) => user.id === id && user.name === name);
    let message= "";
    if(existingUser === undefined) {
      users.push(user);
      message = "new user";
      return { medecin: {}, error: false, ticket:{}, user, message };
    }else{
      
      if(existingUser.medecin === undefined){
        message = "patient n'a pas de ticket";
        return { error: false, user, ticket:{}, medecin: {}, message };
      }else{
        message ="patient a déjà une ticket";
        let ticketsThisMedecin = tickets[existingUser.medecin];
        let ticketUser = ticketsThisMedecin.findIndex((ticket) => ticket.name === existingUser.name && ticket.id === existingUser.id);
        if(ticketsThisMedecin[ticketUser] === undefined) return {message: "ticket non trouver", medecin: {}, ticket: {}, user: existingUser } 
        ticketsThisMedecin[ticketUser] = {...ticketsThisMedecin[ticketUser], state: "conected"};
        tickets[existingUser.medecin] = ticketsThisMedecin
        // tickets[existingUser.medecin] = ticketsThisMedecin;
        let medecin = medecins.find((med) => med.id === existingUser.medecin);
        return { error:false, ticket:ticketsThisMedecin[ticketUser], tickets: tickets[existingUser.medecin] , user, message, medecin };
      }
    }    
  
}
module.exports.addTicket = ({ medecin, user }) => {
  if(!medecin) return { error:true, message: 'aucun patient choisit' };

  const ticket = { name: user.name, pseudo: user.pseudo, id: user.id, status: 0, state : "conected" };
  let ticketMedecin = tickets[medecin.id];
  ticketMedecin = [...ticketMedecin, ticket]
  tickets[medecin.id] = ticketMedecin

  let index = users.findIndex((serched) => serched.id === user.id);
  
  users[index] = {...users[index], medecin: medecin.id }
  return { error: false, ticket, tickets: ticketMedecin };

}
module.exports.deleteTicket = ({medecin, ticket}) => {
  
  let ticketMedecin = tickets[medecin.id];
  let ticketIndex = ticketMedecin.findIndex((tikt) => tikt.name === ticket.name);
  ticketMedecin.splice(ticketIndex, 1)
  return { error: false, ticket: {} , tickets: ticketMedecin };


}
module.exports.openTicket = ({medecin, ticket}) => {
  let ticketsMedecin = tickets[medecin.id];

  if (!ticketsMedecin) return {error: true, message: "ce medecin n'existe pas dans les tableau de ticket"}
  let indexTicket = ticketsMedecin.findIndex((ticketMed => ticketMed.name === ticket.name))
  ticket = { ...ticket, status: 1};
  ticketsMedecin[indexTicket] = ticket; 
  return { 
    tickets: tickets[medecin.id], 
    ticket
  }
}
module.exports.closeTicket = ({medecin, ticket}) => {
  let ticketsMedecin = tickets[medecin.id];
  if (!ticketsMedecin) return {error: true, message: "ce medecin n'existe pas dans les tableau de ticket"}
  let indexTicket = ticketsMedecin.findIndex((ticketMed => ticketMed.name === ticket.name))
  ticketsMedecin.splice(indexTicket, 1)
  return { 
    tickets: tickets[medecin.id]
  }
}


module.exports.removeUser = (socket_id) => {
  let medecinindex = medecins.findIndex((user) => user.socket_id === socket_id && user.state === "conected");

  if(medecinindex === -1){
    let patientIndex = users.findIndex((user) => user.socket_id === socket_id);
    
      if(patientIndex === -1) return {error : true, message: 404}
      let patient = users[patientIndex]
        // si un patient qui vas être déconnecter on le met on etat deconnected 
        users[patientIndex] = {...patient , state: "disconnected"}
        
        let ticketsthismedecin = tickets[patient.medecin]; // on prend le tableau des tickets du medecin auquel le patient à était authentifier
        if(ticketsthismedecin === undefined) return {error : true, message: "aucune ticket"} // si le tableau n'existe pas alors il n'a pas ecore pris leur ticket donc on arrete le processus

        let ticketPAtient = ticketsthismedecin.findIndex((user) => user.name === users[patientIndex]["name"]); //on cherche l'indice du ticket du ce patient specifique
        if(ticketPAtient === -1) return {error : true, message: "aucune ticket"} // si le ticket n'existe pas on block le rocessus

        ticketsthismedecin[ticketPAtient] = {...ticketsthismedecin[ticketPAtient], state: "disconnected"} // on change le ticket de ce patient avec leur médecin en etat déconnecter
        
        tickets[patient.medecin] = ticketsthismedecin // on modifier les changement dans la variable globale
      return {user: patient, tickets:ticketsthismedecin , type: "patient"} 
  }
  else {
     // si un medecin qui vas être déconnecter on le met on etat deconnected 
    medecins[medecinindex] = {...medecins[medecinindex] , state: "disconnected"}
    return {user: medecins[medecinindex],  type: "medecin"};
  }
}

module.exports.getNumber = ({ medecin}) =>{
  let ticketMedecin = tickets[medecin.id];
  let count= 0;
  ticketMedecin = (ticketMedecin === undefined) ? [] : ticketMedecin;
  ticketMedecin.forEach(ticketVerify => {
    if(ticketVerify.status === 0 || ticketVerify.status === 1){
      count++;
    }
  });

  return count
}

module.exports.getMedecinsOnligne = () =>{
  return medecins
}


module.exports.medecinsNumber = () => {
  let medecinsOnligne = [...medecins];
  medecinsOnligne.map((med) => {
    let ticketsthisMedecin = tickets[med.id]
    med.nombreTicket = ticketsthisMedecin.length;
   
  });
  return medecinsOnligne
}