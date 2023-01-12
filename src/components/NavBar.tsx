import React from 'react'
import {Container, Nav, Navbar as Navbarbs, NavItem} from 'react-bootstrap'
import {NavLink} from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';

import "./NavBar.css"

const NavBar = () => {
    const auth = useAuth();
    let navigate = useNavigate();

    const LoggedIn = () => {
        console.log(auth)
        if (auth && auth.userData) {
            console.log(auth.userData)
          return (
            <div>
                Hi 
              <button 
              style={{float: 'right'}}
              onClick={() => {
                auth.signOut()
                navigate("/login")
              }}>Log out!</button>
            </div>
          );
        }
        else{
            return (
            <div>
            </div>
            );
        }
      };

    return (
        <Navbarbs className='shadow-sm navbar'>
            <Container>
                
                    <Nav.Link to="/" as={NavLink}>
                        <h1><p style={{color:"white"}}>Classee Cloud</p></h1>
                    </Nav.Link>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                        <NavItem to="/" as={NavLink}> <LoggedIn />  </NavItem>        
                        </Navbar.Text>
                    </Navbar.Collapse>
                    
                
            </Container>
        </Navbarbs>
    )
}

export default NavBar;