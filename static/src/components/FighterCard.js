import { Card, Table } from 'react-bootstrap';
import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function FighterCard({ name, energy, carbs, protein, fat, cooldown, playerNo }) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const player = {
    name: name,
    energy: energy === "" ? 0 : parseInt(energy),
    carbs: carbs === "" ? 0 : parseInt(carbs).toPrecision(2),
    protein: protein === "" ? 0 : `${parseInt(protein).toPrecision(3)}%`,
    fat: fat === "" ? 0 : parseInt(fat),
    cooldown: cooldown === "" ? 0 : parseInt(cooldown),
    speed: cooldown === "" ? 0 : parseFloat(1 / cooldown).toPrecision(2),
    dps: carbs === "" ? 0 : (carbs / cooldown).toFixed(3)
  }

  return (
    <div ref={ref} style={{ padding: '5vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={`./images/p${playerNo}.png`} />
        <Card.Header as="h5">{name.toUpperCase()}</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td>HP</td>
                <td>{player.energy}</td>
              </tr>
              <tr>
                <td>DMG</td>
                <td>{player.carbs}</td>
              </tr>
              <tr>
                <td>DEF</td>
                <td>{player.protein}</td>
              </tr>
              <tr>
                <td>SPEED</td>
                <td>{player.speed}</td>
              </tr>
              <tr>
                <td>DPS</td>
                <td>{player.dps}</td>
              </tr>
            </tbody>
          </Table>

          <Button onClick={handleClick} variant="secondary" type="submit" className="mb-2">
            CHANGE
          </Button>


        </Card.Body>
      </Card>
    </div>
  );
}
