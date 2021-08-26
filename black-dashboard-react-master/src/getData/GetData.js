import React, {useState, useEffect} from "react"
import axios from 'axios';

const GetData = () => {
    const [fechtedData, setFechtedData] = useState([]);
    
    useEffect( () => { 
        async function fetchData() {
            try {
                const res = await axios.get('http://127.0.0.1:8000/'); 
                setFechtedData(res.data);
               
            } catch (err) {
                
                console.log(err);
            }
        }
        fetchData();
    }, []);
    return <div>{fechtedData}</div>
}

export default GetData