import axios from 'axios';


const httpService = axios.create();

// if needed we can intercept request ex: adding jwt tokens like that
httpService.interceptors.request.use(
  config => {
    config.baseURL = process.env.REACT_APP_API_BASEURL;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// if needed we can intercept response
httpService.interceptors.response.use(
  response => {
    if(response.data == null)
    {
      alert('Error occured');
    }
    return response;
  },
  error => {
      if (error && error.response) {
          console.error(error.response);
      }
  },
);

export default httpService;
