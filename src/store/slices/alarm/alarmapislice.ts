import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
enum severityamount {
  HIGHT = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}
enum statusamounts {
  PENDING = 'Pending',
  ACKNoWLEDGED = 'Acknowledged',
  INPROGRESS = 'In progress',
  RESOLVED = 'Resolved',
}

type alarmlist = {
  source_name: string;
  severity: severityamount;
  status: statusamounts;
  measurement_fk: string;
  rtu_fk: string;
  link_fk: string;
  network_id: string;
  region_id: string;
  alarm_type: string;
  id_list: [];
  acting_user: string;
  network_name: string;
  alarm_number: number;
  time_created: string;
  time_modified: string;
  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
};
type getAllAlarmsResponse = {
  alarm_events: [alarmlist];
  page_number: number;
  total_count: number;
};

export type alldataType = {
  details: {
    source_name: string,
    severity: string,
    status: string,
    measurement_fk: string,
    rtu_fk: string,
    link_fk: string,
    route_fk: string,
    network_id: string,
    region_id: string,
    alarm_type: string,
    id_list: [],
    acting_user: string,
    network_name: string,
    alarm_number: 1,
    time_created: string,
    time_modified:string,
    to_escalation: {
      days: number,
      hours: number,
      minutes: number
    },
    to_timeout: {
      days: number,
      hours: number,
      minutes: number
    },
    region_name: string,
    link_name: string,
    station_name: string,
    cable: string,
    rtu_name: string,
    core: number,
    port: number
  };
  alarms: [
    {
      id: string,
      alarm_type: string,
      measurement_id: string,
      optical_route_id: string,
      test_setup_id: string,
      latitude: number,
      longitude: number,
      secondary_source: string,
      severity: string,
      status: string,
      region_name: string,
      region_admin: string,
      station_name: string,
      to_escalation: {
        days: number,
        hours: number,
        minutes: number
      },
      to_timeout: {
        days: number,
        hours: number,
        minutes: number
      },
      time_modified: string,
      time_created: string,
      contributing_conditions: [  {
        parameter: string;
        operator: string;
        fault: string;
        coef: number;
        value: string;
        reference_value: number;
        measured_value: number;
      }]
    }
  ];
  total_pages: number,
  total_count: number
};


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
