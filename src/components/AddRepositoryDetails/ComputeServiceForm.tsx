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
    ModalFooter,
    ModalBody,
    ModalCloseButton, 
    useDisclosure,
    FormHelperText,
    FormErrorMessage,
    Text
} from '@chakra-ui/react'


export default function ComputeServiceForm({admin_id, login_name, ComputeServices}:any) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [error, setError] = useState<boolean>(true);
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
        console.log(serviceName, email, password, admin_id, login_name);
        // check if email is valid
        if (validateEmail(email) && password != ""){
            // post to database
            setError(false);
            const requestOptions = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_name: serviceName,
                    email: email,
                    password: password,
                    admin_id: admin_id,
                    login_name: login_name
                })
            };
            const responseCompute = await fetch(`http://localhost:5001/api/computer-service`, requestOptions);
            console.log(responseCompute);
            onClose();
            
        }
        else{
            setError(true);
        }

    }

    const handleComputeSelect = (e:any) => {
        console.log("select");
    }

    const SelectComputeEntries = () => {
        return (
            <div>
                <Select placeholder='Select Compute Service'  onChange={handleComputeSelect}>
                    {ComputeServices.map((e:any) => <option id={e.id} key={e.id} value={e.id}>{e.name}</option>)}
                </Select>
            </div>
        )
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
                            {error && <Text color='tomato'>Email ID format is wrong!</Text>}

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
                <SelectComputeEntries/>
            </Container>
        </div>
    );
}
