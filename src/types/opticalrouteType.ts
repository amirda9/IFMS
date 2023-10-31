export type opticalroutecreateType = {
  id: string;
  name: string;
};

export type opticalrouteTestSetupDetail = {
  id: string;
  name: string;
  station: {
    id: string;
    name: string;
  };
  rtu: {
    id: string;
    name: string;
  };
  parameters: {
    enabled: true;
    type: string;
    wavelength: string;
    break_strategy: string;
    date_save_policy: string;
    test_mode: string;
    run_mode: string;
    distance_mode: string;
    range: number;
    pulse_width_mode: string;
    pulse_width: number;
    sampling_mode: string;
    sampling_duration: number;
    IOR: number;
    RBS: number;
    event_loss_threshold: number;
    event_reflection_threshold: number;
    fiber_end_threshold: number;
    total_loss_threshold: number;
    section_loss_threshold: number;
    injection_level_threshold: number;
  };
  learning_data: {
    targeted_count_per_cycle: number;
    start_cycle_time: {
      type: string;
      time: string;
      periodic_options: {
        value: number;
        period_time: number;
      };
    };
    increase_count_options: {
      count: number;
      timing: {
        type: string;
        time: string;
        periodic_options: {
          value: number;
          period_time: string;
        };
      };
      maximum_count: number;
    };
  };
  test_program: {
    starting_date: {
      start: string;
      immediately: boolean;
    };
    end_date: {
      end: string;
      indefinite: boolean;
    };
    period_time: {
      value: number;
      period_time: string;
    };
  };
};

export type opticalrouteDetailType = {
  name: string;
  comment: string;
  test_ready: boolean;
  type: string;
  avg_hellix_factor: number;
  id: string;
  owner: {
    id: string;
    username: string;
  };
  time_created: string;
  time_updated: string;
};

export type opticalrouteTestSetup = {
  id: string;
  name: string;
  station: {
    id: string;
    name: string;
  };
  rtu: {
    id: string;
    name: string;
  };
  type: string;
  wavelength: string;
};

// export type opticalrouteTestSetup = {

//     name: string,
//     station_id: string,
//     init_rtu_id: string,
//     parameters: {
//       enabled: true,
//       type: string,
//       wavelength:string,
//       break_strategy: string,
//       date_save_policy:string,
//       test_mode: string,
//       run_mode: string,
//       distance_mode:string,
//       range: number,
//       pulse_width_mode:string,
//     pulse_width:string,
//       sampling_mode: string,
//       sampling_duration: number,
//       IOR: number,
//       RBS: number,
//       event_loss_threshold:number,
//       event_reflection_threshold:number,
//       fiber_end_threshold: number,
//       total_loss_threshold:number,
//       section_loss_threshold:number,
//       injection_level_threshold: number
//     },
//     learning_data: {
//       targeted_count_per_cycle:number,
//       start_cycle_time: {
//         type: string,
//         time: string,
//         periodic_options: {
//           value: number,
//           period_time: string
//         }
//       },
//       increase_count_options: {
//         count: number,
//         timing: {
//           type: string,
//           time:string,
//           periodic_options: {
//             value: number,
//             period_time:string
//           }
//         },
//         maximum_count:number
//       }
//     },
//     test_program: {
//       starting_date: {
//         start: string,
//         immediately: boolean
//       },
//       end_date: {
//         end:string,
//         indefinite: boolean
//       },
//       period_time: {
//         value: number,
//         period_time:string
//       }
//     }

//  };

export type opticalrouteRoute = {
  link_id: string;
  cable: string;
  core: number;
  id: string;
  source: {
    id: string;
    name: string;
  };
  destination: {
    id: string;
    name: string;
  };
};

export type opticalrouteUpdateType = {
  name: string;
  comment: string;
  test_ready: boolean;
  type: string;
  avg_hellix_factor: number;
  id: string;
  time_created: string;
  time_updated: string;
};
