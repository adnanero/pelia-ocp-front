

// const { addUser, removeUser,getNumber, changeTicket, addTicket } = require('./users');
const UsersController = require('./users');
const socketio = require('socket.io');



 var chatMAnager = (socket, packtchat) => {
    
        socket.on('join', ( request , callback) => {
          if(!request) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})
          socket.join(request.id);
          if ( request.type === "medecin" ) {
            const { error, tickets, medecinConnected } = UsersController.addMedecin({ socket_id: socket.id, name : request.name, id : request.id, nom :request.nom, prenom: request.prenom, sexe: request.sexe });
            if(error) return callback({error: true, message:error});
            packtchat.emit('medecin-connected', {  medecinConnected});
            let medecinsOnligne = UsersController.medecinsNumber();
            packtchat.emit('medecins-changed', {medecinsOnligne});
            callback({error:false, tickets});
          }else{
            const { error, ticket, medecin, tickets } = UsersController.addPatient({ pseudo: request.pseudo, socket_id: socket.id, name: request.name, id: request.id });
            packtchat.to(medecin.id).emit('switch-patient', { tickets, type:"conected"});
            let medecinsOnligne = UsersController.medecinsNumber();
            callback({error:false, ticket, medecin, medecinsOnligne});
          }
          
        });

        socket.on('add-ticket', ({medecin, user}, callback) => {
          if(!medecin || !user) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"});
          const { error, message, tickets, ticket } = UsersController.addTicket({ medecin, user });
          packtchat.to(medecin.id).emit('switch-patient', { tickets });
          let medecinsOnligne = UsersController.medecinsNumber();
            packtchat.emit('medecins-changed', {medecinsOnligne});
          callback({error, message, ticket});
        }); 
        socket.on('delete-ticket', ({medecin, ticket}, callback) => {
          if(!medecin || !ticket) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"});
          const { error, message, tickets } = UsersController.deleteTicket({ medecin, ticket });
          packtchat.to(medecin.id).emit('switch-patient', { tickets });
          let medecinsOnligne = UsersController.medecinsNumber();
            packtchat.emit('medecins-changed', {medecinsOnligne});
          callback({error, message, ticket: {} });
        }); 
        socket.on('open-ticket', ({ticket, medecin}, callback) => {
          if(!medecin || !ticket) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})
          const response = UsersController.openTicket({ ticket, medecin });
          packtchat.to(response.ticket.id).emit('ticket-is-oppened', { ticket: response.ticket });
          let medecinsOnligne = UsersController.medecinsNumber();
            packtchat.emit('medecins-changed', {medecinsOnligne});
          callback(response);
        }); 
        socket.on('close-ticket', ({medecin, ticket}, callback) => {
          if(!medecin || !ticket) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})
          const response = UsersController.closeTicket({ ticket, medecin });
          let medecinsOnligne = UsersController.medecinsNumber();
            packtchat.emit('medecins-changed', {medecinsOnligne});
          packtchat.to(ticket.id).emit('ticket-is-closed', { });
          callback(response);
        }); 

        
        
        socket.on('sendMessage', ({message, selectedUser, user}, callback) => {
          if(!message || !selectedUser || !user) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})
            packtchat.to(selectedUser.id).emit('message', { user , text: message });
            callback({ user , text: message }); 
        }); 

      socket.on('call-patient', ({selectedUser, type}) => {    
        if(!selectedUser || !type) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})                     
        packtchat.to(selectedUser.id).emit('call-entring', { type });
        }); 
      socket.on('patient-ready', ({selectedUser}) => {     
        if(!selectedUser) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})                    
        packtchat.to(selectedUser.id).emit('ready-patient', { });
      }); 
      socket.on('client-call', ({selectedUser}) => {               
        packtchat.to(selectedUser.id).emit('patient-call', { });
      }); 
      socket.on('confirm-call', ({selectedUser, data}) => {   
        if(!selectedUser) return callback({error: true, message:"vous n'avez znvoyer aucune information auserveur"})                      
        packtchat.to(selectedUser.id).emit('signal-call', { data });
      }); 
      socket.on('medecin-confirm-call', ({selectedUser, data}) => {               
        packtchat.to(selectedUser.id).emit('patient-signal-call', { data });
      }); 
      socket.on('medecin-reject', ({selectedUser}) => {               
        packtchat.to(selectedUser.id).emit('reject-call-patient', {  });
      }); 
      socket.on('patient-reject-call', ({selectedUser}) => {               
        packtchat.to(selectedUser.id).emit('reject-call-medecin', {  });
      }); 
      
        socket.on('disconnect', (reason) => {
          const {user, type, message, error, tickets} = UsersController.removeUser(socket.id);
          if(!error){
            let medecinsOnligne = UsersController.medecinsNumber();
            packtchat.emit('medecins-changed', {medecinsOnligne});
            if(type == "medecin"){
              packtchat.emit('medecin-disconnected', { medecinDisconnected: user, reason });
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
