import assert from 'assert';
import exp from 'constants';
import EventEmitter from 'events';
import { Octokit } from 'octokit';
import React, { useContext, useEffect, useState } from 'react';
import TypedEventEmitter from 'typed-emitter';

export type ClasseCloudDecodedToken = {
    email: string;
    github: { username: string, token: string };
    name: string;
}

export type ConnectionProperties = {
    userProfile: ClasseCloudDecodedToken;
}

// -----------------------------------------------------------------------------------------------------------
export interface ComputeService {
    id: string;
    name: string;
}

export interface RepoTable {
    id: string;
    org: string;
    name: string;
    link: string;
}

export interface TableItems {
    id: string;
    name: string;
    link: string;
    login: string;
    service:string;
    status:string;
  }

export interface ComputeServiceDetails{
    service_name: string;
    email: string;
    password: string;
    admin_id: string;
    login_name: string;
}

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
const REACT_APP_SERVICE_DB=process.env.REACT_APP_SERVICE_DB || "http://localhost:5001"
const REACT_APP_SERVICE_GITHUB=process.env.REACT_APP_SERVICE_GITHUB || "http://localhost:8181"

//------------------------------------------------------------------------------------------------------------
export default class DashboardController extends (EventEmitter as new () => TypedEventEmitter<DashboardEvent>) {
    private _serviceDBURL: string;
    private _serviceGitHubURL: string;
    private _userProfile: ClasseCloudDecodedToken;
    private _octokit: Octokit;

    private _computeServices: ComputeService[] = [];
    private _allRepositories: RepoTable[] = [];   
    private _configuredRepositories: TableItems[] = [];

    // ------------------------------------------------------------------------------
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

    public get usersName(): string{
        return this._userProfile.name;
    }

    public get octokit(): Octokit {
        return this._octokit;
    }

    // ----------------------------------------
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

    public get computeServices(){
        return this._computeServices;
    }

    public set computeServices(computeServices: ComputeService[]){
        this.emit("computeServices", computeServices);
        this._computeServices = computeServices;
    }

    public async refreshComputeServices(name:string){
        this.computeServices = await this._getComputeServices(name);
    }

    // ----------------------------------------
    private async _getRepositories(name:string) : Promise<RepoTable[]>{
        const url = `${REACT_APP_SERVICE_GITHUB}/repodetails/${name}`;
        const requestOptions = {
            method: "GET",
        };
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        return json;
    }

    public get repositories(){
        return this._allRepositories;
    }

    public set repositories(repo:RepoTable[]){
        this.emit("repositories", repo);
        this._allRepositories = repo;
    }

    public async refreshRepositories(name:string){
        this.repositories = await this._getRepositories(name);
    }

    // ----------------------------------------
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
        return js;
    }

    public get configuredRepositories(){
        return this._configuredRepositories;
    }

    public set configuredRepositories(repo:TableItems[]){
        /*for (let i=0;i<repo.length;i++ ){
            this._configuredRepositories.push({id:repo[i].id, name:repo[i].name, link:repo[i].link, login:repo[i].login, service:repo[i].service, status:repo[i].status})    
        }
        */
        this._configuredRepositories = this._configuredRepositories.concat(repo);
        this.emit("configuredRepositories", this._configuredRepositories);
        console.log(this._configuredRepositories);
        
    }

    public async refreshConfiguredRepositories(name:string){
        this.configuredRepositories = await this._getConfiguredRepositories(name);
    }

    // ----------------------------------------
    public async addNewComputeService(computeData:ComputeServiceDetails){
        const url = `${REACT_APP_SERVICE_DB}/api/computer-service`;
        console.log("-------", computeData.service_name, computeData.email, computeData.password, computeData.admin_id, computeData.login_name);
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_name: computeData.service_name,
                email: computeData.email,
                password: computeData.password,
                admin_id: computeData.admin_id,
                login_name: computeData.login_name
            })
        };
        const response = await fetch(url, requestOptions);
        console.log(response);
    }

    public async configureComputeService(singleCheckedData:RepoTable, selectComputeService:string){
        const url = `${REACT_APP_SERVICE_DB}/api/config_repos`;

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repo_name: singleCheckedData.name,
                repo_link: singleCheckedData.link,
                login_name: singleCheckedData.org,
                service_name: selectComputeService
            })
        };
        const responseCompute = await fetch(url, requestOptions);
        console.log(responseCompute);
    }

}

const context = React.createContext<DashboardController | null>(null);
export { context as DashboardControllerContext };

export function useDashboardController(): DashboardController {
    const ctx = useContext(context);
    assert(ctx, 'DashboardControllerContext is not defined');
    return ctx;
}

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