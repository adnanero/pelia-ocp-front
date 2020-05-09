
const users = [];
const medecins = [];
const tickets = {};
const resolved = {};
module.exports.addUser = ({ socket_id, name, id, type }) => {
  if(!name) return { error: 'Username are required.' };

  name = name.trim().toLowerCase();
  if(type === "medecin"){
    const existingUser = medecins.find((user) => user.id === id && user.name === name);
    
  if(existingUser) {
     error= 'Username is taken.';
    return {tickets: tickets[user.name]}
  };
  const user = { socket_id, id, name, type };
  medecins.push(user);
  tickets[user.name] = [];
  resolved[user.name] = 0;
  return { user };

  }else if(type === "patient"){
    const existingUser = users.find((user) => user.id === id && user.name === name);

    if(existingUser) return { error: 'Username is taken.' };
    const user = { socket_id, id, name, type };
    users.push(user);

    return { user };
  }
}
module.exports.addTicket = ({ medecin, user, socket_id }) => {
  if(!medecin) return { error:true, message: 'aucun médecin choisit' };

  const ticket = { socket_id, name: user.name, id: user.id, status: 0 };
  
  let ticketMedecin = tickets[medecin.id];
  let count= 0;
  ticketMedecin = (ticketMedecin === undefined) ? [] : ticketMedecin;
  ticketMedecin.forEach(ticketVerify => {
    if(ticketVerify.status === 0 || ticketVerify.status === 1){
      count++;
    }
  });

  ticketMedecin = [...ticketMedecin, ticket]
  tickets[medecin.id] = ticketMedecin

  let index = users.findIndex((serched) => serched.id === user.id);
  
  users[index] = {...users[index], medecin: medecin.id }
  return { error: false, tickets: ticketMedecin, nombre: count };

}

module.exports.changeTicket = ({selectedUser, type, medecin, socket_id}) => {
  if(type === "ready"){
    let index = tickets[medecin.id].findIndex((user) => user.socket_id === socket_id)  
    let ticketsMedecin = tickets[medecin.id];
    let user = ticketsMedecin[index];
    ticketsMedecin[index]["status"] = 0;
    return { 
      tickets: tickets[medecin.id], 
      patient: user 
    }

  }else{

    let ticketsMedecin = tickets[medecin.id];
  let user = ticketsMedecin[selectedUser];
  if(ticketsMedecin !== undefined && ticketsMedecin[selectedUser]){
    if(type === "debut"){
      ticketsMedecin[selectedUser]["status"] = -1;  
    }
    if(type === "fin"){
      ticketsMedecin[selectedUser]["status"] = -2;
     
    }
    if(type === "attente"){
      ticketsMedecin[selectedUser]["status"] = 1;
      
    }
    return { 
      tickets: tickets[medecin.id], 
      patient: user 
    }
  }
  }
}

module.exports.removeUser = (socket_id) => {
  let index = medecins.findIndex((user) => user.socket_id === socket_id);
  if(index === -1){
    
    let patientIndex = users.findIndex((user) => user.socket_id === socket_id);
    let medecin =  users[patientIndex];
    if(medecin){
      let ticketsthismedecin = tickets[medecin.medecin]
      if(ticketsthismedecin){
        let ticketsIndex = ticketsthismedecin.findIndex((user) => user.socket_id === socket_id);
        const id_user_deleted = (ticketsthismedecin[ticketsIndex] !== undefined) ? ticketsthismedecin[ticketsIndex]["id"] : null
        ticketsthismedecin.splice(ticketsIndex, 1)
        users.splice(patientIndex, 1)
      return {tickets: ticketsthismedecin, id_medecin: medecin.medecin , id_user_deleted, type: "patient", medecin}
      }
      return {error : true}
    }
    // 
    
  }

  if(index !== -1) {
     
    medecins.splice(index, 1);
    return {users: medecins, type: "medecin"};
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


module.exports.getOther = (id) => {
  let user = users.find((user) => user.id == id);

  return user
}

module.exports.getUsersInRoom = (room) => users.filter((user) => user.room === room);

