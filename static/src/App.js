import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FighterCard from "./components/FighterCard";
import FightLog from "./components/FightLog";
import Footer from "./components/Footer"
import { Button } from "react-bootstrap";
import { useState } from "react";
// import { Card, Table } from 'react-bootstrap';

function App() {
  const [player1, setPlayer1] = useState({
    name: "-",
    energy: "",
    carbs: "",
    protein: "",
    fat: "",
    cooldown: "",
  });
  const [player2, setPlayer2] = useState({
    name: "-",
    energy: "",
    carbs: "",
    protein: "",
    fat: "",
    cooldown: "",
  });

  return (
    <div className="App">
      <div className="Title">
        <h1>FOOD FIGHT</h1>
      </div>

      <div className="App-cardZone">

        <FighterCard
          name={player1.name}
          energy={player1.energy}
          carbs={player1.carbs}
          protein={player1.protein}
          fat={player1.fat}
          cooldown={player1.cooldown}
          playerNo="1"
        />

        <FighterCard
          name={player2.name}
          energy={player2.energy}
          carbs={player2.carbs}
          protein={player2.protein}
          fat={player2.fat}
          cooldown={player2.cooldown}
          playerNo="2"
        />

      </div>

      <div>
        <Button variant="danger" size="lg" style={{ color: "black", "font-weight": "bold" }}>
          FIGHT
        </Button>
      </div>

      <div>
        <FightLog />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
