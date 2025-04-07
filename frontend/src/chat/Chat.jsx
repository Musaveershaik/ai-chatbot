import React, { useState, useEffect, useRef } from "react";

import ChatBody from "../components/ChatBody";
import ChatInput from "../components/ChatInput";
import Settings from "../components/Settings";

const Chat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [settings, setSettings] = useState({
    topK: 10,
    model: "gpt-4o",
    temperature: 0.7
  });

  // Fetch settings from MongoDB on component mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error fetching settings:', err));
  }, []);
  const [typingIntervalId, setTypingIntervalId] = useState(null);
  const [typingIndicatorMessage, setTypingIndicatorMessage] =
    useState("Typing");
  const EXPRESS_PORT = 1337; // Port that the Express server is running on

  const firstRender = useRef(true); // Using useRef to check the first render

  const displayUserMessage = (message) => {
    // Add the user's message to the chat messages
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { message, type: "user" },
    ]);
    // Clear the input field
    setUserInput("");
  };

  const displayChatbotMessage = (message) => {
    if (isChatbotTyping) {
      clearInterval(typingIntervalId);
      setIsChatbotTyping(false);
    }

    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { message, type: "chatbot" },
    ]);
  };
  // Typing indicator logic
  const displayTypingIndicator = () => {
    if (!isChatbotTyping) {
      setIsChatbotTyping(true);
      clearInterval(typingIntervalId); // Clear the interval before setting a new one
      const intervalId = setInterval(() => {
        setTypingIndicatorMessage((prevMessage) => {
          if (prevMessage === "Typing...") {
            return "Typing";
          } else if (prevMessage === "Typing") {
            return "Typing.";
          } else if (prevMessage === "Typing.") {
            return "Typing..";
          } else if (prevMessage === "Typing..") {
            return "Typing...";
          }
        });
      }, 400);
      setTypingIntervalId(intervalId);
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") {
      return;
    }
    displayUserMessage(userInput);
    displayTypingIndicator();

    try {
      console.log("Sending request to backend...");
      // Log to verify the API call is being attempted
      
      // Make a POST request to the backend API endpoint
      // Include both the user's question and current settings configuration
      // This allows for dynamic adjustment of model parameters from the frontend

      //${import.meta.env.VITE_BACKEND_URL}/api
      
      const response = await fetch(`https://ai-chat-bot-with-vector-db-1-musaveershaikh4.replit.app/api`, {

      
      
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            question: userInput,
            settings: settings 
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response);
      const data = await response.json();
      // Display both the response and current settings

      //Use this if You Don't Want to Display Changed Setting -> displayChatbotMessage(data.message);
      const messageWithSettings = `${data.message}\n\nUsed Settings:\nModel: ${settings.model}\nTop K: ${settings.topK}\nTemperature: ${settings.temperature}`;
      displayChatbotMessage(messageWithSettings);
      setIsChatbotTyping(false); // Set typing indicator to false after receiving the response
    } catch (error) {
      console.error("Error:", error);
      displayChatbotMessage(`Sorry an error has occurred... (${error})`);
      setIsChatbotTyping(false); // Set typing indicator to false if an error occurs
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  // Send message when the user presses the enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  // Display welcome message on first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      displayChatbotMessage(
        `Hi, I'm a Chat Bot. What can I help you with today?`,
      );
    }
  }, [firstRender]);

  return (
    <div className="chat-container">
      <div className="chat-title">Chatbot</div>
      <Settings settings={settings} onSettingsChange={setSettings} />
      <ChatBody
        chatMessages={chatMessages}
        isChatbotTyping={isChatbotTyping}
        typingIndicatorMessage={typingIndicatorMessage}
      />
      <ChatInput
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        onClick={sendMessage}
      />
    </div>
  );
};

export default Chat;
