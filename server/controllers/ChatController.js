
// const { addUser, removeUser,getNumber, changeTicket, addTicket } = require('./users');
const UsersController = require('./users');


exports.chatMAnager = (io) => {

    io.on('connect', (socket) => {
        socket.on('join', ( request , callback) => {
          // { name, id, type}
          socket.join(request.id);
          if ( request.type === "medecin" ) {
            const { error, tickets, medecinsOnligne } = UsersController.addMedecin({ socket_id: socket.id, name : request.name, id : request.id, nom :request.nom, prenom: request.prenom });
            if(error) return callback({error: true, message:error});
            io.emit('medecin-switch', {  medecinsOnligne, type: "conected"});
            callback({error:false, tickets});
          }else{
            const { error, ticket, medecin, medecinsOnligne } = UsersController.addPatient({ socket_id: socket.id, name: request.name, id: request.id });
            callback({error:false, ticket, medecin, medecinsOnligne});
          }
          
        });

        socket.on('add-tickets', ({medecin, user}, callback) => {
          const { error, message, nombre, tickets, ticket } = UsersController.addTicket({ medecin, user, socket_id: socket.id });
          io.to(medecin.id).emit('switch-patient', { tickets, type:"conected" });
          callback({error, message, nombre, ticket});
        }); 
        socket.on('switch-ticket', ({ selectedUser, type, medecin }, callback) => {
          
          if(selectedUser === undefined) return callback({error: true, message: "aucun utilisateur choisit"});
          const {ticket, tickets, patient, idMedecin} = UsersController.changeTicket({ selectedUser, type, medecin, socket_id: socket.id });
          if(ticket === undefined) return{error:true, ticket: {}}
          if(type === "ready"){
            io.to(medecin.id).emit('switch-patient', { tickets, ticket , type:"ready"});
            return callbselectedUserack({send: true, tickets, ticket});
          }
          else if(type === "debut"){ 
             io.to(patient.id).emit('ticket-switch', { type ,tickets, ticket });
          }
          else if(type === "fin"){
            io.to(patient.id).emit('ticket-switch', { type ,tickets, ticket });
         }
         else if(type === "attente"){
            io.to(patient.id).emit('ticket-switch', { type, tickets, ticket  });

        }else if (type === "delete") {
          io.to(selectedUser.id).emit('ticket-switch', { type, tickets, ticket: {}  });
          io.to(idMedecin).emit('ticket-switch', { type, tickets, ticket: {}  });

        }

        return callback({error: false, ticket, tickets});

        }); 
        socket.on('sendMessage', ({message, selectedUser, user}, callback) => {
                
          // if(message){
            io.to(selectedUser.id).emit('message', { user , text: message });
            io.to(user.id).emit('message', { user , text: message });
            callback();
          // }
        
        }); 
      socket.on('call-patient', ({selectedUser, type}) => {               
            io.to(selectedUser.id).emit('call-entring', { type });
        }); 
      socket.on('patient-ready', ({selectedUser}) => {               
          io.to(selectedUser.id).emit('ready-patient', { });
      }); 
      socket.on('client-call', ({selectedUser}) => {               
        io.to(selectedUser.id).emit('patient-call', { });
      }); 
      socket.on('confirm-call', ({selectedUser, data}) => {               
        io.to(selectedUser.id).emit('signal-call', { data });
      }); 
      socket.on('medecin-confirm-call', ({selectedUser, data}) => {               
        io.to(selectedUser.id).emit('patient-signal-call', { data });
      }); 
      socket.on('medecin-reject', ({selectedUser}) => {               
        io.to(selectedUser.id).emit('reject-call-patient', {  });
      }); 
      socket.on('patient-reject-call', ({selectedUser}) => {               
        io.to(selectedUser.id).emit('reject-call-medecin', {  });
      }); 
      
        socket.on('disconnect', (reason) => {
          const {user, type, message, error, medecinsOnligne, tickets} = UsersController.removeUser(socket.id);
          if(!error){
            if(type == "medecin"){
              io.emit('medecin-switch', { medecinsOnligne, type: "disconnected", reason });
          }else{
            io.to(user.medecin).emit('switch-patient', { tickets, user , type:"disconnect", reason});
          }
          }
        })
    });
      
}