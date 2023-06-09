import axios from "axios";
//create a post request with the data from the cheque object using fetch
//create base url from environment variable base url

const BASE_URL = "https://cheque-mgt.fly.dev/api";
const SERVER_URL = "https://cheque-mgt.fly.dev";

// const BASE_URL = "http://localhost:8000/api";
// const SERVER_URL = "http://localhost:8000";


const post = (url: string, data: any, headers: object) => {
 const formData = new FormData();
 
 Object.keys(data).forEach(key => {
  formData.append(key, data[key]);
 });
 
 return axios(BASE_URL+url, {
      method: 'POST',
      headers: {
        'Content-Type': '"multipart/form-data"',
        ...headers,
      },
      data: formData
    });
}

const get = (url: string, headers: object) => {
    return axios(BASE_URL+url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        ...headers,
        },
    });
}

const deleteRequest = (url: string, headers: object) => {
    return axios(BASE_URL+url, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        ...headers,
        },
    });
}

const put = (url: string, data: any, headers: object) => {
    return axios(BASE_URL+url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        ...headers,
        },
        data: data
    });
}


export { post, get, deleteRequest, put, SERVER_URL };