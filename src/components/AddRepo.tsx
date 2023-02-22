import React, { useState } from "react"
import { Container, Select, Card,  CardBody, 
    TableContainer,
    Button,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Link,
    Checkbox,
    Input,
    Divider
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'


interface SelectOptionEntry {
    id: string;
    name: string;
}

interface RepoTable {
    id: string;
    org: string;
    name: string;
    link: string;
}
  
export default function AddRepo() {

    let Organization:Array<SelectOptionEntry> = [
        { id: "1", name: "Org1" },
        { id: "2", name: "Org2" },
        { id: "3", name: "Org3" }
    ]

    let Repositories = [
        { id: "1", org:"Org1", link: "xyz", name:"repo name"},
        { id: "2", org:"Org1", link: "xyz", name:"repo name"},
        { id: "3", org:"Org2", link: "xyz", name:"repo name"},
        { id: "4", org:"Org3", link: "xyz", name:"repo name"}
    ]

    let ComputeService = [
        { id: "1", name:"Service name"},
        { id: "2", name:"Service name"},
        { id: "3", name:"Service name"},
        { id: "4", name:"Service name"}
    ]


    //
    const [selectValue, setSelectValue] = useState<string>("");
    const [allRepositories, setAllRepositories] = useState<Array<RepoTable>>([]);
    //


    ///////////////////////////////////////////////////////////////////////
    const TableEntries = ({ name, link, id, org }: RepoTable) => {
        return (
          <Tr>
            <Td>
              <Checkbox colorScheme="blue" key={id} id={id}></Checkbox> {name}
            </Td>
            <Td>
              <Link href={link}>{link}</Link>
            </Td>
          </Tr>
        );
      };

    const TableData = () => {
    return(
        <div>
            <FormLabel>
                Repositories 
                <Input id="search" float="right" height="9" width="50" type="text" onChange={handleSearch} />
            </FormLabel>
                <Table >
                    <Thead>
                        <Tr>
                            <Th>Repository Name</Th>
                            <Th>Link</Th>
                        </Tr>
                    </Thead>
                    
                    <Tbody>
                    {allRepositories.map((e) => (
                        <TableEntries
                        org={e.org}
                        name={e.name}
                        key={e.id}
                        link={e.link}
                        id={e.id}
                        />
                    ))}
                    </Tbody>
                </Table>
        </div>
    )
    }

    const SelectComputeEntries = () => {
        return (
            <div>
                <Button>Add New Compute Service</Button>
                <br/>
                <br/>
                <Select placeholder='Select Compute Service'  onChange={handleComputeSelect}>
                    {ComputeService.map((e) => <option id={e.id} key={e.id} value={e.id}>{e.name}</option>)}
                </Select>
                
            </div>
        )
    }

    ///////////////////////////////////////////////////////////////////////
    const handleSearch = (() => {
        console.log("search");
    });

    const handleSelect = (e:any) => {
        if (e.target.value== ""){
            setSelectValue("");
            setAllRepositories([]);    
        }
        else{
            const name =  Organization.filter(v => v.id == e.target.value)[0].name;
            setSelectValue(name);
            setAllRepositories(Repositories.filter(e=>e.org == name));
        }
    }

    const handleComputeSelect = (e:any) => {
        console.log("select");
    }
    
    return(
        <div> 
            <Container>
                <Card maxW="md">
                    <CardBody>
                        <FormControl>
                            <FormLabel>Organization</FormLabel>
                            <Select placeholder='Select Organization'  onChange={handleSelect}>
                                {Organization.map((e) => <option id={e.id} key={e.id} value={e.id}>{e.name}</option>)}
                            </Select>
                            <br/>
                            <br/>
                            <TableData/>
                        </FormControl>
                    </CardBody>
                    <Divider />
                    <CardBody>
                        <SelectComputeEntries/>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
  }