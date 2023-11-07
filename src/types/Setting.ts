
export type SettingsUpdate = {

}
export type settinggettype = {
  optical_route: {
    fiber_type: string;
    helix_factor: number;
    wavelengths: {
      IOR: {
        1310: number;
        1490: number;
        1550: number;
        1625: number;
      };
      RBS: {
        1310: number;
        1490: number;
        1550: number;
        1625: number;
      };
    };
  };
  system: {
    break_strategy: string;
    fiber_test_setup_definition_strategy: string;
    data_save_policy: string;
    test_type: string;
  };
  threshold_setting: {
    wavelength: string;
    total_loss: number;
    section_loss: number;
    event_loss: number;
    event_reflectance: number;
    injection_level: number;
  };
  monitoring_test_setting: {
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
  };
  maintenance_test_setting: {
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
  };
};
