
// const { addUser, removeUser,getNumber, changeTicket, addTicket } = require('./users');
const UsersController = require('./users');
const socketio = require('socket.io');



 var chatMAnager = (socket, packtchat) => {
    
        socket.on('join', ( request , callback) => {
          socket.join(request.id);
          if ( request.type === "medecin" ) {
            const { error, tickets, medecinsOnligne } = UsersController.addMedecin({ socket_id: socket.id, name : request.name, id : request.id, nom :request.nom, prenom: request.prenom });
            if(error) return callback({error: true, message:error});
            packtchat.emit('medecin-switch', {  medecinsOnligne, type: "conected"});
            callback({error:false, tickets});
          }else{
            const { error, ticket, medecin, medecinsOnligne } = UsersController.addPatient({ pseudo: request.pseudo, socket_id: socket.id, name: request.name, id: request.id });
            callback({error:false, ticket, medecin, medecinsOnligne});
          }
          
        });

        socket.on('add-tickets', ({medecin, user}, callback) => {
          const { error, message, nombre, tickets, ticket } = UsersController.addTicket({ medecin, user, socket_id: socket.id });
          socket.to(medecin.id).emit('switch-patient', { tickets, type:"conected" });
          callback({error, message, nombre, ticket});
        }); 
        socket.on('switch-ticket', ({ selectedUser, type, medecin }, callback) => {
          
          if(selectedUser === undefined) return callback({error: true, message: "aucun utilisateur choisit"});
          const {ticket, tickets, patient, idMedecin} = UsersController.changeTicket({ selectedUser, type, medecin, socket_id: socket.id });
          if(ticket === undefined) return{error:true, ticket: {}}
          if(type === "ready"){
            packtchat.to(medecin.id).emit('switch-patient', { tickets, ticket , type:"ready"});
            return {send: true, tickets, ticket};
          }
          else if(type === "debut"){ 
             socket.to(patient.id).emit('ticket-switch', { type ,tickets, ticket });
          }
          else if(type === "fin"){
            socket.to(patient.id).emit('ticket-switch', { type ,tickets, ticket });
         }
         else if(type === "attente"){
            socket.to(patient.id).emit('ticket-switch', { type, tickets, ticket  });

        }else if (type === "delete") {
          packtchat.to(selectedUser.id).emit('ticket-switch', { type, tickets, ticket: {}  });
          socket.to(idMedecin).emit('ticket-switch', { type, tickets, ticket: {}  });

        }
        return callback({error: false, ticket, tickets});
        }); 
        
        socket.on('sendMessage', ({message, selectedUser, user}, callback) => {
            socket.to(selectedUser.id).emit('message', { user , text: message });           
            callback({ user , text: message });        
        }); 

      socket.on('call-patient', ({selectedUser, type}) => {               
            socket.to(selectedUser.id).emit('call-entring', { type });
        }); 
      socket.on('patient-ready', ({selectedUser}) => {               
          socket.to(selectedUser.id).emit('ready-patient', { });
      }); 
      socket.on('client-call', ({selectedUser}) => {               
        socket.to(selectedUser.id).emit('patient-call', { });
      }); 
      socket.on('confirm-call', ({selectedUser, data}) => {               
        socket.to(selectedUser.id).emit('signal-call', { data });
      }); 
      socket.on('medecin-confirm-call', ({selectedUser, data}) => {               
        socket.to(selectedUser.id).emit('patient-signal-call', { data });
      }); 
      socket.on('medecin-reject', ({selectedUser}) => {               
        socket.to(selectedUser.id).emit('reject-call-patient', {  });
      }); 
      socket.on('patient-reject-call', ({selectedUser}) => {               
        socket.to(selectedUser.id).emit('reject-call-medecin', {  });
      }); 
      
        socket.on('disconnect', (reason) => {
          const {user, type, message, error, medecinsOnligne, tickets} = UsersController.removeUser(socket.id);
          if(!error){
            if(type == "medecin"){
              packtchat.emit('medecin-switch', { medecinsOnligne, type: "disconnected", reason });
          }else{
            packtchat.to(user.medecin).emit('switch-patient', { tickets, user , type:"disconnect", reason});
          }
          }
        })
    // });
      
}
var socketAuth = function socketAuth(socket, next){
  return next();
  return next(new Error('Nothing Defined'));
  };

exports.startIo =(server) => {
  const io = socketio(server);

  var packtchat = io.of('/packtchat');
  // packtchat.use(socketAuth);

  packtchat.on('connection', (socket) => chatMAnager(socket, packtchat));
  
  return io;
};
