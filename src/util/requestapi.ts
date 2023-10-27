
import {BASE_URL} from '~/constant';
const login = localStorage.getItem('login');
const accesstoken = JSON.parse(login || '')?.data.access_token;
export const $GET =async(url:string)=>{
 return await fetch(`${BASE_URL}/${url}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accesstoken}`,
    Accept: 'application.json',
    'Content-Type': 'application/json',
  },
 }).then(res => res.json());
} 





