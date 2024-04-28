import axios from "axios";


const Axios=axios.create({
    baseURL:'https://applications-api2.vercel.app/api/',
    headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
    }
});

export default Axios;