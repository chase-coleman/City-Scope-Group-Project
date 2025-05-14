import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Nav, Button, Dropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { userLogout } from "../utilities/LoginPageUtils";
import ManageAccount from "./ManageAccount";

export const NavbarComponent = ({ user, setUser }) => {
  const handleLogout = async () => {
    setUser(false);
    const worked = await userLogout();
    if (worked == true) {
      navigate("/");
    }
  };

  const navigate = useNavigate();
  const context = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  if (user !==undefined && user !== false) {
    setIsLoading(false)
  }
},[user])

  return (
  
    <>
<Navbar className="bg-[#091A55] rounded-b-2xl h-[65px] px-4">
  <div className="flex items-center w-full">
    {/* Logo */}
    <div className="h-[65px]">
      <img
        src="/Logo.png"
        className="w-full h-full"
        alt="Logo"
      />
    </div>


    <div className="w-[150px]">
      <Navbar.Brand as={Link} to="/" className="text-white pl-[5px]">
        City Scope
      </Navbar.Brand>
    </div>

    <Nav className="pl-[5px] w-[150px]">
      {!isLoading && user && (
        <Nav.Link as={Link} to="/trips" className="text-white">
          Trips
        </Nav.Link>
      )}
    </Nav>

    <div className="ml-auto text-white pr-[75px]">
    <Dropdown className="w-[150px]">
              <Dropdown.Toggle
                variant="link"
                className="text-gray-900 no-underline shadow-none w-[150px]"
              >
                <div className="flex flex-col items-center w-full p-0 m-0">
                  <div className="text-white text-center font-mono no-underline">
                    {user ? (
                      <span className="inline-block w-[150px] overflow-x-hidden whitespace-nowrap">
                        
                        | {user.username && user.username.length > 11
                          ? user.username.substring(0, 11)
                          : user.username} |
                        
                      </span>
                    ) : (
                      <Link
                        to="/login"
                        className="text-white text-decoration-none inline-block w-[130px]"
                      >
                        |&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;|
                      </Link>
                    )}
                  </div>
                </div>
              </Dropdown.Toggle>

              {user && (
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    Manage Account
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      {`Log Out\n${user.username}`}
                    </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              )}
            </Dropdown>
    </div>
  </div>
</Navbar>
{user && <ManageAccount user={user} isOpen={isOpen} setIsOpen={setIsOpen} />}
     
  </>
  );
};
