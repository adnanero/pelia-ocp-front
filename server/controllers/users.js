
const users = [];
const medecins = [];
const tickets = {};
const resolved = {};
module.exports.addUser = ({ socket_id, name, id, type }) => {
  if(!name) return { error: 'Username are required.' };

  name = name.trim().toLowerCase();
  const user = { socket_id, id, name, type, state: "conected" };
  if(type === "medecin"){
  const existingUser = medecins.findIndex((user) => user.id === id);
    if(existingUser === -1) {
      medecins.push(user);
      tickets[user.id] = [];
      resolved[user.id] = 0;
    }else{
      medecins[existingUser] = user;
    }

  return { error:false, user, medecinsOnligne: medecins, tickets: tickets[user.id] };

  }else if(type === "patient"){
    const existingUser = users.find((user) => user.id === id && user.name === name);
    let message= "";
    if(existingUser === undefined) {
      users.push(user);
      message = "new user";
      return { error: false, ticket:{}, user, message, medecinsOnligne: medecins };
    }else{
      
      if(existingUser.medecin === undefined){
        message = "patient n'a pas de ticket";
        return { error: false, user, ticket:{}, message, medecinsOnligne: medecins };
      }else{
        message ="patient a déjà une ticket";
        let ticketsThisMedecin = tickets[existingUser.medecin];
        let ticketUser = ticketsThisMedecin.find((ticket) => ticket.name === existingUser.name && ticket.id === existingUser.id);
        if(ticketUser === undefined) return {message: "ticket non trouver", ticket: {}, user: existingUser, medecinsOnligne: medecins } 
        ticketUser = {...ticketUser, status: 0, state: "conected"};
        tickets[existingUser.medecin] = ticketsThisMedecin;

        return { error:false, ticket:ticketUser, user, message, medecinsOnligne: medecins };
      }
    }    
  }
}
module.exports.addTicket = ({ medecin, user, socket_id }) => {
  if(!medecin) return { error:true, message: 'aucun médecin choisit' };

  const ticket = { socket_id, name: user.name, id: user.id, status: 0 };
  
  let ticketMedecin = tickets[medecin.id];
  let count= 0;
  if(ticketMedecin !== undefined) {
    ticketMedecin.forEach(ticketVerify => {
      if(ticketVerify.status === 0 || ticketVerify.status === 1){
        count++;
      }
    });
  
  }
 
  ticketMedecin = [...ticketMedecin, ticket]
  tickets[medecin.id] = ticketMedecin

  let index = users.findIndex((serched) => serched.id === user.id);
  
  users[index] = {...users[index], medecin: medecin.id }
  return { error: false, ticket, tickets: ticketMedecin, nombre: count };

}

module.exports.changeTicket = ({selectedUser, type, medecin}) => {
  if(type === "ready"){
    let index = tickets[medecin.id].findIndex((user) => user.id === selectedUser.id)  
    let ticketsMedecin = tickets[medecin.id];
    let user = ticketsMedecin[index];
    ticketsMedecin[index]["status"] = 0;
    return { 
      tickets: tickets[medecin.id], 
      patient: user,
      ticket: ticketsMedecin[index]
    }
  }else if (type === "delete"){
    patient = users.find((user) => user.id === selectedUser.id); 
    let index = tickets[patient.medecin].findIndex((user) => user.id === selectedUser.id); 
    tickets[patient.medecin].splice(index, 1)
  
    return { 
      tickets: tickets[patient.medecin], 
      ticket: {}
    }
  }
  else{

    let ticketsMedecin = tickets[medecin.id];
  let user = ticketsMedecin[selectedUser];
  if(ticketsMedecin !== undefined && ticketsMedecin[selectedUser]){
    if(type === "debut"){
      ticketsMedecin[selectedUser]["status"] = -1;  
    }
    else if(type === "fin"){
      ticketsMedecin[selectedUser]["status"] = -2;
     
    }
    else if(type === "attente"){
      ticketsMedecin[selectedUser]["status"] = 1;
      
    }
    return { 
      tickets: tickets[medecin.id], 
      patient: user,
      ticket: ticketsMedecin[selectedUser]
    }
  }
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
    medecins[medecinindex] = {...medecins[medecinindex], status:-2 , state: "disconnected"}
    return {user: medecins[medecinindex], medecinsOnligne: medecins, type: "medecin"};
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

