import React,{useRef, useEffect} from 'react';

const Messages = ({ messages, name }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);
  return(
    <div  className="content">
      <div className="messages">

      { messages ? messages.map((message, i) => <Message key={i} message={message} name={name}/>) : null }

      <div ref={messagesEndRef} />
    </div>
  </div>
  ) 
};

export default Messages;

const Message = ({ message, name }) => {
  let isSentByCurrentUser = false;

  return (
        <div className={ (isSentByCurrentUser)? "messageContainer sent" : "messageContainer replies"}>
            <p>{name}</p>
            <p className="messageText">{message}</p>
        </div>
  );
}

