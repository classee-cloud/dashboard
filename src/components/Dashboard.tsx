import React from "react"
import { Container } from 'react-bootstrap';
import NavigationComponents from "./NavigationComponents";

function Dashboard() {
    return(
        <>
        <NavigationComponents />
        <div style={{marginLeft:200, color:"blue"}}> 
            <Container>
            Dashboard
            </Container>        
        </div>
        </>
    )
}

export default Dashboard;