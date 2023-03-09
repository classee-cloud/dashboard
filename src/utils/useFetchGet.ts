import {useState, useEffect} from 'react'

const useFetchGet = (url:string) => {
    const [data, setData] = useState([]);
    const [isPending, setPending] = useState(true);
    const [error, setError] = useState(null);

    const requestOptions = {
        method: "GET",
    };

    useEffect( () => {
        fetch(url, requestOptions)
            .then( res => {
                if (!res.ok){
                    throw Error ('could not fetch data from the source')
                }
                return res.json();
            })
            .then( data => {
                setData(data);
                setPending(false);
                setError(null);
            })
            .catch (err => {
                setPending(false);
                setError(err.message);
            });
    }, [url]);

    const refetch = (url:string) => {
        fetch(url, requestOptions)
            .then( res => {
                if (!res.ok){
                    throw Error ('could not fetch data from the source')
                }
                return res.json();
            })
            .then( data => {
                setData(data);
                setPending(false);
                setError(null);
            })
            .catch (err => {
                setPending(false);
                setError(err.message);
            });
    }

    return {data, isPending, error, refetch};
}

export default useFetchGet;