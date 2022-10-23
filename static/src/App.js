import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FighterCard from './components/FighterCard.js';
import FightLog from './components/FightLog';
import { Button } from 'react-bootstrap';

import SearchForm from './components/SearchForm.js';
// import { Card, Table } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <div className="Title"><h1>FOOD FIGHT</h1></div>

      <div className="App-cardZone">
        <FighterCard name="omena" realName="Omena, ulkomainen, kuorineen" energy="38.852571462547175" carbs="8.19540006637573" protein="0.165299997925758 " fat="100" cooldown="8.447700065597887" image="./images/p1.png" />
        <FighterCard name="makkara" realName="Raakamakkara, siskonmakkara" energy="212.05504207491708" carbs="0.907999961197376" protein="10.0061154522777" fat="16.7246096517605" cooldown="27.638725065235576" player="2" image="./images/p2.png" />
      </div>


      <div>
        <Button variant="danger" size="lg" style={{ color: "black", "font-weight": "bold" }}>FIGHT</Button>
      </div>

      <div>
        <FightLog />
      </div>
    </div>
  );
}

export default App;
