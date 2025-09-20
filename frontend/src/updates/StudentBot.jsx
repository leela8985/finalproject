import React, { useState } from 'react';
import image1 from '../images/college_logo.png'
import './StudentBot.css';


const API_URL = process.env.REACT_APP_API_URL

// Helper function to render multiline message text.
const renderMultilineText = (text) => {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

const StudentBot = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setMessage(e.target.value);

    // Fetch bot response from the backend.
    const generateBotResponse = async (studentMessage) => {
      try {
        const response = await fetch(`${API_URL}/auth/api/getResponse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: studentMessage }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log('Bot response:', data.reply); // Log the bot's response to the console
        return data.reply || "No reply received";
      } catch (error) {
        console.error('Error fetching bot response:', error);
        return `Error: ${error.message || "Couldn't contact server"}`;
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Append student's message
            const studentMsg = {
                id: `student-${Date.now()}`,
                text: message,
                sender: 'Student'
            };
            setChat((prevChat) => [...prevChat, studentMsg]);
            setMessage('');

            // Set loading indicator
            setLoading(true);

            // Fetch bot response
            const botReply = await generateBotResponse(message);
            setLoading(false);

            // Append bot response
            const botMsg = {
                id: `bot-${Date.now()}`,
                text: botReply,
                sender: 'Bot'
            };
            setChat((prevChat) => [...prevChat, botMsg]);

            // Log the full chat history to the console
            console.log('Chat history:', [...chat, studentMsg, botMsg]);
        }
    };

    return (
        <div className="student-bot">
            <h2  style={{textAlign:'center', fontWeight:'bold', marginTop:'5px'}} >  <img style={{height:'32px'}} src={image1} alt="" /> Student Bot</h2>
            <div className="chat-window">
                {chat.map((chatItem) => {
                    // Determine CSS class based on message length
                    let sizeClass = '';
                    if (chatItem.text.length > 100) {
                        sizeClass = 'large-message';
                    } else if (chatItem.text.length > 50) {
                        sizeClass = 'medium-message';
                    } else {
                        sizeClass = 'small-message';
                    }
                    return (
                        <div
                            key={chatItem.id}
                            className={`chat-message ${chatItem.sender === 'Student' ? 'student' : 'bot'} ${sizeClass}`}
                        >
                            <strong>{chatItem.sender}:</strong>
                            <div className="message-text">
                              {renderMultilineText(chatItem.text)}
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="chat-message bot small-message">
                        <strong>Bot:</strong> Typing...
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input style={{letterSpacing: '0.5px', textAlign: 'left', fontSize: '16px', paddingRight:'36%', marginTop:'10px'}}
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="Type your message"
                    className="chat-input"
                />
                <button  style={{marginRight:'25px', borderRadius:'25px'}} type="submit" className="chat-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default StudentBot;