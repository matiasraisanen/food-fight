import { Card, Button } from 'react-bootstrap';


export default function FightLog(props) {

  const messages = props.messages
  const messageList = messages.map((message, index) => {
    return (
      <Card.Text
        className="fightLogMessage"
        key={index}>
        {message}
      </Card.Text >
    )
  })

  return (
    <Card bg="dark" className="fightLog">
      <Card.Header style={{
        "backgroundColor": "#9b3cfa", color: "black",
        "fontWeight": "bold", width: "100%"
      }}>Fight log

      </Card.Header>
      <Card.Body data-testid="logMessages">
        {messageList}
        <Button
          className="clearButton"
          size="sm"
          variant="outline-secondary"
          onClick={() => props.clearLog()}
          data-testid="clearButton"
        >
          clear
        </Button>
      </Card.Body>
    </Card>
  )
}