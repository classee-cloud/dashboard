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
    useDisclosure, 
} from '@chakra-ui/react'
import ComputeServiceForm from "./ComputeServiceForm";
import {useComputeServices, useDashboardController, useRepositoryDetails, RepoTable, Orgs } from "../../classes/DashboardController";


export default function AddRepo() {
    // Custom hooks
    const dashboardController = useDashboardController();
    const ComputeServices = useComputeServices();
    const allRepositories = useRepositoryDetails();

    // state definations
    // check box selected value
    const [selectValue, setSelectValue] = useState<string>(""); 
    
    // make sure only single check box is checked and others are disabled when one is selected
    const [singleChecked, setSingleChecked] = useState<boolean>(false);
    const [singleCheckedData, setSingleCheckedData] = useState<RepoTable>({"id": "", "name": "", "link": "", "org": ""});
    const [selectComputeService, setSelectComputeService] = useState<string>("");

    // if configure form has missing element, then set error
    const [configureError, setConfigureError] = useState<boolean>(true);

    // organisations under given user
    const [Organizations, setOrganizations] = useState<Array<Orgs>>([]);
    const [searchValue, setSearchValue] = useState("");
    const [submitClicked, setSubmitClicked] = useState(Boolean);
    var [records, setRecords] = useState<Array<RepoTable>>([]);
    
    // Compute Form
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLDivElement>(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const npage = Math.ceil(allRepositories.length / recordsPerPage);
    var numbers:Array<number> = [];
    for (var i=1; i<=npage; i++){
        numbers.push(i);
    }
    records = allRepositories.slice(firstIndex, lastIndex);
    
    useEffect(() => {
        // init the octokit instance for everytime dashboard controller changes
        const octokit = dashboardController.octokit;

        // get logged in user's data
        var js:Array<Orgs> = [];
        octokit.request('GET /user')
            .then(({data})=>{
            js.push({id:data.id.toString(), name:data.login, url:''});
        })
        
        // get organisations under user
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
        console.log(records);
      }, [dashboardController, submitClicked]);


    ///////////////////////////////////////////////////////////////////////
    // Components 
    // updates table entries
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

    // component for representing the table and pagination
    const TableData = ({records}:any) => {
    return(
        <div>
            <Table >
                <Thead>
                    <Tr>
                        <Th>Repository Name</Th>
                        <Th>Link</Th>
                    </Tr>
                </Thead>
                
                <Tbody>
                {records.map((e:any) => (
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

            <ul className="pagination">
                {numbers.length>0 && 
                    <li className="page-item">
                    <Link className="page-link" onClick={prePage}> Prev </Link>
                </li>}
                
                {numbers.map((e:number, i:number) => (
                    <li key={i} className={`page-item ${currentPage === e ? 'active' : ''}`}>
                        <Link className="page-link" onClick={() => changePage(e)}> 
                            {e}
                        </Link>
                    </li>
                ))}

                {numbers.length>0 && 
                <li>
                    <Link className="page-link" onClick={nextPage}> Next </Link>
                </li>
                }   
            </ul>
        </div>
    )
    }

    // Compoonent for selecting compute services
    const SelectComputeEntries = () => {
        return (
            <div>
                <Select placeholder='Select Compute Service'  onChange={handleComputeSelect}>
                    {ComputeServices.map((e:any) => <option id={e.id} key={e.id} value={e.name}>{e.name}</option>)}
                </Select>
            </div>
        )
    }

    // popup message for error message
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
    // handling table cheeckbox
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

    // handling search in table
    const handleSearch = ((e:any) => {
        setSearchValue(e.target.value)
    });

    // handle submit button to search for data
    const handleSearchSubmit = () => {
        var s = searchValue.toLowerCase();
        var temp = [];
        for (var index=0; index<allRepositories.length; index++){
            if(allRepositories[index].name.includes(s)){
                temp.push(allRepositories[index])
            }
        }
        setRecords(temp);
        setSubmitClicked(!submitClicked);
    }

    // handle selecting an org/user name and rendering repositories under it
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

    // handling compute service selection
    const handleComputeSelect = (e:any) => {
        //console.log(e.target);
        if (e.target.value== ""){
            setSelectComputeService("");
        }
        else{
            setSelectComputeService(e.target.value);
        }
    }

    // handle configuration of new repository and compute service along with it
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

    // handling pagination
    const prePage = () => {
        if (currentPage !== firstIndex){
            setCurrentPage(currentPage - 1)
        }
        else{
            setCurrentPage(currentPage)
        }
    }

    const changePage = (id:number) => {
        setCurrentPage(id)
    }

    const nextPage = () => {
        if (currentPage !== lastIndex){
            setCurrentPage(currentPage + 1)
        }
        else{
            setCurrentPage(currentPage)
        }
    }
    ///////////////////////////////////////////////////////////////////////

    return(
        <div> 
            <Container>
                <Card maxW="sm">
                    <CardBody>
                        <FormControl>
                            <FormLabel>Organization</FormLabel>
                            <Select placeholder='Select Organization'  onChange={handleSelect}>
                                {Organizations.map((e) => <option id={e.id} key={e.id} value={e.id}>{e.name}</option>)}
                            </Select>
                            <br/>
                            <br/>
                            <FormLabel>
                                Repositories 
                                <Input id="search" 
                                value={searchValue} 
                                name="search" 
                                float="right" 
                                height="9" 
                                width="50" 
                                type="text" 
                                onChange={handleSearch}/>
                                <Button type="submit" onClick={handleSearchSubmit}> Search </Button>
                            </FormLabel>
                            <TableData records={records}/>
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



  