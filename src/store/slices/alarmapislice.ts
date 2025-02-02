import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
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
  tagTypes: ['Alarms'],
  endpoints: builder => ({
    getAlarms: builder.query<
      getAllAlarmsResponse,
      {page: number; limit: number; sortKey: string}
    >({
      query: ({page, limit, sortKey}) =>
        `otdr/alarm/events/?page=${page}&limit=${limit}&sort_key=${sortKey}&sort_order=desc`,
      providesTags: ['Alarms'],
    }),

    deleteAlarm: builder.mutation<void, {alarmIds: string[]}>({
      query: ({alarmIds}) => ({
        url: `otdr/alarm/events/`,
        method: 'DELETE',
        body: alarmIds,
      }),
      invalidatesTags: ['Alarms'], // بعد از حذف، `getAlarms` مجدداً اجرا می‌شود
    }),
  }),
});
export const {useGetAlarmsQuery, useDeleteAlarmMutation} = alarmApi;
