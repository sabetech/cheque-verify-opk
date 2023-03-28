//create a post request with the data from the cheque object using fetch
//create base url from environment variable base url

const BASE_URL = import.meta.env.VITE_API_URL;

const post = (url: string, data: any) => {

return fetch(BASE_URL+url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'token',
    },
    body: JSON.stringify(data),
  });
}

const get = (url: string) => {
    return fetch(BASE_URL+url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });
}

export { post, get };