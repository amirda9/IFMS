
import {BASE_URL} from '~/constant';
const login = localStorage.getItem('login');
const accesstoken = login && JSON.parse(login)?.data?.access_token || "";
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



export const $POST =async(url:string,data:any)=>{
  return await fetch(`${BASE_URL}/${url}`, {
   method: "post",
   body:data,
   headers: {
     Authorization: `Bearer ${accesstoken}`,
     Accept: 'application.json',
     'Content-Type': 'application/json',
   },
  }).then(res => res.json());
 } 

 export const $PUT =async(url:string,data:any)=>{
  return await fetch(`${BASE_URL}/${url}`, {
   method: "post",
   body:data,
   headers: {
     Authorization: `Bearer ${accesstoken}`,
     Accept: 'application.json',
     'Content-Type': 'application/json',
   },
  }).then(res => res.json());
 } 

