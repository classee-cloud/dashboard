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
import { useDashboardController } from "../classes/DashboardController";
import {useNavigate} from 'react-router-dom';
import { table } from "console";

interface TableItems {
  id: string;
  name: string;
  link: string;
  login: string;
  service:string;
}



export default function Dashboard() {
  const dashboardController = useDashboardController();
  const navigate = useNavigate();
  const [GitData, setGitData] = useState<Array<TableItems>>([]);

  useEffect(() => {
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
            const response = await fetch(`http://localhost:5001/api/config_repos/${data.login}`);
            const json = await response.json();
            await json.map((e:any) => {
              setGitData(GitData => [{id:e.id, name:e.repo_name, link:e.repo_link, login:e.login, service:e.service}])
              console.log(GitData);
              });     
      })
      
      // user/orgs
      octokit.request('GET /user/orgs')
          .then(({ data }) => {
              //console.log(data);
              data.map(async (e) => {
                const response = await fetch(`http://localhost:5001/api/config_repos/${e.login}`);
                const json = await response.json();
                await json.map((e:any) => {
                  setGitData(GitData => [ ...GitData, {id:e.id, name:e.repo_name, link:e.repo_link, login:e.login, service:e.service}])
                });
              })
      });      
    }

  }, [dashboardController]);


  
  const TableEntries = ({ name, link, id, login, service}: TableItems) => {
    return (
      <Tr>
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
        <h2> Github Repositories </h2>
        <br />

        {GitData.length <=0 && <h1>loading...</h1>}
        {GitData.length >0 &&
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  Repository Name
                </Th>
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
