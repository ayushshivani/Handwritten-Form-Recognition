import axios from 'axios';

const instance = axios.create({
	baseURL : 'http://ec2-3-16-164-73.us-east-2.compute.amazonaws.com:80',
    headers : {
        'Content-Type': 'application/json',
    },
});

export default instance;
