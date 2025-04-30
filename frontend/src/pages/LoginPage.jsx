import React, { useEffect } from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Container, Row, Col, Tab, Tabs, FloatingLabel } from "react-bootstrap";
import { useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import {
  userLogin,
  confirmUser,
  userRegistration,
} from "../Utilities/LoginPageUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const {user, setUser } = useOutletContext();
  const [logError, setLogError] = useState("");
  const {user, setUser} = useOutletContext()
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLogError("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [logError]);

  return (
    <>
    {/* LOGIN */}
      <Container
        className="d-flex justify-content-center "
        style={{ minHeight: "100vh" }}
      >
        <Row className="w-100">
          <Col xs={12} sm={10} md={6} lg={4} className="mx-auto">
            <Tabs
              defaultActiveKey="login"
              className="mb-3 justify-content-center"
            >
              <Tab eventKey="login" title="Login">
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const login = await userLogin(username,password,setLogError);
                    if (login?.response == 200) {
                      setUser(await confirmUser())
                      navigate('/explore/');
                    }
                  }}
                >
                  <FloatingLabel
                    controlId="floating_login_email"
                    label="username"
                    className="mb-3"
                  >
                    <Form.Control
                      type="username"
                      placeholder="name@example.com"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingloginPassword"
                    label="Password"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FloatingLabel>
                  <Button variant="secondary" type="submit">
                    Log me in!
                  </Button>
                  <p style={{ color: "red" }}>{logError}</p>
                </Form>
              </Tab>
{/* ----------------------------------------------------------------------------- */}
              <Tab eventKey="register" title="Register">
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const login = await userRegistration(
                      email,
                      firstName,
                      lastName,
                      password,
                      setLogError
                    );
                    if (login?.response == 200) {
                      setUser(await confirmUser())
                      navigate('/explore/');
                    }
                  }}
                >
                  <FloatingLabel
                    controlId="floating_registration_firstName"
                    label="First Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Chungus"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floating_registration_lastName"
                    label="Last Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="McNugget"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floating_registration_email"
                    label="E-mail"
                    className="mb-3"
                  >
                    <Form.Control
                      type="e-mail"
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floating_registration_password"
                    label="Password"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FloatingLabel>
                  <Button variant="secondary" type="submit">
                    Register me!
                  </Button>
                  <p style={{ color: "red" }}>{logError}</p>
                </Form>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
