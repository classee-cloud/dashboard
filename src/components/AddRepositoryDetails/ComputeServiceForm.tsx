import React, { useState } from "react"
import { Container,
    Button,
    Input,
    FormControl,
    FormLabel,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton, 
    useDisclosure,
    Text
} from '@chakra-ui/react'
import {useDashboardController, ComputeServiceDetails} from "../../classes/DashboardController";


export default function ComputeServiceForm({login_name}:any) {
    const dashboardController = useDashboardController();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [errorValue, setError] = useState<boolean>(true);
    const [serviceName, setServiceName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSelect = (e:any) => {
        setServiceName(e.target.value);
    }

    const handleEmail = (e:any) => {
        console.log(e.target.value);
        setEmail(e.target.value);
    }

    const handlePassword = (e:any) => {
        setPassword(e.target.value);
    }

    const validateEmail = (email:string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const handleSubmit = async () => {
        // check if email is valid
        if (validateEmail(email) && password != ""){
            setError(false);
            var data:ComputeServiceDetails = {
                service_name: serviceName,
                email: email,
                password: password,
                login_name: login_name,
            }
            dashboardController.addNewComputeService(data);
            onClose();
        }
        else{
            setError(true);
        }

    }

    return(
        <div> 
            <Container>
                <Button onClick={onOpen}>Add New Compute Service</Button>
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Cloud Service</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <FormControl>
                            <FormLabel>Cloud Service Name</FormLabel>

                            <Select placeholder='Select Cloud Service' onChange={handleSelect}>
                                <option value='AWS'>AWS</option>
                                <option value='Chameleon Cloud'>Chameleon Cloud</option>
                                <option value='Slurp'>Slurp</option>
                                <option value='Azure'>Azure</option>
                            </Select>

                            <FormLabel>Email</FormLabel>
                            <Input name="email" type='email' onChange={handleEmail} />
                            {errorValue && <Text color='tomato'>Email ID format is wrong!</Text>}

                            <FormLabel>Password</FormLabel>
                            <Input name="pswd" type='password' onChange={handlePassword}/>
                            {password=="" && <Text color='tomato'>Password cannot be empty!</Text>}
                            <br/>
                            <br/>
                            <Button colorScheme='blue' mr={3} type="submit" onClick={handleSubmit}> Add </Button>
                        </FormControl>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <br/>
                <br/>
            </Container>
        </div>
    );
}
