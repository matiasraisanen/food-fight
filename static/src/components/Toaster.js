import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useState } from "react";

export default function Toaster({ message, show, setShow }) {
  // const [show, setShow] = useState(true);
  return (

    <ToastContainer className="p-3" position='top-center'>
      <Toast
        show={show}
        bg='danger'
        delay={3000}
        autohide
        onClose={() => setShow(false)}
      >
        <Toast.Header closeButton={true}>
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>
          <Alert key='alert' variant='danger'>
            {message}
          </Alert>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
