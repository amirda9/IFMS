
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

export const $Get =async(url:string)=>{
  return await fetch(`${BASE_URL}/${url}`, {
   method: "GET",
   headers: {
     Authorization: `Bearer ${accesstoken}`,
     Accept: 'application.json',
     'Content-Type': 'application/json',
   },
  });
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


 export const $DELETE =async(url:string,data=null)=>{
  return await fetch(`${BASE_URL}/${url}`, {
   method: "delete",
   body:data,
   headers: {
     Authorization: `Bearer ${accesstoken}`,
     Accept: 'application.json',
     'Content-Type': 'application/json',
   },
  }).then(res => res.json());
 } 

 export const $Delete =async(url:string,data:any=null)=>{
  return await fetch(`${BASE_URL}/${url}`, {
   method: "delete",
   body:JSON.stringify(data),
   headers: {
     Authorization: `Bearer ${accesstoken}`,
     Accept: 'application.json',
     'Content-Type': 'application/json',
   },
  });
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

