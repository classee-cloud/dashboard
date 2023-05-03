/* eslint-disable */

import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {
  TableContainer,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Link, 
} from "@chakra-ui/react";
import { Octokit } from "octokit";
import { useDashboardController, useConfiguredRepositoryDetails ,TableItems } from "../classes/DashboardController";
import {useNavigate} from 'react-router-dom';
import { Spinner } from '@chakra-ui/react'


export default function Dashboard() {
  const dashboardController = useDashboardController();
  const navigate = useNavigate();
  const GitData = useConfiguredRepositoryDetails();
  const [loading, setLoading] = useState(false)


  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = GitData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(GitData.length / recordsPerPage);
  var numbers:Array<number> = [];
  for (var i=1; i<=npage; i++){
      numbers.push(i);
  }

  useEffect(() => {
    //const refreshConfiguredRepositories = () => 
    console.log(dashboardController);
    const octokit = dashboardController.octokit;
    dashboardController.refreshConfiguredRepositories();
    //setTimeout(() => setLoading(false), 100)

    /*
    if (GitData.length==0){
      octokit.request('GET /user')
          .then( async ({data})=>{
            dashboardController.refreshConfiguredRepositories(data.login);
      })
      
      // user/orgs
      octokit.request('GET /user/orgs')
          .then(({ data }) => {
              data.map(async (e) => {
                dashboardController.refreshConfiguredRepositories(e.login);
              })
      });      
    }
    */
    
  }, [dashboardController]);


  
  const TableEntries = ({ name, link, id, login, service, status}: TableItems) => {
    return (
      <Tr>
        <Td>
          {status} 
        </Td>
        <Td>
          {name}
        </Td>
        <Td>
          <Link href={link}>{link}</Link>
        </Td>
        <Td>
          {login}
        </Td>
        <Td>
          {service}
        </Td>
      </Tr>
    );
  };

  const navigateHome = () => {
    // 👇️ navigate to /
    navigate('/AddRepo');
  };

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
  
  return (
    <div style={{ color: "blue" }}>
      {loading === true && <Spinner/> }
      {loading === false &&
      <Container>
        <Button colorScheme="blue" onClick={navigateHome}>Add and Configure New Repository</Button>
        <br />
        <br />
        <hr/>
        <br />
        <h2> Configured Github Repositories </h2>
        <br />

        {GitData.length <=0 && <h1>No repositories Configured...</h1>}
        {GitData.length >0 &&
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Status</Th>
                <Th>Repository Name</Th>
                <Th>Link</Th>
                <Th>Organization Name</Th>
                <Th>Compute Service</Th>
              </Tr>
            </Thead>

            <Tbody>
              {records.map((e) => (
                <TableEntries
                  name={e.name}
                  link={e.link}
                  login={e.login}
                  service={e.service}
                  id={e.id}
                  key={e.id}
                  status={e.status}
                />
              ))}
            </Tbody>
          </Table>
          
          <br/>
          <ul className="pagination">
            {numbers.map((e:number, i:number) => (
                <li key={i} className={`page-item ${currentPage === e ? 'active' : ''}`}>
                    <Link className="page-link" onClick={() => changePage(e)}> 
                        {e}
                    </Link>
                </li>
            ))} 
          </ul>
        </TableContainer>
        }

      </Container>
    }
    </div>
  );
}
