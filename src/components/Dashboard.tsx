import React, { useState, useEffect, ChangeEvent } from "react"
import { Container } from 'react-bootstrap';

import { TableContainer, Button,Table, Thead, Tr, Th, Td, Tbody, Link, Checkbox, Tab } from '@chakra-ui/react';
import { useDragControls } from "framer-motion";
import { useActionData } from "react-router-dom";
import {OidcUserStatus, useOidcUser} from '@axa-fr/react-oidc';
//import { GitData } from "./GitData";

interface TableItems {
    id : string
    name: string;
    link: string;
  }

export default function Dashboard() {
    
    const [GitData, setGitData] = useState<Array<TableItems>>([]);
    const {oidcUser, oidcUserLoadingState} = useOidcUser();

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isCheck, setIsCheck] = useState<Array<string>>([]);
    const [list, setList] = useState<Array<TableItems>>(GitData);

    // get this from outh - 
    const loginName:string = "classee-cloud";

    const userData = async (loginName:string) => {
        const response = await fetch(`http://localhost:8181/repodetails/${loginName}`);
        const json = await response.json();
        console.log(json);
        setGitData(json);
    }

    useEffect(() => {
        userData(loginName);
        //setList(list);
      }, []);

    /*
    const handleSelectAll = (e:ChangeEvent<HTMLInputElement>) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map(li => li.id));
        if (isCheckAll) {
          setIsCheck([]);
        }
      };
    
    const handleClick = (e:ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    } */
      
    const TableEntries = ({name, link, id}:TableItems) => {
        return (
            <Tr>
                <Td><Checkbox colorScheme='blue' key={id} id={id}></Checkbox> {name}</Td>
                <Td>
                    <Link href={link} >
                        {link}
                    </Link>
                </Td>
            </Tr>
        );
    }

    switch (oidcUserLoadingState) {
        case OidcUserStatus.Loading:
          return (
            <div style={{color:"blue"}}> 
                <Container>
                    <p>User Information are loading</p>;
                </Container>
            </div>
          )
        case OidcUserStatus.Unauthenticated:
          return (
            <div style={{color:"blue"}}> 
                <Container>
                    <p>you are not authenticated</p>;
                </Container>
            </div>
          )
        case OidcUserStatus.LoadingError:
          return (
            <div style={{color:"blue"}}> 
                <Container>
                    <p>Fail to load user information</p>;
                </Container>
            </div>
          )
        default:
            return (
                <div style={{color:"blue"}}> 
                <Container>
                    {JSON.stringify(oidcUser)}
                    <h2> Github Repositories </h2>
                    <br/>
        
                    <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr>
                            <Th><Checkbox colorScheme='blue'/> &nbsp; &nbsp; 
                            Repository Name</Th>
                            <Th>Link</Th>
                        </Tr>
                        </Thead>
        
                        <Tbody>
                        {GitData.map((e) => (
                            <TableEntries name={e.name} link={e.link} id={e.id}/>
                        ))}
        
                        </Tbody>
                    </Table>
                    </TableContainer>
        
                    <Button colorScheme='blue'>Trigger CI</Button>
                </Container>        
                </div>
            );
      }
    

    };
