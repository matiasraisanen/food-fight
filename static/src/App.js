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
    "damage": 5.6,
    "defense": 0.63,
    "fat": 0,
    "wait": 3,
    "aps": 0.16,
    "dps": 0.871,
    "selected": true
  });
  const [player2, setPlayer2] = useState({
    "name": "PAPRIKA",
    "hp": 30,
    "damage": 5.1,
    "defense": 0.94,
    "fat": 0,
    "wait": 7,
    "aps": 0.16,
    "dps": 0.817,
    "selected": true
  });

  // Initialize fight log
  const [fightLogMessages, setFightLogMessages] = useState([
    "--------------------------",
    "Welcome to food fight!",
    'Press "CHANGE" to change fighters',
    'Press "FIGHT" to begin',
    'Hover over a stat to get its description',
  ]);

  // Used for disabling buttons during fight
  const [fightOngoing, setFightOngoing] = useState(false);

  // fightSpeedMultiplier determines how fast the fights are carried out compared to real time. Defaults to 100x
  const [fightSpeedMultiplier, setFightSpeedMultiplier] = useState(100);

  // Used for displaying error messages
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");

  // Fight logic
  const fight = (player1, player2) => {
    setFightOngoing(true);
    let p1 = Object.assign({}, player1);
    let p2 = Object.assign({}, player2);
    p1.timer = 0;
    p2.timer = 0;
    let messageString = `[0.00s] - Fight between ${p1.name} and ${p2.name} has begun!`

    setFightLogMessages(currentState => [messageString, ...currentState,])

    function playerTurn(attacker, defender) {
      const gameSeparator = "===========================>"
      attacker.timer += attacker.wait

      const damageInflicted = attacker.damage * (1 - (defender.defense / 100))

      const messageString = `[${attacker.timer.toFixed(2)}s] - [ ${attacker.name} (${attacker.hp.toFixed(0)}hp) ] hits [ ${defender.name} (${defender.hp.toFixed(0)}hp) ] for [${attacker.damage}-${defender.defense}% = ${damageInflicted.toFixed(2)}] damage!`

      setFightLogMessages(currentState => [messageString, ...currentState])

      defender.hp -= damageInflicted

      if (defender.hp <= 0) {
        clearInterval(intervalPlayer1)
        clearInterval(intervalPlayer2)
        setFightLogMessages(currentState => [`[${attacker.timer.toFixed(2)}s] - ${defender.name} has been defeated!`, ...currentState])
        setFightLogMessages(currentState => [ gameSeparator, `${attacker.name} wins!`, ...currentState])
        setFightOngoing(false)
      }
    }

    const intervalPlayer1 = setInterval( () => playerTurn(p1, p2), p1.wait * (1000 / fightSpeedMultiplier));
    const intervalPlayer2 = setInterval( () => playerTurn(p2, p1), p2.wait * (1000 / fightSpeedMultiplier));

    // TODO: Add a way to stop the fight if it goes on for too long.
            // msg: "Fight stopped. The crowd got bored of watching..."

    // TODO: Add a way to change fight speed from UI
                          // speed["1x", "10x", "100x", "1000x"]

  }

  return (
    <div className="App" >
      <Header />
      
      <Toaster message={toasterMessage} show={showToaster} setShow={setShowToaster} />
      
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
        <Button 
        onClick={() => fight(player1, player2)} 
        disabled={fightOngoing || !player1.selected || !player2.selected} 
        variant="danger" 
        size="lg" 
        style={{ color: "black", "fontWeight": "bold" }}
        >
          FIGHT {' '}
          {fightOngoing &&
            <Spinner 
              as="span" 
              size="sm" 
              animation="border" 
              role="status" 
              aria-hidden="true" />
          }
        </Button>
      </div>

      <div>
        <FightLog messages={fightLogMessages} clearLog={() => setFightLogMessages([])} />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
