import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import { useState } from "react";

function App() {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center bg-slate-200 gap-4">
      <button className="bg-blue-500 rounded-full h-20 w-20 hover:bg-blue-700 transition ease-in-out">
        <FontAwesomeIcon
          icon={faMicrophone}
          className="w-80p h-80p text-white"
        />
      </button>
      <input
        type="text"
        className="border-2 hover:border-gray-400 rounded-lg p-2 transition ease-in-out"
        placeholder="Type a command..."
      />
    </div>
  );
}

export default App;
