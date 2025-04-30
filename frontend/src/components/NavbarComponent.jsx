import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
export const NavbarComponent = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container>
      <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      <Nav className="me-auto">
      <Nav.Link as={Link} to="/login">| Login |</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>

        <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
        <Nav.Link as={Link} to="/trips">Trips</Nav.Link>

      </Nav>
    </Container>
  </Navbar>
  );
};