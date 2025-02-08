
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {BASE_URL} from '~/constant';
export const $GET = async (url: string) => {
  try {
    const login = localStorage.getItem('login');
    const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
    
    if (!accesstoken) {
      throw new Error('No access token available');
    }

    const res = await fetch(`${BASE_URL}/${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status} ${res.statusText}`);
    }

    // Try to parse the response JSON
    try {
      const data = await res.json();
      return data;
    } catch (jsonError) {
      throw new Error('Failed to parse JSON response');
    }
    
  } catch (error) {
    console.error('Error during GET request:', error);
    // Optionally, you can return a default value or rethrow the error
    throw error;  // Re-throwing the error so the caller can handle it
  }
};

export const $Get = async (url: string) => {
      const login = localStorage.getItem('login');
      const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
      if (!accesstoken) return;
      return await fetch(`${BASE_URL}/${url}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
};

export const $POST = async (url: string, data: any,showtoast:boolean=true) => {
  try {
    const login = localStorage.getItem('login');
    const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
    
    // If no access token, throw an error
    if (!accesstoken) {
      throw new Error('No access token available');
    }

    // Send POST request with the body data and headers
    const res = await fetch(`${BASE_URL}/${url}`, {
      method: 'POST',
      body: JSON.stringify(data), // Ensure the data is stringified
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status} ${res.statusText}`);
    }

    // Try to parse the response JSON
    try {
      const jsonData = await res.json();
      if(showtoast){
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
      }

      return jsonData;
    } catch (jsonError) {
      throw new Error('Failed to parse JSON response');
    }

  } catch (error) {
    if(showtoast){
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    }
    console.error('Error during POST request:', error);
    // Optionally, return a default value or rethrow the error
    throw error;  // Re-throwing the error so the caller can handle it
  }
};

export const $Post = async (url: string, data: any) => {
  const login = localStorage.getItem('login');
  const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
  if (!accesstoken) return;
  return await fetch(`${BASE_URL}/${url}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${accesstoken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const $DELETE = async (url: string, data = null) => {
  const login = localStorage.getItem('login');
  const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
  if (!accesstoken) return;
  return await fetch(`${BASE_URL}/${url}`, {
    method: 'delete',
    body: data,
    headers: {
      Authorization: `Bearer ${accesstoken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res?.json());
};

export const $Delete = async (url: string, data: any = null) => {
  const login = localStorage.getItem('login');
  const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
  if (!accesstoken) return;
  return await fetch(`${BASE_URL}/${url}`, {
    method: 'delete',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${accesstoken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
export const $PUT = async (url: string, data: any,showtoast:boolean=true) => {
  try {
    const login = localStorage.getItem('login');
    const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
    
    // If no access token, throw an error
    if (!accesstoken) {
      throw new Error('No access token available');
    }

    // Send POST request with the body data and headers
    const res = await fetch(`${BASE_URL}/${url}`, {
      method: 'PUT',
      body: JSON.stringify(data), // Ensure the data is stringified
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is successful
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status} ${res.statusText}`);
    }

    // Try to parse the response JSON
    try {
      const jsonData = await res.json();
    
      return jsonData;
    } catch (jsonError) {
      throw new Error('Failed to parse JSON response');
    }

  } catch (error) {
    if(showtoast){
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    }
    console.error('Error during put request:',error);
    // Optionally, return a default value or rethrow the error
    throw error;  // Re-throwing the error so the caller can handle it
  }
};

export const $Put = async (url: string, data: any) => {
  const login = localStorage.getItem('login');
  const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');
  if (!accesstoken) return;
  return await fetch(`${BASE_URL}/${url}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${accesstoken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
