import axiosClient from '../axiosClient';
import axios from 'axios';

export const 
login = async (credentials) => {
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
    withCredentials: true, 
  } ); 
  return axiosClient.post('/login', credentials);

}

export const logout = async () => {
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
  return axiosClient.post('/logout');
};


export const register = (data) => {
  return axiosClient.post('/register', data);
}

