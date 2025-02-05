import {opticalrouteUpdateTestSetupDetailtype} from '~/types/opticalrouteType';
export type veiwerlists = {
    payload: opticalrouteUpdateTestSetupDetailtype;
    type: string;
  };
  export type networkopticaltype = {
    networkid: string;
    opticalrouts: {name: string; id: string}[];
  }[];
  
  export  type networkopticalroutetype = {
    networkid: string;
    opticalrouts: {name: string; id: string}[];
  };
  export type networkselectedlisttype = {
    payload: string[];
    type: string;
  };
  export type reportselectedlisttype = {
    payload: string[];
    type: string;
  };
  export type ReportsetReporttype = {
    Reportsetid: string;
    reports: {name: string; id: string}[];
  }[];
  export type ReportsetreportType = {
    Reportsetid: string;
    reports: {name: string; id: string}[];
  };
  export type networkopticaltypeAction = {
    payload: networkopticaltype;
    type: string;
  };
  export type ReportsetReportAction = {
    payload: ReportsetReporttype;
    type: string;
  };
  export type alldeleteopticalroutetype = {
    networkid: string;
    opticalrouts: string[];
  }[];
  export type alldeletereporttype = {
    Reportsetid: string;
    reports: string[];
  }[];
  
  export  type alldeleteopticalroutetypeAction = {
    payload: alldeleteopticalroutetype;
    type: string;
  };
  
  export  type alldeletereporttypeAction = {
    payload: alldeletereporttype;
    type: string;
  };
  
  export type updatereport = {
    name: string;
    comment: string;
    report_type: string;
    time_filter: {
      enable: boolean;
      time_filter_type: string;
      time_exact: {
        from_time: string;
        to_time: string;
      };
      time_relative: {
        value: number;
        period: string;
      };
    };
    select_query: string;
    parameters: {
      selected_columns: string[];
      order_by_columns: {};
    };
  };
  
  export type reporttype = {
    id: string;
    availebelColumns: string[];
  } & updatereport;
  
  export type createreporttype = {
    id: string;
    availebelColumns: string[];
  } & updatereport;
  