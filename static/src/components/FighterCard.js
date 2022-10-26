import { Card, Table } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

async function apiCall(foodName, callBack) {
  return fetch(`https://koodihaaste.matiasraisanen.com/api/food-into-stats?food=${foodName}`)
    .then((res) => res.json())
    .then((resJson) => {
      callBack()
      return resJson;
    });
}

function formatResponseData(data, userGivenName) {
  // Api returns name as it appears in Fineli. This can sometimes be unnecessarily long.
  // Let's just use the user given name instead.
  return {
    name: userGivenName.toUpperCase(),
    hp: parseInt(data.energy.toFixed(0)),
    attack: parseFloat(data.carbohydrate.toFixed(1)),
    defense: parseFloat(data.protein.toFixed(2)),
    fat: parseFloat(data.fat.toFixed(0)),
    cooldown: parseFloat(data.cooldown.toFixed(2)),
    speed: parseFloat((1 / data.cooldown).toFixed(2)),
    dps: parseFloat((data.carbohydrate / data.cooldown)).toFixed(3)
  }
}
export default function FighterCard({ player, playerNo, updateParentPlayer }) {
  const [internalPlayer, setInternalPlayer] = useState(player);

  const [buttonVariant, setButtonVariant] = useState("secondary");
  const [buttonText, setButtonText] = useState("CHANGE");
  const [isLoading, setIsLoading] = useState(false);
  const [nameDisabled, setNameDisabled] = useState(true);

  useEffect(() => {
    setInternalPlayer(internalPlayer)
    console.log("Set intP", internalPlayer)
    // updateParentPlayer(internalPlayer)
  }, [internalPlayer, updateParentPlayer]);

  const ref = useRef(null);

  const handleClick = async (event) => {

    if (buttonText === "CHANGE") {
      setInternalPlayer({
        ...internalPlayer,
        name: "",
      });
    }
    if (buttonText === "SAVE") {

      setIsLoading(true)
      // console.log("internalPlayer", internalPlayer);

      const apiResponse = await apiCall(internalPlayer.name, (() => { setIsLoading(false) }));

      if (apiResponse.statusCode !== 200) {
        alert(apiResponse.message)
        return;
      }

      console.log("apiResponseData", apiResponse.data);
      const newPlayer = formatResponseData(apiResponse.data, internalPlayer.name);
      console.log("New player", newPlayer);
      setInternalPlayer({
        name: newPlayer.name,
        hp: newPlayer.hp,
        attack: newPlayer.attack,
        defense: newPlayer.defense,
        fat: newPlayer.fat,
        cooldown: newPlayer.cooldown,
        speed: newPlayer.speed,
        dps: newPlayer.dps
      })
      // console.log("New internalPlayer", internalPlayer);
      updateParentPlayer(newPlayer);
    }
    setNameDisabled(!nameDisabled);
    setButtonVariant(buttonVariant === "secondary" ? "success" : "secondary");
    setButtonText(buttonText === "CHANGE" ? "SAVE" : "CHANGE");
  };



  return (
    <div ref={ref} style={{ padding: '5vh' }}>
      <Card style={{ width: '18rem' }}>

        <Card.Img variant="top" src={`./images/p${playerNo}.png`} />

        <Card.Header as="h5">
          <Form>
            <Form.Group
              className="mb-3"
              controlId={`formPlayer${playerNo}`}>
              <Form.Control
                className="text-center"
                plaintext={nameDisabled}
                readOnly={nameDisabled}
                onChange={(event) => {
                  setInternalPlayer({
                    ...internalPlayer,
                    name: event.target.value.toUpperCase(),
                  });
                }}
                value={internalPlayer.name.toUpperCase()}
              />
            </Form.Group>
          </Form>
        </Card.Header>

        <Card.Body>

          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td>HP</td>
                <td>{internalPlayer.hp}</td>
              </tr>
              <tr>
                <td>DMG</td>
                <td>{internalPlayer.attack}</td>
              </tr>
              <tr>
                <td>DEF</td>
                <td>{internalPlayer.defense}%</td>
              </tr>
              <tr>
                <td>SPEED</td>
                <td>{internalPlayer.speed}</td>
              </tr>
              <tr>
                <td>DPS</td>
                <td>{internalPlayer.dps}</td>
              </tr>
            </tbody>
          </Table>

          <Button disabled={isLoading} onClick={handleClick} variant={buttonVariant} type="submit">
            {buttonText} {' '}
            {isLoading &&
              <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true">
                <span className="visually-hidden">Loading...</span>
              </Spinner>}
          </Button>

        </Card.Body>
      </Card>

    </div>
  );
}
