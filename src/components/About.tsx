import React from "react";
import { Container } from "react-bootstrap";
import NavigationComponents from "./NavigationComponents";

function About() {
    return (
    <>
        <NavigationComponents />
        <div style={{marginLeft:200, color:"blue"}}> 
            <Container>
                About page
            </Container>
        </div>
    </>
    );

}

export default About;