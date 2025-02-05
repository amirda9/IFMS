import {createSlice} from '@reduxjs/toolkit';
import {deepcopy} from '~/util/deepcopy';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';

import { 
  veiwerlists,
  networkopticalroutetype,
  reportselectedlisttype,
  ReportsetreportType,
  ReportsetReportAction,
  alldeleteopticalroutetype,
  alldeletereporttype,
  alldeletereporttypeAction,
  reporttype,
  createreporttype
} from '~/types/report';
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
      type: 'Monitoring',
      wavelength: '1625',
      break_strategy: 'Skip',
      date_save_policy: 'Save Trace File',
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
    status:{
      reference_status: '',
      current_learning_cycle: 1,
      on_learning: false,
      current_reference_id: '',
      current_cycle_start: '',
      next_cycle_start: '',
      first_reference_time: '',
      last_reference_time: '',
      last_learning_count: 0
    }
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
