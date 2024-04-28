import axios from "axios";
//'https://applications-api2.vercel.app

const Axios=axios.create({
    baseURL:'https://applications-api2.vercel.app/api/',
});

export default Axios;