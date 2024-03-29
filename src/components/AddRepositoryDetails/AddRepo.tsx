import React, { useState, useEffect, useRef } from "react"
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
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure
} from '@chakra-ui/react'
import ComputeServiceForm from "./ComputeServiceForm";
import {useComputeServices, useDashboardController, useRepositoryDetails, RepoTable, Orgs } from "../../classes/DashboardController";

  
export default function AddRepo() {
    // UseState
    const dashboardController = useDashboardController();
    const ComputeServices = useComputeServices();
    const allRepositories = useRepositoryDetails();

    const [selectValue, setSelectValue] = useState<string>("");
    const [singleChecked, setSingleChecked] = useState<boolean>(false);
    const [singleCheckedData, setSingleCheckedData] = useState<RepoTable>({"id": "", "name": "", "link": "", "org": ""});
    const [selectComputeService, setSelectComputeService] = useState<string>("");
    const [configureError, setConfigureError] = useState<boolean>(true);
    const [Organizations, setOrganizations] = useState<Array<Orgs>>([]);
    

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const octokit = dashboardController.octokit;

        var js:Array<Orgs> = [];
        octokit.request('GET /user')
            .then(({data})=>{
            js.push({id:data.id.toString(), name:data.login, url:''});
        })
        
        // user/orgs
        octokit.request('GET /user/orgs')
            .then(({ data }) => {
                //console.log(data);
                data.map((e) => {
                    js.push({id:e.id.toString(), name:e.login, url:e.url});
                })
            setOrganizations(js);
        });      
        
        setSelectValue("");
      }, [dashboardController]);


    ///////////////////////////////////////////////////////////////////////
    // Components
    const TableEntries = ({ name, link, id, org }: RepoTable) => {
        if (singleChecked==true && singleCheckedData.name == name){
            return (
                <Tr>
                  <Td>
                      <Checkbox colorScheme="blue" key={id} id={id} isChecked={singleChecked} onChange={() => handleCheckBox(id, name, link, org) }></Checkbox> {name}
                  </Td>
                  <Td>
                    <Link href={link}>{link}</Link>
                  </Td>
                </Tr>
              );    
        }
        else if(singleChecked==true && singleCheckedData.name!=name){
            return (
                <Tr>
                  <Td>
                      <Checkbox colorScheme="blue" key={id} id={id} disabled={true} onChange={() => handleCheckBox(id, name, link, org) }></Checkbox> {name}
                  </Td>
                  <Td>
                    <Link href={link}>{link}</Link>
                  </Td>
                </Tr>
              );
        }
        else{
            return (
                <Tr>
                  <Td>
                      <Checkbox colorScheme="blue" key={id} id={id} disabled={false} onChange={() => handleCheckBox(id, name, link, org) }></Checkbox> {name}
                  </Td>
                  <Td>
                    <Link href={link}>{link}</Link>
                  </Td>
                </Tr>
              );
        }
        
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
                    {ComputeServices.map((e:any) => <option id={e.id} key={e.id} value={e.name}>{e.name}</option>)}
                </Select>
            </div>
        )
    }

    const PopupMessage = () => {
        if (configureError == true){
            return(
                <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} motionPreset='slideInBottom' isCentered={true}>                    
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                One or many fields are empty. Please select repository and compute service again!
                            </AlertDialogHeader>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            );
        }
        else{
            return(
                <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} motionPreset='slideInBottom' isCentered={true}>                    
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Repository Successfully Configured!
                            </AlertDialogHeader>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            );
        }
    }

    ///////////////////////////////////////////////////////////////////////
    //Helpers
    const handleCheckBox = (id:string, name:string, link:string, org:string) => {
        if (singleChecked == false){
            const data = {
                "id": id,
                "name": name,
                "link": link,
                "org": org
            }    
            setSingleCheckedData(data);
        }
        else{
            setSingleCheckedData({"id": "", "name": "", "link": "", "org": ""});
        }
        setSingleChecked(!singleChecked);
            
    }

    const handleSearch = (() => {
        //console.log("search");
    });

    const handleSelect = async (e:any) => {
        if (e.target.value== ""){
            setSelectValue(""); 
            dashboardController.refreshRepositories("");
        }
        else{
            const name =  Organizations.filter(v => v.id == e.target.value)[0].name;
            setSelectValue(name);
            dashboardController.refreshRepositories(name);
            dashboardController.refreshComputeServices(name);
        }
    }

    const handleComputeSelect = (e:any) => {
        //console.log(e.target);
        if (e.target.value== ""){
            setSelectComputeService("");
        }
        else{
            setSelectComputeService(e.target.value);
        }
    }

    const handleConfigure = async () => {
        console.log("configure");
                
        if (singleCheckedData.name=="" || singleCheckedData.link=="" || singleCheckedData.org=="" || selectComputeService==""){
            //console.log("One or many fields are empty");
            setConfigureError(true);
            onOpen();
        }
        else{
            setConfigureError(false);
            dashboardController.configureComputeService(singleCheckedData, selectComputeService);
            setSelectComputeService("");
            setSingleChecked(false);
            onOpen();
        }   
    }

    const admin_id = 1;
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
                        {selectValue.length > 0 && <ComputeServiceForm login_name={selectValue} /> }
                        {selectValue.length>0 && <SelectComputeEntries/>}
                    </CardBody>
                    <CardBody>
                        {selectValue.length > 0 && <Button colorScheme='blue' mr={3} type="submit" onClick={handleConfigure}> Configure </Button> }
                    </CardBody>
                </Card>
                <PopupMessage/>
            </Container>
        </div>
    );
  }