import React from "react";
import Chat from "./chat/Chat.jsx";
import "./css/App.css";
// The main App component
const App = () => {
  return (
    // Using React fragments to avoid unnecessary divs
    <>
      <main>
        <Chat />
      </main>
    </>
  );
};

export default App;
