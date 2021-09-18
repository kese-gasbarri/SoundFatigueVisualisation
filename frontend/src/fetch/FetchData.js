import {useState, useEffect} from "react"
import axios from 'axios';

const FetchData = () => {
    const [fetchedData, setFetchedData] = useState('');
    const url = 'http://127.0.0.1:8000/'
    
    useEffect( () => { 
        getData();
    }, []);

    const getData = () => {
        axios.get(`${url}room/1`)
        .then((response) => {
            const data = response.data
            setFetchedData(data);
        })
        .catch(error => console.error(`Error: ${error}`));
    }
    
    console.log(fetchedData[0].dB);
    return fetchedData
}

const _FetchAPI = () => {
    const url = 'http://127.0.0.1:8000/'
    axios.get(`${url}room/1`)
    .then((response) => {
        const data = response.data
        console.log(data)
        return data
    })

}

export default FetchData;
export const FetchAPI = _FetchAPI; 