
const { addUser, removeUser, getUsersInRoom,getNumber, changeTicket, getOther, getMedecinsOnligne, addTicket } = require('./users');


exports.chatMAnager = (io) => {

    io.on('connect', (socket) => {
        socket.on('join', ({ name, id, type}, callback) => {
          const { error, user, tickets } = addUser({ socket_id: socket.id, name, id, type });
          if(error) return callback({error: true, tickets, message:error});
          socket.join(id);
          const medecins = getMedecinsOnligne();
          if(user.type === "medecin"){
            io.emit('medecin-switch', { medecins :{users: medecins } });
          }
          callback({error:false, medecins});
        });
      
        socket.on('add-tickets', ({medecin, user}, callback) => {
          const { error, message, nombre, tickets } = addTicket({ medecin, user, socket_id: socket.id });

          io.to(medecin.id).emit('switch-patient', { tickets, type:"connect" });
          
          callback({error, message, nombre});
        }); 
        socket.on('switch-ticket', ({ selectedUser, type, medecin }, callback) => {
          
          if(selectedUser === undefined) return callback({error: true, message: "aucun utilisateur choisit"});
          const response = changeTicket({ selectedUser, type, medecin, socket_id: socket.id });
          if(!response) return{error:true}
          if(type === "ready"){

            io.to(medecin.id).emit('switch-patient', { tickets:response.tickets , type:"ready"});
            return callback({send: true});
          }
          else if(type === "debut"){
            
             io.to(response.patient.id).emit('ticket-switch', { type  });
          }
          else if(type === "fin"){
            io.to(response.patient.id).emit('ticket-switch', { type ,tickets: response.tickets });
            // let number = getNumber({medecin, socket_id:socket.id})
            // io.emit('number-switch', {number, medecin})
         }
         else if(type === "attente"){
            io.to(response.patient.id).emit('ticket-switch', { type  });
        }
        return callback({error: false, tickets: response.tickets});

        }); 

      

        socket.on('sendMessage', ({message, selectedUser, user}, callback) => {
                
          // if(message){
            io.to(selectedUser.id).emit('message', { user , text: message });
            io.to(user.id).emit('message', { user , text: message });
            callback();
          // }
        
        }); 
        socket.on('call-patient', ({selectedUser, user, type}) => {               
            io.to(selectedUser.id).emit('call-entring', { medecin : user , type });
        }); 
      
      
        socket.on('disconnect', (reason) => {
          const users = removeUser(socket.id);
          if(users){

            if(users.type == "medecin"){
              io.emit('medecin-switch', { medecins: users, reason });
          }else{
              io.to(users.id_medecin).emit('switch-patient', { tickets:users.tickets, id_user_deleted: users.id_user_deleted , type:"disconnect", reason});
          }

          }
          
        })
      });
      
}