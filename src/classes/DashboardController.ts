import assert from 'assert';
import EventEmitter from 'events';
import { Octokit } from 'octokit';
import React, { useContext, useEffect, useState } from 'react';
import TypedEventEmitter from 'typed-emitter';

// custom type describing decoded token data
export type ClasseCloudDecodedToken = {
    email: string;
    github: { username: string, token: string };
    name: string;
    nickname: string;
}

// custom type for Connection Properties
export type ConnectionProperties = {
    userProfile: ClasseCloudDecodedToken;
}

// -----------------------------------------------------------------------------------------------------------
// Interface for compute service data - name of services supported
export interface ComputeService {
    id: string;
    name: string;
}

// interface for data stored in the repository table
export interface RepoTable {
    id: string;
    org: string;
    name: string;
    link: string;
}

// interface for data for each element in the table
export interface TableItems {
    id: string;
    name: string;
    link: string;
    login: string;
    service:string;
    status:string;
  }

// interface for data of compute service configured or to be configured
export interface ComputeServiceDetails{
    service_name: string;
    email: string;
    password: string;
    login_name: string;
}

// interface for data organizations under the user
export interface Orgs {
    id: string;
    name: string;
    url: string;
} 

// -----------------------------------------------------------------------------------------------------------
export type DashboardEvent = {
    computeServices: (newComputeServices: ComputeService[]) => void;
    repositories: (newRepositories: RepoTable[]) => void;
    configuredRepositories: (confifuredRepositories: TableItems[]) => void;
}
const REACT_APP_SERVICE_DB=process.env.REACT_APP_SERVICE_DB || "https://db-dev.classee.cloud"
const REACT_APP_SERVICE_GITHUB=process.env.REACT_APP_SERVICE_GITHUB || "https://gh-dev.classee.cloud"

//------------------------------------------------------------------------------------------------------------
/* class dashboard controller - 
Holds all functionality related to dashboard view and logic
*/
export default class DashboardController extends (EventEmitter as new () => TypedEventEmitter<DashboardEvent>) {
    private _serviceDBURL: string;
    private _serviceGitHubURL: string;
    private _userProfile: ClasseCloudDecodedToken;
    private _octokit: Octokit;

    private _computeServices: ComputeService[] = [];
    private _allRepositories: RepoTable[] = [];   
    private _configuredRepositories: TableItems[] = [];

    // ------------------------------------------------------------------------------
    /* Constructor 
    intialized the microservice URLs, url and octokit instance of the user.
    */
    public constructor({ userProfile }: ConnectionProperties) {
        super();
        this._serviceDBURL = REACT_APP_SERVICE_DB || '';
        this._serviceGitHubURL = REACT_APP_SERVICE_GITHUB || '';
        if (this._serviceDBURL === '' || this._serviceGitHubURL === '') {
            throw new Error('Missing environment variables REACT_APP_SERVICE_DB or REACT_APP_SERVICE_GITHUB');
        }
        this._userProfile = userProfile;
        this._octokit = new Octokit({ auth: this._userProfile.github.token });
    }

    // return the user profile name
    public get usersName(): string{
        return this._userProfile.name;
    }

    // return the login user name
    public getUserName():string{
        return this._userProfile.nickname;
    }

    // return the octokit instance
    public get octokit(): Octokit {
        return this._octokit;
    }

    // return repositories under login name/org name
    public async getRepos(loginName:string){
        const allRepos:any = [];
        const allOrgs:any = [] ;

        //console.log(loginName, this.getUserName())
        if (loginName == this.getUserName())
        {
            await this._octokit.request('GET /user/repos', ({
                type: "all"
            }))
            .then(({data}:any)=>{
                data.map((value:any) => {
                    allRepos.push({"id":value.id, "name":value.name, "org": value.owner.login, "link":value.html_url});
                })
            })
        }
        else{
            await this._octokit.request('GET /user/orgs')
            .then(({ data }:any) => {
                data.map((e:any) => {       
                    allOrgs.push({name:e.login});
                })
            }); 

            for(let i=0; i<allOrgs.length; i++){
                await this._octokit.request('GET /orgs/{org}/repos', ({
                    org:allOrgs[i].name
                }))
                .then((x:any) => {
                    x.data.map((value:any) => {
                        allRepos.push({"id":value.id, "name":value.name, "org": value.owner.login, "link":value.html_url});
                    })
                })
            }
        }
        return allRepos;
    }

    // ----------------------------------------
    // API request to database service to fetch the compute service details
    private async _getComputeServices(name:string) : Promise<ComputeService[]>{
        const url = `${REACT_APP_SERVICE_DB}/api/computer-service/${name}`;
        const requestOptions = {
            method: "GET",
        };
        const responseCompute = await fetch(url, requestOptions);
        const jsonCompute = await responseCompute.json();
        var js:Array<ComputeService> = []
        jsonCompute.map((e:any) => {
            js.push({id:e.id, name:e.service_name});
        })
        return js;
    }

    // getter function to get the computer service data
    public get computeServices(){
        return this._computeServices;
    }

    // setting the compute service data
    public set computeServices(computeServices: ComputeService[]){
        this.emit("computeServices", computeServices);
        this._computeServices = computeServices;
    }

