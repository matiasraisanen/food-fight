import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import { useState } from "react";

import FighterCard from "./components/FighterCard";
import FightLog from "./components/FightLog";
import Footer from "./components/Footer"
import Toaster from "./components/Toaster";
import Header from "./components/Header";

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
  const [fightLogMessages, setFightLogMessages] = useState([
    "--------------------------",
    "Welcome to food fight!",
    'Press "CHANGE" to change fighters',
    'Press "FIGHT" to begin'
  ]);

  // Used for disabling buttons during fight
  const [fightOngoing, setFightOngoing] = useState(false);

  // fightSpeedMultiplier determines how fast the fights are carried out compared to real time. Defaults to 10x
  const [fightSpeedMultiplier, setFightSpeedMultiplier] = useState(100);

  // Used for displaying error messages
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");

  // Fight logic
  const fight = (player1, player2) => {
    setFightOngoing(true);
    let p1 = Object.assign({}, player1);
    let p2 = Object.assign({}, player2);
    let timeP1 = 0
    let timeP2 = 0

    // console.log("p1", p1);
    // console.log("p2", p2);

    let messageString = `[0.00s] - Fight between ${p1.name} and ${p2.name} has begun!`

    setFightLogMessages(currentState => [messageString, ...currentState,])

    const intervalPlayer1 = setInterval(player1Turn, p1.cooldown * (1000 / fightSpeedMultiplier));
    const intervalPlayer2 = setInterval(player2Turn, p2.cooldown * (1000 / fightSpeedMultiplier));

    function player1Turn() {
      timeP1 += p1.cooldown

      const damageInflicted = p1.attack * (1 - (p2.defense / 100))

      const messageString = `[${timeP1.toFixed(2)}s] - [ ${p1.name} (${p1.hp.toFixed(0)}hp) ] hits [ ${p2.name} (${p2.hp.toFixed(0)}hp) ] for [${p1.attack}-${p2.defense}% = ${damageInflicted.toFixed(2)}] damage!`

      setFightLogMessages(currentState => [messageString, ...currentState])

      p2.hp -= damageInflicted

      if (p2.hp <= 0) {
        clearInterval(intervalPlayer1)
        clearInterval(intervalPlayer2)
        setFightLogMessages(currentState => [`[${timeP1.toFixed(2)}s] - ${p2.name} has been defeated!`, ...currentState])
        setFightLogMessages(currentState => [`${p1.name} wins!`, ...currentState])
        setFightOngoing(false)
      }
    }

    function player2Turn() {
      timeP2 += p2.cooldown

      const damageInflicted = p2.attack * (1 - (p1.defense / 100))

      const messageString = `[${timeP2.toFixed(2)}s] - [ ${p2.name} (${p2.hp.toFixed(0)}hp) ] hits [ ${p1.name} (${p1.hp.toFixed(0)}hp) ] for [${p2.attack}-${p1.defense}% = ${damageInflicted.toFixed(2)}] damage!`

      setFightLogMessages(currentState => [messageString, ...currentState])

      p1.hp -= damageInflicted

      if (p1.hp <= 0) {
        clearInterval(intervalPlayer1)
        clearInterval(intervalPlayer2)
        setFightLogMessages(currentState => [`[${timeP2.toFixed(2)}s] - ${p1.name} has been defeated!`, ...currentState])
        setFightLogMessages(currentState => [`${p2.name} wins!`, ...currentState])
        setFightOngoing(false)
      }
    }
  }

  return (
    <div className="App" >
      <Toaster message={toasterMessage} show={showToaster} setShow={setShowToaster} />

      <Header />

      <div className="App-cardZone">

        <FighterCard
          player={player1}
          playerNo="1"
          updateParentPlayer={setPlayer1}
          setFightLogMessages={setFightLogMessages}
          setShowToaster={setShowToaster}
          setToasterMessage={setToasterMessage}
        />

        <FighterCard
          player={player2}
          playerNo="2"
          updateParentPlayer={setPlayer2}
          setFightLogMessages={setFightLogMessages}
          setShowToaster={setShowToaster}
          setToasterMessage={setToasterMessage}
        />

      </div>

      <div>
        <Button onClick={() => fight(player1, player2)} disabled={fightOngoing} variant="danger" size="lg" style={{ color: "black", "fontWeight": "bold" }}>
          FIGHT {' '}
          {fightOngoing &&
            <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true">
              <span className="visually-hidden">Loading...</span>
            </Spinner>}
        </Button>
      </div>

      <div>
        <FightLog messages={fightLogMessages} clearLog={() => setFightLogMessages([])} />
      </div>

      <div>
        <Footer />
      </div>
    </div >
  );
}

export default App;
