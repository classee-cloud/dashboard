import { Obj } from '@popperjs/core';
import { Octokit } from 'octokit';
import {useState, useEffect} from 'react'

const useOctokitFetch = (url:string, octokit:Octokit) => {
    const [data, setData] = useState<Object[]>([]);

    useEffect( () => {
        var js:Object[] = [];
        octokit.request(url)
            .then(({data})=>{
            js.push(data);
        })
        setData(js);        
    }, [url]);

    const refetch = (url:string) => {
        var js:Object[] = [];
        octokit.request(url)
            .then(({data})=>{
            js.push(data);
        })
        setData(js); 
    }

    return {data, refetch};
}


export default useOctokitFetch;