import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {deepcopy} from '~/util';

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
  openall: false,
};

const report = createSlice({
  name: 'type',
  initialState,
  reducers: {
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
    // setNetworkselectedlist: (state, action: networkselectedlisttype) => {
    //   state.networkselectedlist = action.payload;
    // },
    setReportselectedlist: (state, action: reportselectedlisttype) => {
      state.reportselectedlist = action.payload;
    },
    // setNetworkoptical: (state, action: networkopticaltypeAction) => {
    //   state.networkoptical = action.payload;
    // },
    setReportserReport: (state, action: ReportsetReportAction) => {
      state.ReportsetReport = action.payload;
    },
    // setAlldeleteopticalroute: (state, action: alldeleteopticalroutetypeAction) => {
    //   state.alldeleteopticalroute = action.payload;
    // },
    setAlldeletereports: (state, action: alldeletereporttypeAction) => {
      state.alldeletereports = action.payload;
    },
    // setOpticalrouteNetworkidadmin: (state, action: {type: string; payload: string}) => {
    //   const findinlist = state.opticalroutenetworkidadmin.findIndex(
    //     data => data == action.payload,
    //   );
    //   if (findinlist < 0) {
    //     state.opticalroutenetworkidadmin.push(action.payload);
    //   }
    // },

    // changeOpticalroutename: (
    //   state,
    //   action: {
    //     type: string;
    //     payload: {networkid: string; opticalId: string; opticalName: string};
    //   },
    // ) => {
    //   console.log('🚞', action.payload);

    //   const networkopticalCopy: networkopticalroutetype[] = deepcopy(
    //     state.networkoptical,
    //   );
    //   const findinlist = networkopticalCopy.findIndex(
    //     data => data.networkid == action.payload.networkid,
    //   );
    //   console.log('🧑‍✈️', findinlist);

    //   const findoptical = networkopticalCopy[findinlist].opticalrouts.findIndex(
    //     data => data.id == action.payload.opticalId,
    //   );
    //   console.log('7🧑‍✈️7', findinlist);
    //   networkopticalCopy[findinlist].opticalrouts[findoptical].name =
    //     action.payload.opticalName;
    //   state.networkoptical = networkopticalCopy;
    // },

    changeReportname: (
      state,
      action: {
        type: string;
        payload: {Reportsetid: string; repirtId: string; reportName: string};
      },
    ) => {
      const ReportsetReportCopy: ReportsetreportType[] = deepcopy(
        state.ReportsetReport,
      );
      const findinlist = ReportsetReportCopy.findIndex(
        data => data.Reportsetid == action.payload.Reportsetid,
      );
      const findoptical = ReportsetReportCopy[findinlist].reports.findIndex(
        data => data.id == action.payload.repirtId,
      );
      ReportsetReportCopy[findinlist].reports[findoptical].name =
        action.payload.reportName;
      state.ReportsetReport = ReportsetReportCopy;
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
  },
});

export const {
  setopticalroutUpdateTestsetupDetail,
  // setNetworkselectedlist,
  setReportselectedlist,
  // setNetworkoptical,
  setReportserReport,
  // setAlldeleteopticalroute,
  // setOpticalrouteNetworkidadmin,
  // changeOpticalroutename,
  setAlldeletereports,
  changeReportname,
  setgettestsetupdetaildata,
  setmodalloading,
  setopenall,
  setReportsetlist,
  createreportsetlist,
  createReport
} = report.actions;

export default report.reducer;
