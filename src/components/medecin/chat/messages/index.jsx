import React,{useRef, useEffect} from 'react';

const Messages = ({ messages, user }) => {

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect( ()=> {
	  scrollToBottom();
	  let lastMessage = document.querySelector('.messages');
	  if(lastMessage !== null){
	      lastMessage.focus();
	  }
  }, [messages]);
  return(
    <div  className="content">
      <div className="messages">

      { messages ? messages.map((message, i) => <Message key={i} message={message} thisuser={user}/>) : null }

      <div ref={messagesEndRef} />
    </div>
  </div>
  ) 
};

export default Messages;

const Message = ({ message: { text, user }, thisuser }) => {

  let isSentByCurrentUser = false;
  if(user.name === thisuser.name) {
    isSentByCurrentUser = true;
  }

  return (
 <div className={ (isSentByCurrentUser)? "messageContainer sent" : "messageContainer replies"}>
          <div className="message">
            <p className="messageName">{ isSentByCurrentUser? "Moi" : user.type}</p>
            <p className="messageText">{text}</p>
          </div>
            
        </div>            
  );
}

