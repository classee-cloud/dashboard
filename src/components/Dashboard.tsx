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
  Checkbox,
  Tab,
} from "@chakra-ui/react";
import {
  OidcUserStatus,
  useOidc,
  useOidcAccessToken,
  useOidcUser,
} from "@axa-fr/react-oidc";
import { Octokit } from "octokit";
import { useDashboardController } from "../classes/DashboardController";
//import { GitData } from "./GitData";

interface TableItems {
  id: string;
  name: string;
  link: string;
}

export default function Dashboard() {
  const dashboardController = useDashboardController();

  const [GitData, setGitData] = useState<Array<TableItems>>([]);
  const [Tokens, setTokens] = useState<object>();

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState<Array<string>>([]);
  const [list, setList] = useState<Array<TableItems>>(GitData);

  useEffect(() => {
    const octokit = dashboardController.octokit;
    octokit.request('GET /user/repos', {sort: 'pushed', direction: 'desc'}).then(({ data }) => {
      setGitData(data.map(
        eachRepo => ({id: eachRepo.id.toString(), name: eachRepo.name, link: eachRepo.html_url})
        ));
    });
  }, [dashboardController]);
  // const tokens = async () => {
  //   const response = await fetch(serverDB + `/api/login`, requestOptions);
  //   const json = await response.json();
  //   //console.log(json);
  //   console.log("Token fetched");
  //   setTokens(json);
  // };

  // const userData = async () => {
  //   console.log("Fetching user data");

  //   const requestOptions = {
  //     method: "GET",
  //   };
  //   const response = await fetch(
  //     serviceGithub + `/repodetails/${loginName}/${JSON.stringify(Tokens)}`,
  //     requestOptions
  //   );
  //   const json = await response.json();
  //   console.log(json);
  //   console.log("User Github Data fetched");
  //   setGitData(json);
  // };

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

  // if (Tokens != undefined && (GitData === undefined || GitData.length == 0)) {
  //   //fetch user data
  //   userData();
  // }

  const TableEntries = ({ name, link, id }: TableItems) => {
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
  return (
    <div style={{ color: "blue" }}>
      <Container>
        <h2> Github Repositories </h2>
        <br />

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox colorScheme="blue" /> &nbsp; &nbsp; Repository Name
                </Th>
                <Th>Link</Th>
              </Tr>
            </Thead>

            <Tbody>
              {GitData.map((e) => (
                <TableEntries
                  name={e.name}
                  key={e.id}
                  link={e.link}
                  id={e.id}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Button colorScheme="blue">Trigger CI</Button>
      </Container>
    </div>
  );
}
