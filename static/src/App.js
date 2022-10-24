import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FighterCard from "./components/FighterCard";
import FightLog from "./components/FightLog";
import Footer from "./components/Footer"
import { Button } from "react-bootstrap";
import { useState } from "react";
// import { Card, Table } from 'react-bootstrap';

// async function apiCall(foodName,) {
//   return fetch(`https://koodihaaste.matiasraisanen.com/api/food-into-stats?food=${foodName}`)
//     .then((res) => res.json())
//     .then((resJson) => {
//       console.log(resJson)
//       return resJson;
//     });
// }

function App() {
  const [nameDisabled, setNameDisabled] = useState(true);
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
        <Button variant="danger" size="lg" style={{ color: "black", "fontWeight": "bold" }}>
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
