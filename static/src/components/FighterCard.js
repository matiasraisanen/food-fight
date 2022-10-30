import React, { useState, useRef, useEffect } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

const popover = (title, content) => (
  <Popover id="popover-basic">
    <Popover.Header as="h3">{title}</Popover.Header>
    <Popover.Body>
      <p>{content[0]}</p>
      <p><b>{content[1]}</b></p>
    </Popover.Body>
  </Popover>
);

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
    hp: parseInt(data.hp.toFixed(0)),
    damage: parseFloat(data.damage.toFixed(1)),
    defense: parseFloat(data.defense.toFixed(2)),
    wait: parseFloat(data.wait.toFixed(2)),
    aps: parseFloat(data.aps.toFixed(3)),
    dps: parseFloat(data.dps.toFixed(3)),
    selected: true
  }
}
export default function FighterCard({ player, playerNo, updateParentPlayer, setFightLogMessages, setShowToaster, setToasterMessage }) {
  const [internalPlayer, setInternalPlayer] = useState(player);

  const [buttonVariant, setButtonVariant] = useState("secondary");
  const [buttonText, setButtonText] = useState("CHANGE");
  const [isLoading, setIsLoading] = useState(false);
  const [nameDisabled, setNameDisabled] = useState(true);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    setInternalPlayer(internalPlayer)
  }, [internalPlayer]);

  const inputRef = useRef(null);

  const handleClick = async (event) => {
    event.preventDefault();

    if (buttonText === "CHANGE") {
      setBlinking(true)
      inputRef.current.focus()

      setInternalPlayer({
        ...internalPlayer,
        name: "",
      });

      updateParentPlayer({ ...internalPlayer, selected: false })
    }

    if (buttonText === "SAVE") {
      setBlinking(false)
      setIsLoading(true)
      // console.log("internalPlayer", internalPlayer);

      const apiResponse = await apiCall(internalPlayer.name, (() => { setIsLoading(false) }));

      if (apiResponse.statusCode !== 200) {
        setFightLogMessages(currentState => [`Failed to retrieve food: ${apiResponse.message}`, ...currentState])

        setToasterMessage(apiResponse.message)
        setShowToaster(true)
        return;
      }

      setFightLogMessages(currentState => [`Changed player ${playerNo} to [${internalPlayer.name}]. Found in database as [${apiResponse.data.originalName}]`, ...currentState])

      // console.log("apiResponseData", apiResponse.data);
      const newPlayer = formatResponseData(apiResponse.data, internalPlayer.name);
      // console.log("New player", newPlayer);
      setInternalPlayer({
        name: newPlayer.name,
        hp: newPlayer.hp,
        damage: newPlayer.damage,
        defense: newPlayer.defense,
        wait: newPlayer.wait,
        aps: newPlayer.aps,
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
    <div style={{ padding: '5vh' }}>
      <Card style={{ width: '18rem' }}>

        <Card.Img variant="top" src={`./images/p${playerNo}.png`} />

        <Card.Header as="h5">
          <Form onSubmit={handleClick}>
            <Form.Group
              className="mb-3"
              controlId={`formPlayer${playerNo} `}>
              <Form.Control
                className={`formControl${blinking ? " blinking" : ""} `}
                plaintext={nameDisabled}
                readOnly={nameDisabled}
                ref={inputRef}
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
                <OverlayTrigger
                  delay={{ show: 250 }}
                  placement="left"
                  overlay={popover("HP", ["Health points.", "kcal in 100g = HP"])}
                >
                  <td>HP</td>
                </OverlayTrigger>
                <td>{internalPlayer.hp}</td>
              </tr>

              <tr>
                <OverlayTrigger
                  delay={{ show: 250 }}
                  placement="left"
                  overlay={popover("DMG", ["Damage inflicted per strike.", "carbs in 100g = damage"])}
                >
                  <td>DMG</td>
                </OverlayTrigger>
                <td>{internalPlayer.damage}</td>
              </tr>

              <tr>
                <OverlayTrigger
                  delay={{ show: 250 }}
                  placement="left"
                  overlay={popover("DEF", ["Defense reduces damage from an incoming attack by a percentage.", "protein in 100g = defense%"])}
                >
                  <td>DEF</td>
                </OverlayTrigger>
                <td>{internalPlayer.defense}%</td>
              </tr>

              <tr>
                <OverlayTrigger
                  delay={{ show: 250 }}
                  placement="left"
                  overlay={popover("WAIT", ["Amount of seconds to wait between attacks.", "(carbs+protein+fat) in 100g = wait"])}
                >
                  <td>WAIT</td>
                </OverlayTrigger>
                <td>{internalPlayer.wait}s</td>
              </tr>

              <tr>
                <OverlayTrigger
                  delay={{ show: 250 }}
                  placement="left"
                  overlay={popover("APS", ["Attacks per second."])}
                >
                  <td>APS</td>
                </OverlayTrigger>
                <td>{internalPlayer.aps}</td>
              </tr>

              <tr>
                <OverlayTrigger
                  delay={{ show: 250 }}
                  placement="left"
                  overlay={popover("DPS", ["Average damage inflicted per second."])}
                >
                  <td>DPS</td>
                </OverlayTrigger>
                <td>{internalPlayer.dps}</td>
              </tr>

            </tbody>
          </Table>

          <Button
            disabled={isLoading}
            onClick={handleClick}
            variant={buttonVariant}
            data-testid="changeButton"
          >
            {buttonText} {' '}

            {
              isLoading &&
              <Spinner
                as="span"
                size="sm"
                animation="border"
                role="status"
                aria-hidden="true"
              />
            }

          </Button>

        </Card.Body>
      </Card>

    </div>
  );
}
