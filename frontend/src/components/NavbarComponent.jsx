import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import { Nav, Button, Dropdown } from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useOutletContext} from "react-router-dom";
import {userLogout} from '../utilities/LoginPageUtils'
import ManageAccount from "./ManageAccount";


export const NavbarComponent = ({user, setUser}) => {

  const handleLogout = async () => {
    setUser(false);
    const worked = await userLogout();
    if (worked==true) {
      navigate("/");
      
    }
  };

  const navigate = useNavigate();
  const context = useOutletContext()
  const [isOpen,setIsOpen] = useState(false)


  return (<>
    <Navbar className="bg-[#091A55] rounded-b-2xl">
    <Container className="relative">
 
    <img src="Logo.png" className="w-[55px] absolute bottom-1 -left-[10vh]" /> 
 
      <Navbar.Brand as={Link} to="/" className="text-white">City Scope</Navbar.Brand>
      <Nav className="me-auto">

        
        {user?
        (
          <>
        <Nav.Link as={Link} to="/trips" className="text-white">Trips</Nav.Link>
        {/* <Nav.Link as={Link} to="/explore">Explore</Nav.Link> */}
        </>
        ):""}
      </Nav>
<div className="relative">
      <Dropdown className="w-48 absolute -bottom-3">
        <Dropdown.Toggle
          variant="link"
          className="text-gray-900 no-underline shadow-none"
        >

<div className="flex flex-col items-center w-[150px] !p-0 !m-0">
  {/* <img src="Logo.png" className="w-[45px]" /> */}
  <div className="text-white text-center font-mono no-underline">
    {user ? (
      <span className="inline-block w-[150px]">
        | {user.username.length > 11 
            ? user.username.substring(0, 11) 
            : user.username.padEnd(11, " ")} |
      </span>
    ) : (
      <Link to="/login" className="text-white text-decoration-none inline-block w-[130px]">
        |&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;|
      </Link>
    )}
  </div>
</div>
        </Dropdown.Toggle>
{user?
(
        <Dropdown.Menu>

            <Dropdown.Item onClick ={ (() => {
              setIsOpen(true)
              
            })}
            
            >
              Manage Account
            </Dropdown.Item>


          <Dropdown.Item><Button variant="outline-danger"
          onClick={() => {
            handleLogout()
          }
          }
            >
                {`Log Out\n${user.username}`}
              </Button></Dropdown.Item>

        </Dropdown.Menu>):""
}
      </Dropdown>
      </div>

    </Container>

  </Navbar>
      <ManageAccount
      user = {user}
      isOpen = {isOpen}
      setIsOpen = {setIsOpen}
      />
      </>
  );
};