import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import {alldataType,getAllAlarmsResponse} from '~/types/alarm'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://37.32.27.143:8080/api/', // آدرس سرور
  prepareHeaders: headers => {
    const login = localStorage.getItem('login');
    const accessToken = login && (JSON.parse(login)?.data?.access_token || '');

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  },
});

export const alarmApi = createApi({
  reducerPath: 'alarmApi',
  baseQuery,
  tagTypes: ['Alarms','Alarmsdetails'],
  endpoints: builder => ({

    getAlarms: builder.query<
      getAllAlarmsResponse,
      {page: number; limit: number; sortKey: string}
    >({
      query: ({page, limit, sortKey}) =>
        `otdr/alarm/events/?page=${page}&limit=${limit}&sort_key=${sortKey}&sort_order=desc`,
      providesTags: ['Alarms'],
    }),

    getAlarmsDetailsPaged: builder.query<alldataType, { page: number; limit: number; idLisArray: string[] }>({
      query: ({ page = 1, limit = 20, idLisArray = [] }) => ({
        url: `otdr/alarm/events/details_paged/?limit=${limit}&page=${page}`,
        method: 'POST',
        body: idLisArray,
      }),
      // در صورت نیاز می‌توانید کش را invalidate کنید
      // برای مثال، اگر نیاز به invalidate کردن کش بعد از تغییر داده‌ها باشد، می‌توانید در اینجا این کار را انجام دهید.
      // providesTags: (result) => [{ type: 'Alarms', id: 'LIST' }],
    }),
    

    deleteAlarm: builder.mutation<void, {alarmIds: string[]}>({
      query: ({alarmIds}) => ({
        url: `otdr/alarm/events/`,
        method: 'DELETE',
        body: alarmIds,
      }),
      invalidatesTags: ['Alarms'], // بعد از حذف، `getAlarms` مجدداً اجرا می‌شود
    }),

    updateAlarmDetails: builder.mutation<void, {updateallarms: {
      alarm_id: string;
      new_status: string;
    }[]}>({
      query: ({updateallarms}) => ({
        url: `otdr/alarm/events/update_status/`,
        method: 'put',
        body: updateallarms,
      }),
      invalidatesTags: ['Alarmsdetails'],
    
    }

  ),

  }),
});
export const {useGetAlarmsQuery, useDeleteAlarmMutation,useGetAlarmsDetailsPagedQuery,useUpdateAlarmDetailsMutation} = alarmApi;
