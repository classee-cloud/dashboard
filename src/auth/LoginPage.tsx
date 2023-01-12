import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';


import "./LoginPage.css"
import { useFormAction, useNavigate} from 'react-router-dom';


const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    let navigate = useNavigate();

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        console.log(email, password);
        setEmail("");
        setPassword("");
        navigate("/auth");
    }

    return (
        <Container className="loginpage-container">
            <br/>
            <Form className="sign-in-form" onSubmit={handleSubmit}>
                <label>Login In</label>
                <br/>
                <br/>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default LoginPage;