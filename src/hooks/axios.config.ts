import axios from "axios";
//'http://localhost:5000/api/'

const Axios=axios.create({
    baseURL:'http://localhost:5000/api/'//'https://applications-api2.vercel.app/api/',
});

export default Axios;