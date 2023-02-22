import React, { useState } from "react"
import { Container,
    Button,
    Input,
    FormControl,
    FormLabel,
} from '@chakra-ui/react'


export default function ComputeServiceForm() {
    return(
        <div> 
            <Container>
                <FormControl>
                    <FormLabel>Cloud Service Name</FormLabel>

                    <FormLabel>Username</FormLabel>
                    <Input name="email" type='email' />

                    <FormLabel>Password</FormLabel>
                    <Input name="pswd" type='password' />

                    <Button type="submit"> Submit </Button>
                </FormControl>
            </Container>
        </div>
    );
}