    // refreshing the compute service data, refetching from API
    public async refreshComputeServices(name:string){
        this.computeServices = await this._getComputeServices(name);
    }

    // ----------------------------------------
    // API request to github service to fetch all the repo details under the given user
    private async _getRepositories(name:string) : Promise<RepoTable[]>{
        // This fetches repository details from github service.
        /*
        const url = `${REACT_APP_SERVICE_GITHUB}/repodetails/${name}`;
        const requestOptions = {
            method: "GET",
        };
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        */

        // uses dashboard controller's octokit to get the repo details - safer way to do
        const json = await this.getRepos(name);
        return json;
    }

    // get all the repository data
    public get repositories(){
        return this._allRepositories;
    }

    // set all the repository data
    public set repositories(repo:RepoTable[]){
        this.emit("repositories", repo);
        this._allRepositories = repo;
    }

    // refreshing the repository data, refetching from API
    public async refreshRepositories(name:string){
        this.repositories = await this._getRepositories(name);
    }

    // ----------------------------------------
    // API request to database service to fetch all the configured repo details under the given logged in user
    private async _getConfiguredRepositories(name:string) : Promise<TableItems[]>{
        this._configuredRepositories = [];

        const url = `${REACT_APP_SERVICE_DB}/api/config_repos/${name}`;
        const requestOptions = {
            method: "GET",
        };
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        var js:TableItems[] = []
        await json.map((e:any) => {
            js.push({id:e.id, name:e.repo_name, link:e.repo_link, login:e.login, service:e.service, status:e.status});
          });

        const response1 = await fetch(`${REACT_APP_SERVICE_DB}/api/user`, requestOptions);
        console.log(response1);
        return js;
    }

    // get all the configured repository data
    public get configuredRepositories(){
        return this._configuredRepositories;
    }

    // set the configured repository data
    public set configuredRepositories(repo:TableItems[]){
        this._configuredRepositories = repo;
        this.emit("configuredRepositories", this._configuredRepositories);
        console.log(this._configuredRepositories);
        
    }

    // refreshing the confugured repository data, refetching from API
    public async refreshConfiguredRepositories(){
        let orgs = [this._userProfile.github.username];
        orgs = orgs.concat((await this._octokit.request('GET /user/orgs')).data.map(eachOrg => eachOrg.login));
        const configuredRepositories = orgs.map(eachOrgName => this._getConfiguredRepositories(eachOrgName));
        this.configuredRepositories = (await Promise.all(configuredRepositories)).flat();
     }

    // ----------------------------------------
    // adds new compute service to the database. Post Request to the database
    public async addNewComputeService(computeData:ComputeServiceDetails){
        const url = `${REACT_APP_SERVICE_DB}/api/computer-service`;
        console.log("-------", computeData.service_name, computeData.email, computeData.password, computeData.login_name);
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_name: computeData.service_name,
                email: computeData.email,
                password: computeData.password,
                login_name: computeData.login_name,
            })
        };
        const response = await fetch(url, requestOptions);
        console.log(response);
    }

    // adds new conifgured compute service and repo data to the database
    public async configureComputeService(singleCheckedData:RepoTable, selectComputeService:string){
        const url = `${REACT_APP_SERVICE_DB}/api/config_repos`;

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repo_name: singleCheckedData.name,
                repo_link: singleCheckedData.link,
                login_name: singleCheckedData.org,
                service_name: selectComputeService,
                status: "not started"
            })
        };
        const responseCompute = await fetch(url, requestOptions);
        console.log(responseCompute);
    }

}

const context = React.createContext<DashboardController | null>(null);
export { context as DashboardControllerContext };

// custom hook for dashboard controller class
export function useDashboardController(): DashboardController {
    const ctx = useContext(context);
    assert(ctx, 'DashboardControllerContext is not defined');
    return ctx;
}

// custom hook for computer services
export function useComputeServices() {
    const controller = useDashboardController();
    const [computeServices, setComputeServices] = useState<ComputeService[]>(controller.computeServices);

    useEffect(() =>{
        controller.addListener("computeServices", setComputeServices);
        return () =>{
            controller.removeListener("computeServices", setComputeServices);
        }
    }, [controller]);

    return computeServices;
}

// custom hook for repository details
export function useRepositoryDetails() {
    const controller = useDashboardController();
    const [allRepositories, setAllRepositories] = useState<Array<RepoTable>>([]);

    useEffect(() =>{
        controller.addListener("repositories", setAllRepositories);
        return () =>{
            controller.removeListener("repositories", setAllRepositories);
        }
    }, [controller]);

    return allRepositories;
}

// custom hook for configured repository details
export function useConfiguredRepositoryDetails() {
    const controller = useDashboardController();
    const [configuredRepositories, setConfoguredRepositories] = useState<Array<TableItems>>([]);

    useEffect(() =>{
        controller.addListener("configuredRepositories", setConfoguredRepositories);
        console.log(configuredRepositories);
        return () =>{
            controller.removeListener("configuredRepositories", setConfoguredRepositories);
        }
    }, [controller]);

    return configuredRepositories;
}