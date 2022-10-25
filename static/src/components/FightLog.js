import { Card } from 'react-bootstrap';


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
      }}>Fight log</Card.Header>
      <Card.Body>
        {messageList}
      </Card.Body>
    </Card>
  )
}