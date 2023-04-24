import Axios from 'axios';
import { getAuthToken } from '../utils';
import { BACKEND_URL } from '../constants';

const HttpService = () => Axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
  withCredentials: false,
  headers: {
    Authorization: 'Bearer ' + getAuthToken(),
  },
});

export default HttpService;
