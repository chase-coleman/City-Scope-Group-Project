import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

export const NavComponent = () => {

  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container>
      <Link to="/home">City Scope</Link>
      <Nav className="me-auto">
        <Link to="/explore">Explore</Link>
        <Link to="/trips">Trips</Link>
      </Nav>
    </Container>
  </Navbar>
  );
};
