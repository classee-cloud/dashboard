import React, { useState, useEffect } from "react"
import { Container, Select, Card,  CardBody, 
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
    Divider,
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
import ComputeServiceForm from "./ComputeServiceForm";
import { useDashboardController } from "../../classes/DashboardController";
import { Octokit } from "octokit";


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

interface Orgs {
    id: string;
    name: string;
    url: string;
}

interface ComputeService {
    id: string;
    name: string;
}

  
export default function AddRepo() {
    // UseState
    const dashboardController = useDashboardController();
    const [selectValue, setSelectValue] = useState<string>("");
    const [octo, setOcto] = useState<Octokit>(dashboardController.octokit);

    const [allRepositories, setAllRepositories] = useState<Array<RepoTable>>([]);
    const [Organizations, setOrganizations] = useState<Array<Orgs>>([]);
    const [ComputeServices, setComputeServices] = useState<Array<ComputeService>>([]);


    

    useEffect(() => {
        const octokit = dashboardController.octokit;
        setOcto(octokit);

        var js:Array<Orgs> = [];
        octokit.request('GET /user').then(({data})=>{
            js.push({id:data.id.toString(), name:data.login, url:''});
        })
        
        octokit.request('GET /organizations')
            .then(({ data }) => {
                data.map((e) => {
                    js.push({id:e.id.toString(), name:e.login, url:e.url});
                })
            setOrganizations(js);
        });      
        
        setSelectValue("");
      }, [dashboardController]);


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
                <Select placeholder='Select Compute Service'  onChange={handleComputeSelect}>
                    {ComputeServices.map((e) => <option id={e.id} key={e.id} value={e.id}>{e.name}</option>)}
                </Select>
                
            </div>
        )
    }


    ///////////////////////////////////////////////////////////////////////
    //Helpers
    const handleSearch = (() => {
        console.log("search");
    });

    const handleSelect = async (e:any) => {
        if (e.target.value== ""){
            setSelectValue("");
            setAllRepositories([]);    
            setComputeServices([]);
        }
        else{
            const name =  Organizations.filter(v => v.id == e.target.value)[0].name;
            const response = await fetch(`http://localhost:8181/repodetails/${name}`);
            const json = await response.json();
            setSelectValue(name);
            setAllRepositories(json);

            const requestOptions = {
                method: "GET",
            };
            const responseCompute = await fetch(`http://localhost:5001/api/computer-service/${name}/`, requestOptions);
            const jsonCompute = await responseCompute.json();
            var js:Array<ComputeService> = []
            jsonCompute.map((e:any) => {
                js.push({id:e.id, name:e.service_name});
            })
            setComputeServices(js);
        }

    }

    const handleComputeSelect = (e:any) => {
        console.log("select");
    }

    const admin_id = 1;
    console.log(selectValue);
    ///////////////////////////////////////////////////////////////////////

    
    return(
        <div> 
            <Container>
                <Card maxW="md">
                    <CardBody>
                        <FormControl>
                            <FormLabel>Organization</FormLabel>
                            <Select placeholder='Select Organization'  onChange={handleSelect}>
                                {Organizations.map((e) => <option id={e.id} key={e.id} value={e.id}>{e.name}</option>)}
                            </Select>
                            <br/>
                            <br/>
                            <TableData/>
                        </FormControl>
                    </CardBody>
                    <Divider />
                    <CardBody>
                        {selectValue.length > 0 && <ComputeServiceForm admin_id={admin_id} login_name={selectValue} ComputeServices={ComputeServices} /> }
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
  }