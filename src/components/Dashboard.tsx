import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react"
import { Container } from 'react-bootstrap';
import { TableContainer, Button,Table, Thead, Tr, Th, Td, Tbody, Link, Checkbox, Tab } from '@chakra-ui/react';
//import { GitData } from "./GitData";

interface TableItems {
    id : string
    name: string;
    link: string;
  }



export default function Dashboard() {
    const GitData = [
        {
            id: "1",
            name:"Repo 1",
            link:"Link 1"
        },
        {
            id: "2",
            name:"Repo 2",
            link:"Link 2"
        },
        {
            id: "3",
            name:"Repo 3",
            link:"Link 3"
        },
        {
            id: "4",
            name:"Repo 4",
            link:"Link 4"
        }
    ];

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isCheck, setIsCheck] = useState<Array<string>>([]);
    const [list, setList] = useState<Array<TableItems>>(GitData);
    
    useEffect(() => {
        setList(list);
      }, [list]);

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
    }

    console.log(isCheck);
      
    const TableEntries = ({name, link, id}:TableItems) => {
        return (
            <Tr>
                <Td><Checkbox colorScheme='blue' key={id} id={id} isChecked={isCheck.includes(id)} onChange={handleClick}></Checkbox></Td>
                <Td>{name}</Td>
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
            <h2> Github Repositories </h2>
            <br/>

            <TableContainer>
            <Table variant='simple'>
                <Thead>
                <Tr>
                    <Th>
                        <Checkbox colorScheme='blue' isChecked={isCheckAll} onChange={handleSelectAll}/> &nbsp; &nbsp;
                        Select All     
                    </Th>
                    <Th>Repository Name</Th>
                    <Th>Link</Th>
                </Tr>
                </Thead>

                <Tbody>
                {list.map((e) => (
                    <TableEntries name={e.name} link={e.link} id={e.id}/>
                ))}

                </Tbody>
            </Table>
            </TableContainer>

            <Button colorScheme='blue'>Trigger CI</Button>
        </Container>        
        </div>
    );

    };
