import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function SearchForm() {
  return (
    <div className="SearchForm">

      <Form className="SearchRow">
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
              CHOOSE-PLAYER-1
            </Form.Label>
            <Form.Control
              className="mb-2"
              id="inlineFormInput"
              placeholder="CHOOSE-PLAYER-1"
            />
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit" className="mb-2">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Form className="SearchRow">
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Label htmlFor="inlineFormInput" visuallyHidden>
              CHOOSE-PLAYER-2
            </Form.Label>
            <Form.Control
              className="mb-2"
              id="inlineFormInput"
              placeholder="CHOOSE-PLAYER-2"
            />
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit" className="mb-2">
              Search
            </Button>
          </Col>
        </Row>
      </Form>


    </div >
  );
}