import Axios from 'axios';

const client = Axios.create({
    timeout: 30000
});

export default client;