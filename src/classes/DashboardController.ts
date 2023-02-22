import assert from 'assert';
import { Octokit } from 'octokit';
import React, { useContext } from 'react';

export type ClasseCloudDecodedToken = {
    email: string;
    github: { username: string, token: string };
    name: string;
}

export type ConnectionProperties = {
    userProfile: ClasseCloudDecodedToken;
}

export default class DashboardController {
    private _serviceDBURL: string;
    private _serviceGitHubURL: string;
    private _userProfile: ClasseCloudDecodedToken;
    private _octokit: Octokit;

    public constructor({ userProfile }: ConnectionProperties) {
        // temp
        const REACT_APP_SERVICE_DB="http://localhost:5001"
        const REACT_APP_SERVICE_GITHUB="http://localhost:8181"
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
}

const context = React.createContext<DashboardController | null>(null);
export { context as DashboardControllerContext };

export function useDashboardController(): DashboardController {
    const ctx = useContext(context);
    assert(ctx, 'DashboardControllerContext is not defined');
    return ctx;
}