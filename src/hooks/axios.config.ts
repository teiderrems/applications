import axios from "axios";
//'https://applications-api2.vercel.app

const Axios=axios.create({
    baseURL:'http://localhost:5000/api/',
});

export default Axios;