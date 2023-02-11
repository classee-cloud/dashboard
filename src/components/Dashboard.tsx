/* eslint-disable */

import React, { useState, useEffect, ChangeEvent } from "react"
import { Container } from 'react-bootstrap';

import { TableContainer, Button,Table, Thead, Tr, Th, Td, Tbody, Link, Checkbox, Tab } from '@chakra-ui/react';
import {OidcUserStatus, useOidcUser} from '@axa-fr/react-oidc';
//import { GitData } from "./GitData";

interface TableItems {
    id : string
    name: string;
    link: string;
  }



export default function Dashboard() {
    
    const serverDB = "http://localhost:5001";
    const serviceGithub = "http://localhost:8181";

    const [GitData, setGitData] = useState<Array<TableItems>>([]);
    const [Tokens, setTokens] = useState<object>();
    const {oidcUser, oidcUserLoadingState} = useOidcUser();

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isCheck, setIsCheck] = useState<Array<string>>([]);
    const [list, setList] = useState<Array<TableItems>>(GitData);

    // initialize token to server
    // get the access token and refresh token. use state to store
    // store refresh in cookies
    const tokens = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: oidcUser.email,
                                    name: oidcUser.name,
                                    sub: oidcUser.sub})
            };

        const response = await fetch(serverDB+`/api/login`, requestOptions);
        const json = await response.json();
        //console.log(json);
        console.log("Token fetched");
        setTokens(json);
    }
    
    const userData = async () => {
        console.log("Fetching user data")
        console.log("Token", Tokens);

        const loginName = oidcUser.preferred_username;

        const requestOptions = {
            method: 'GET',
        };
        const response = await fetch(serviceGithub+`/repodetails/${loginName}/${JSON.stringify(Tokens)}`, requestOptions);
        const json = await response.json();
        console.log(json);
        console.log("User Github Data fetched");
        setGitData(json);
    }


    useEffect(() => {
        // fetch token
        if (oidcUserLoadingState == OidcUserStatus.Loaded){
            tokens();
        }
        //setList(list);
      }, [oidcUserLoadingState]);

      

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
          
        case OidcUserStatus.Loaded:

            console.log(GitData);
            if  (Tokens != undefined && (GitData === undefined || GitData.length == 0)){
                //fetch user data
                userData();
            }
            
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
                            <TableEntries name={e.name} key={e.id} link={e.link} id={e.id}/>
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
