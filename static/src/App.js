import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FighterCard from "./components/FighterCard";
import FightLog from "./components/FightLog";
import Footer from "./components/Footer"
import { Button } from "react-bootstrap";
import { useState } from "react";




function App() {

  // Initialize players
  const [player1, setPlayer1] = useState({
    "name": "PORKKANA",
    "hp": 33,
    "attack": 5.6,
    "defense": 0.63,
    "fat": 0,
    "cooldown": 3,
    "speed": 0.16,
    "dps": 0.871
  });
  const [player2, setPlayer2] = useState({
    "name": "PAPRIKA",
    "hp": 30,
    "attack": 5.1,
    "defense": 0.94,
    "fat": 0,
    "cooldown": 7,
    "speed": 0.16,
    "dps": 0.817
  });

  // Initialize fight log
  const [messages, setMessages] = useState([
    "Welcome to food fight!",
  ]);

  // Fight logic
  const fight = (player1, player2) => {
    let p1 = Object.assign({}, player1);
    let p2 = Object.assign({}, player2);
    let timeP1 = 0
    let timeP2 = 0

    let messageString = `[0.00s] - Fight between ${p1.name} and ${p2.name} has begun!`

    setMessages(currentState => [...currentState, messageString])

    const intervalPlayer1 = setInterval(player1Turn, p1.cooldown * 100);
    const intervalPlayer2 = setInterval(player2Turn, p2.cooldown * 100);

    function player1Turn() {
      timeP1 += p1.cooldown

      const damageInflicted = p1.attack * (1 - (p2.defense / 100))

      const messageString = `[${timeP1.toFixed(2)}s] - [${p1.name} (${p1.hp.toFixed(0)}hp)] hits [${p2.name} (${p2.hp.toFixed(0)}hp)] for [${p1.attack}-${p2.defense}% = ${damageInflicted.toFixed(2)}] damage!`

      setMessages(currentState => [...currentState, messageString])

      p2.hp -= damageInflicted

      if (p2.hp <= 0) {
        clearInterval(intervalPlayer1)
        clearInterval(intervalPlayer2)
        setMessages(currentState => [...currentState, `[${timeP1.toFixed(2)}s] - ${p2.name} has been defeated!`])
        setMessages(currentState => [...currentState, `${p1.name} wins!`])
      }
    }

    function player2Turn() {
      timeP2 += p2.cooldown

      const damageInflicted = p2.attack * (1 - (p1.defense / 100))

      const messageString = `[${timeP2.toFixed(2)}s] - [${p2.name} (${p2.hp.toFixed(0)}hp)] hits [${p1.name} (${p1.hp.toFixed(0)}hp)] for [${p2.attack}-${p1.defense}% = ${damageInflicted.toFixed(2)}] damage!`

      setMessages(currentState => [...currentState, messageString])

      p1.hp -= p2.attack * (1 - p1.defense)

      if (p1.hp <= 0) {
        clearInterval(intervalPlayer1)
        clearInterval(intervalPlayer2)
        setMessages(currentState => [...currentState, `[${timeP2.toFixed(2)}s] - ${p1.name} has been defeated!`])
        setMessages(currentState => [...currentState, `${p2.name} wins!`])
      }
    }
  }

  return (
    <div className="App">
      <div className="Title">
        <h1>FOOD FIGHT</h1>
      </div>

      <div className="App-cardZone">

        <FighterCard
          player={player1}
          playerNo="1"
          updateParentPlayer={setPlayer1}
        />

        <FighterCard
          player={player2}
          playerNo="2"
          updateParentPlayer={setPlayer2}
        />

      </div>

      <div>
        <Button onClick={() => fight(player1, player2)} variant="danger" size="lg" style={{ color: "black", "fontWeight": "bold" }}>
          FIGHT
        </Button>
      </div>

      <div>
        <FightLog messages={messages} clearLog={() => setMessages([])} />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
