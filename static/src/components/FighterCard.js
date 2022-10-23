import { Card, Table, Button } from 'react-bootstrap';

export default function FighterCard({ name, realName, energy, carbs, protein, fat, cooldown, image }) {

  return (
    <div style={{ padding: '5vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={image} />
        <Card.Header as="h5">{name.toUpperCase()}</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td>HP</td>
                <td>{parseInt(energy)}</td>
              </tr>
              <tr>
                <td>DMG</td>
                <td>{parseFloat(carbs).toPrecision(2)}</td>
              </tr>
              <tr>
                <td>DEF</td>
                <td>{parseFloat(protein).toPrecision(3)}%</td>
              </tr>
              <tr>
                <td>SPEED</td>
                <td>{parseFloat(1 / cooldown).toPrecision(2)}</td>
              </tr>
              <tr>
                <td>DPS</td>
                <td>{(carbs / cooldown).toFixed(3)}</td>
              </tr>
            </tbody>
          </Table>

          <Button variant="primary" type="submit" className="mb-2">
            CHANGE FIGHTER
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
