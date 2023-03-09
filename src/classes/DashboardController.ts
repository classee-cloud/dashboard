import assert from 'assert';
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



export interface ComputeService {
    id: string;
    name: string;
}

export type DashboardEvent = {
    computeServices: (newComputeServices: ComputeService[]) => void;
}
const REACT_APP_SERVICE_DB=process.env.REACT_APP_SERVICE_DB || "http://localhost:5001"
const REACT_APP_SERVICE_GITHUB="http://localhost:8181"
export default class DashboardController extends (EventEmitter as new () => TypedEventEmitter<DashboardEvent>) {
    private _serviceDBURL: string;
    private _serviceGitHubURL: string;
    private _userProfile: ClasseCloudDecodedToken;
    private _octokit: Octokit;

    private _computeServices: ComputeService[] = [];

    public constructor({ userProfile }: ConnectionProperties) {
        super();
        // temp

        // 
        
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

    public get computeServices(){
        return this._computeServices;
    }

    public set computeServices(computeServices: ComputeService[]){
        this.emit("computeServices", computeServices);
        this._computeServices = computeServices;
    }

    private async _getComputeServices() : Promise<ComputeService[]>{
        const url = `${REACT_APP_SERVICE_DB}/api/computer-service/rajatkeshri/`;

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

    public async refreshComputeServices(){
        //TODO
        this.computeServices = await this._getComputeServices();
    }
}

const context = React.createContext<DashboardController | null>(null);
export { context as DashboardControllerContext };

export function useDashboardController(): DashboardController {
    const ctx = useContext(context);
    assert(ctx, 'DashboardControllerContext is not defined');
    return ctx;
}

export function useComputeServices(url:string) {
    const controller = useDashboardController();
    const [computeServices, setComputeServices] = useState<ComputeService[]>(controller.computeServices);

    useEffect(() =>{
        controller.addListener("computeServices", setComputeServices);
        controller.refreshComputeServices();
        //fetchComputeService();
        return () =>{
            controller.removeListener("computeServices", setComputeServices);
        }
    }, [controller]);

    return computeServices;
}