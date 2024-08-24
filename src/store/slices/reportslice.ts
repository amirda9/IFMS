import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {deepcopy} from '~/util/deepcopy';

type veiwerlists = {
  payload: opticalrouteUpdateTestSetupDetailtype;
  type: string;
};
export type networkopticaltype = {
  networkid: string;
  opticalrouts: {name: string; id: string}[];
}[];

type networkopticalroutetype = {
  networkid: string;
  opticalrouts: {name: string; id: string}[];
};
type networkselectedlisttype = {
  payload: string[];
  type: string;
};
type reportselectedlisttype = {
  payload: string[];
  type: string;
};
export type ReportsetReporttype = {
  Reportsetid: string;
  reports: {name: string; id: string}[];
}[];
type ReportsetreportType = {
  Reportsetid: string;
  reports: {name: string; id: string}[];
};
type networkopticaltypeAction = {
  payload: networkopticaltype;
  type: string;
};
type ReportsetReportAction = {
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

type alldeleteopticalroutetypeAction = {
  payload: alldeleteopticalroutetype;
  type: string;
};

type alldeletereporttypeAction = {
  payload: alldeletereporttype;
  type: string;
};

type updatereport = {
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

type initialStatetype = {
  opticalroutUpdateTestsetupDetail: opticalrouteUpdateTestSetupDetailtype;
  networkselectedlist: string[];
  reportselectedlist: string[];
  networkoptical: networkopticalroutetype[];
  ReportsetReport: ReportsetreportType[];
  alldeleteopticalroute: alldeleteopticalroutetype;
  alldeletereports: alldeletereporttype;
  opticalroutenetworkidadmin: string[];
  reportsetlist: {id: string; name: string}[];
  gettestsetupdetaildata: boolean;
  modalloading: boolean;
  openall: boolean;
  reportdetail: reporttype;
  createreportdetail: createreporttype;
  loadinggetrports: boolean;
  getdetailstatus:boolean;
  createmount:boolean
};
const initialState: initialStatetype = {
  opticalroutUpdateTestsetupDetail: {
    name: '',
    station_id: '',
    station_name: '',
    init_rtu_id: '',
    init_rtu_name: '',
    startdatePart: '',
    starttimePart: '',
    enddatePart: '',
    endtimePart: '',
    parameters: {
      enabled: true,
      type: 'monitoring',
      wavelength: '1625',
      break_strategy: 'skip',
      date_save_policy: 'save',
      test_mode: 'fast',
      run_mode: 'average',
      distance_mode: 'manual',
      range: 3,
      pulse_width_mode: 'manual',
      pulse_width: 3,
      sampling_mode: 'duration',
      sampling_duration: 4,
      IOR: 1.476,
      RBS: -79,
      event_loss_threshold: 0.05,
      event_reflection_threshold: -40,
      fiber_end_threshold: 5,
      total_loss_threshold: 5,
      section_loss_threshold: 5,
      injection_level_threshold: 5,
    },
    learning_data: {
      targeted_count_per_cycle: 30,
      start_cycle_time: {
        type: 'fixed',
        time: '',
        periodic_options: {
          value: 0,
          period_time: 'secondly',
        },
      },
      increase_count_options: {
        count: 2,
        timing: {
          type: 'fixed',
          time: '',
          periodic_options: {
            value: 0,
            period_time: 'secondly',
          },
        },
        maximum_count: 60,
      },
    },
    test_program: {
      starting_date: {
        start: '',
        immediately: false,
      },
      end_date: {
        end: '',
        indefinite: true,
      },
      period_time: {
        value: 0,
        period_time: 'hourly',
      },
    },
  },
  networkselectedlist: [],
  reportselectedlist: [],
  networkoptical: [],
  ReportsetReport: [],
  alldeleteopticalroute: [],
  alldeletereports: [],
  opticalroutenetworkidadmin: [],
  reportsetlist: [],
  gettestsetupdetaildata: false,
  modalloading: false,
  getdetailstatus:false,
  openall: false,
  reportdetail: {
    name: '',
    comment: '',
    report_type: 'network',
    time_filter: {
      enable: false,
      time_filter_type: 'exact',
      time_exact: {
        from_time: '2024-07-13',
        to_time: '2024-08-12',
      },
      time_relative: {
        value: 1,
        period: 'month',
      },
    },
    select_query: '',
    parameters: {
      selected_columns: [],
      order_by_columns: {},
    },
    availebelColumns: [],
    id: '',
  },

  createreportdetail: {
    name: '',
    comment: '',
    report_type: 'network',
    time_filter: {
      enable: false,
      time_filter_type: 'exact',
      time_exact: {
        from_time: '2024-07-13',
        to_time: '2024-08-12',
      },
      time_relative: {
        value: 1,
        period: 'month',
      },
    },
    select_query: '',
    parameters: {
      selected_columns: [],
      order_by_columns: {},
    },
    availebelColumns: ["Regions", "Stations", "Optical Routes", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Affected Regions", "Affected Stations", "Occupied Ports", "Free Ports", "Avg. Region Stations", "Max. Region Stations", "Min. Region Stations", "Avg. Region Links", "Max. Region Links", "Min. Region Links", "Avg. Region RTUs", "Max. Region RTUs", "Min. Region RTUs", "Avg. Region Online RTUs", "Max. Region Online RTUs", "Min. Region Online RTUs", "Avg. Region Offline RTUs", "Max. Region Offline RTUs", "Min. Region Offline RTUs"],
    id: '',
  },
  loadinggetrports: false,
  createmount:false
};

const report = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setCreatemoune: (state, action: {type: string; payload: boolean}) => {
      state.createmount = action.payload;
    },
    setloadinggetrports: (state, action: {type: string; payload: boolean}) => {
      state.loadinggetrports = action.payload;
    },
    setReportdetail: (state, action: {type: string; payload: reporttype}) => {
      console.log('action.payload', action.payload);

      state.reportdetail = action.payload;
    },
setgetdetailstatus: (state, action: {type: string; payload: boolean}) => {
  state.getdetailstatus = action.payload;
},
    setcreateReportdetail: (
      state,
      action: {type: string; payload: reporttype},
    ) => {
      console.log('action.payload', action.payload);

      state.createreportdetail = action.payload;
    },
    setopticalroutUpdateTestsetupDetail: (state, action: veiwerlists) => {
      state.opticalroutUpdateTestsetupDetail = action.payload;
    },
    createreportsetlist: (
      state,
      action: {type: string; payload: {id: string; name: string}},
    ) => {
      const reportsetlistCopy = deepcopy(state.reportsetlist);
      reportsetlistCopy.push(action.payload);
      state.reportsetlist = reportsetlistCopy;
    },

    setReportsetlist: (
      state,
      action: {type: string; payload: {name: string; id: string}[]},
    ) => {
      state.reportsetlist = action.payload;
    },

    setReportselectedlist: (state, action: reportselectedlisttype) => {
      state.reportselectedlist = action.payload;
    },

    setReportserReport: (state, action: ReportsetReportAction) => {
      state.ReportsetReport = action.payload;
    },

    setAlldeletereports: (state, action: alldeletereporttypeAction) => {
      state.alldeletereports = action.payload;
    },

    setgettestsetupdetaildata: (
      state,
      action: {type: string; payload: boolean},
    ) => {
      state.gettestsetupdetaildata = action.payload;
    },

    createReport: (
      state,
      action: {
        type: string;
        payload: {ReportSetId: string; id: string; name: string};
      },
    ) => {
      const ReportsetReportCopy: ReportsetreportType[] = deepcopy(
        state.ReportsetReport,
      );
      const findreportsetid = ReportsetReportCopy.findIndex(
        data => data.Reportsetid == action.payload.ReportSetId,
      );
      if (findreportsetid > -1) {
        ReportsetReportCopy[findreportsetid].reports.push({
          id: action?.payload?.id,
          name: action.payload.name,
        });
      } else {
        ReportsetReportCopy.push({
          Reportsetid: action.payload.ReportSetId,
          reports: [
            {
              name: action.payload.name,
              id: action.payload.id,
            },
          ],
        });
      }
      state.ReportsetReport = ReportsetReportCopy;
    },

    setmodalloading: (state, action: {type: string; payload: boolean}) => {
      state.modalloading = action.payload;
    },
    setopenall: (state, action: {type: string; payload: boolean}) => {
      state.openall = action.payload;
    },

    updaterportname: (
      state,
      action: {
        type: string;
        payload: {reportsetId: string; reportid: string; name: string};
      },
    ) => {
      const ReportsetReportCopy: ReportsetreportType[] = deepcopy(
        state.ReportsetReport,
      );
      const findReportsetReportindex = ReportsetReportCopy.findIndex(
        data => data.Reportsetid == action.payload.reportsetId,
      );
      const findreportindex = ReportsetReportCopy[
        findReportsetReportindex
      ].reports.findIndex(data => data.id == action.payload.reportid);
      ReportsetReportCopy[findReportsetReportindex].reports[
        findreportindex
      ].name = action.payload.name;
      state.ReportsetReport = ReportsetReportCopy;
    },
    updaterportsetname: (
      state,
      action: {type: string; payload: {reportsetId: string; name: string}},
    ) => {
      const reportsetlistCopy: {id: string; name: string}[] = deepcopy(
        state.reportsetlist,
      );
      const findreportsetlistindex = reportsetlistCopy.findIndex(
        data => data.id == action.payload.reportsetId,
      );
      reportsetlistCopy[findreportsetlistindex].name = action.payload.name;
      state.reportsetlist = reportsetlistCopy;
    },
    deletereportset: (
      state,
      action: {type: string; payload: {reportsetId: string}},
    ) => {
      const reportsetlistCopy: {id: string; name: string}[] = deepcopy(
        state.reportsetlist,
      );
      const findreportsetlistindex = reportsetlistCopy.findIndex(
        data => data.id == action.payload.reportsetId,
      );
      reportsetlistCopy.splice(findreportsetlistindex, 1);
      state.reportsetlist = reportsetlistCopy;
    },

    deletereport: (
      state,
      action: {type: string; payload: {reportsetid: string; reportid: string}},
    ) => {
      const ReportsetReportCopy: ReportsetreportType[] = deepcopy(
        state.ReportsetReport,
      );
      const findreportsetlistindex = ReportsetReportCopy.findIndex(
        data => data.Reportsetid == action.payload.reportsetid,
      );
      const findreportid = ReportsetReportCopy[
        findreportsetlistindex
      ].reports.findIndex(data => data.id == action.payload.reportid);
      ReportsetReportCopy[findreportsetlistindex].reports.splice(
        findreportsetlistindex,
        1,
      );
      state.ReportsetReport = ReportsetReportCopy;
    },
  },
});

export const {
  setopticalroutUpdateTestsetupDetail,
  setReportselectedlist,
  setReportserReport,
  setAlldeletereports,
  setgettestsetupdetaildata,
  setmodalloading,
  setopenall,
  setReportsetlist,
  createreportsetlist,
  createReport,
  updaterportname,
  updaterportsetname,
  deletereportset,
  deletereport,
  setReportdetail,
  setloadinggetrports,
  setcreateReportdetail,
  setgetdetailstatus,
  setCreatemoune
} = report.actions;

export default report.reducer;
