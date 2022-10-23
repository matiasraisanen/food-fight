import { Card } from 'react-bootstrap';


export default function FightLog() {
  return (
    <Card bg="dark" className="fightLog">
      <Card.Header style={{
        "background-color": "#00ff00", color: "black",
        "font-weight": "bold", width: "100%"
      }}>Fight log</Card.Header>
      <Card.Body>
        <p>
          [12.0s] - [omena] hits [makkara] for 8.000 damage!
          <br />
          [12.6s] - [makkara] hits [omena] for 12.000 damage!
        </p>
      </Card.Body>
    </Card>
  )
}