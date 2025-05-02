import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export const NavbarComponent = ({user}) => {
  const context = useOutletContext()
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container>
      <Navbar.Brand as={Link} to="/">City Scope</Navbar.Brand>
      <Nav className="me-auto">
      {user == false? (<Nav.Link as={Link} to="/login">| Login |</Nav.Link>):""}
        <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
        <Nav.Link as={Link} to="/trips">Trips</Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  );
};