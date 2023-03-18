/* eslint-disable */

import React, { useState, useEffect, ChangeEvent } from "react";
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
import { table } from "console";


export default function Dashboard() {
  const dashboardController = useDashboardController();
  const navigate = useNavigate();
  //const [GitData, setGitData] = useState<Array<TableItems>>([]);
  const GitData = useConfiguredRepositoryDetails();

  useEffect(() => {
    console.log(dashboardController);
    const octokit = dashboardController.octokit;
    //octokit.request('GET /user/repos', {sort: 'pushed', direction: 'desc'})
    //.then(({ data }) => {
    // setGitData(data.map(
    //    eachRepo => ({id: eachRepo.id.toString(), name: eachRepo.name, link: eachRepo.html_url, service:eachRepo.service})
    //    ));
    //});



    if (GitData.length==0){
      octokit.request('GET /user')
          .then( async ({data})=>{
            dashboardController.refreshConfiguredRepositories(data.login);
            /*
            const response = await fetch(`http://localhost:5001/api/config_repos/${data.login}`);
            const json = await response.json();
            await json.map((e:any) => {
                setGitData(GitData => [...GitData, {id:e.id, name:e.repo_name, link:e.repo_link, login:e.login, service:e.service, status:e.status}])
              });     
            */
      })
      
      // user/orgs
      octokit.request('GET /user/orgs')
          .then(({ data }) => {
              data.map(async (e) => {
                dashboardController.refreshConfiguredRepositories(e.login);
                /*
                const response = await fetch(`http://localhost:5001/api/config_repos/${e.login}`);
                const json = await response.json();
                await json.map((e:any) => {
                  setGitData(GitData => [ ...GitData, {id:e.id, name:e.repo_name, link:e.repo_link, login:e.login, service:e.service, status:e.status}])
                });
                */
              })
      });      
    }
    
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
  
  return (
    <div style={{ color: "blue" }}>
      <Container>

        <Button colorScheme="blue" onClick={navigateHome}>Add and Configure New Repository</Button>
        <br />
        <br />
        <hr/>
        <br />
        <h2> Configured Github Repositories </h2>
        <br />

        {GitData.length <=0 && <h1>loading...</h1>}
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
              {GitData.map((e) => (
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
        </TableContainer>
        }

      </Container>
    </div>
  );
}
