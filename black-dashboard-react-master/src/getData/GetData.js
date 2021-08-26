import React, {useState, useEffect} from "react"
import axios from 'axios';

const GetData = () => {
    const [fetchedData, setFetchedData] = useState([]);
    
    useEffect( () => { 
        async function fetchData() {
            try {
                const res = await axios.get('http://127.0.0.1:8001/1/0'); 
                setFetchedData(res.data);
                
            } catch (err) {
                console.log("ERRRORROROROR");
                console.log(err);
            }
        }
        fetchData();
    }, []);
    return <div>Db is = {fetchedData.dB} pitch = {fetchedData.pitch}</div>
}

export default GetData