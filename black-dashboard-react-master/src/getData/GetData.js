import React, {useState, useEffect} from "react"
import axios from 'axios';

const GetData = () => {
    const [posts, setPosts] = useState([]);
    
    useEffect( () => { 
        async function fetchData() {
            try {
                const res = await axios.get('http://127.0.0.1:8000/'); 
                setPosts(res.data);
                console.log(setPosts)
            } catch (err) {
                console.log("HELLLo")
                console.log(err);
            }
        }
        fetchData();
    }, []);
    return <div>{posts}</div>
}

export default GetData