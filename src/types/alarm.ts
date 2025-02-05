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
  
   export type modalvalue = {
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
      contributing_conditions: [
        {
          parameter: string;
          operator: string;
          fault: string;
          coef: number;
          value: string;
          reference_value: number;
          measured_value: number;
        },
      ];
    }
   export enum severityamount {
        HIGHT = 'High',
        MEDIUM = 'Medium',
        LOW = 'Low',
      }
    export enum statusamounts {
        PENDING = 'Pending',
        ACKNoWLEDGED = 'Acknowledged',
        INPROGRESS = 'In progress',
        RESOLVED = 'Resolved',
      }
      
      export type alarmlist = {
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
       export type getAllAlarmsResponse = {
        alarm_events: [alarmlist];
        page_number: number;
        total_count: number;
      };