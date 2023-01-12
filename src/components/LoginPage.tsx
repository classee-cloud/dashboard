import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';


import "./LoginPage.css"
import { useFormAction, useNavigate} from 'react-router-dom';
import NavBar from './NavBar';


const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    let navigate = useNavigate();

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        console.log(email, password);
        setEmail("");
        setPassword("");
        navigate("/");
        window.location.reload();
    }

    /*
    <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
    */

    return (
        <>
        <NavBar/>
        <Container className="loginpage-container">
            <br/>
            <Form className="sign-in-form" onSubmit={handleSubmit}>
                <label>This is landing page of the webiste.</label> 
                <Button variant="primary" type="submit">
                    Click to Login
                </Button>
            </Form>
        </Container>
        </>
    )
}

export default LoginPage;