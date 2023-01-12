import React from 'react'
import {Container, Nav, Navbar as Navbarbs, NavItem} from 'react-bootstrap'
import {NavLink} from "react-router-dom"
import { useAuth } from 'oidc-react';
import { useNavigate } from 'react-router-dom';

import "./NavBar.css"

const NavBar = () => {
    const auth = useAuth();
    let navigate = useNavigate();

    const LoggedIn = () => {
        console.log(auth)
        if (auth && auth.userData) {
          return (
            <div>
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
                <Nav className='ml-auto'>
                    <Nav.Link to="/" as={NavLink}>
                        <h1><p style={{color:"white"}}>Classee Cloud</p></h1>
                    </Nav.Link>

                    <NavItem to="/" as={NavLink}>
                        <LoggedIn />    
                    </NavItem>
                </Nav>
            </Container>
        </Navbarbs>
    )
}

export default NavBar;