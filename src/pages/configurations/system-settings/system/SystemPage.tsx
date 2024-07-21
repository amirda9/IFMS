import {Select} from '~/components';
import SystemSettingsMain from '../SystemSettingsMain';
import {ReactNode, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {$Get} from '~/util/requestapi';
import { toast } from 'react-toastify';
type Rowinputtype = {
  name: string;
  children: ReactNode;
};

const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="mb-[6px] flex w-[700px] flex-row justify-between">
      <span className="w-[400px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};

// -------------------- main --------------------------- main ---------------------- main --------------------- main --------

const SystemPage = () => {
  const [loading,setLoading]=useState(false)
  const {request, state} = useHttpRequest({
    selector: state => ({
      SettingsGet: state.http.SettingsGet,
      SettingsUpdatesystem: state.http.SettingsUpdatesystem,
    }),
    initialRequests: request => {
      // request('SettingsGet', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.SettingsUpdatesystem?.httpRequestStatus === 'loading' &&
        state.SettingsUpdatesystem!.httpRequestStatus === 'success'
      ) {
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
        request('SettingsGet', undefined);
      }

      if(state?.SettingsUpdatesystem?.error){
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    },
  });

  const [system, setSystem] = useState<{
    break_strategy: string;
    fiber_test_setup_definition_strategy: string;
    data_save_policy: string;
    test_type: string;
  }>();

  const onSaveButtonClick = () => {
    request('SettingsUpdatesystem', {data: {system: system!}});
  };
  const getAppsettingsdata = async () => {
    try {
      setLoading(true)
    const appsettings = await $Get(`otdr/settings/app-settings`);
    if (appsettings?.status == 200) {
      let appsettingsdata = await appsettings?.json();
      setSystem(appsettingsdata?.system);
    }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
    
  };

  useEffect(() => {
    getAppsettingsdata();
  }, []);
  const onResetButtonClick = () => {
    setSystem({
      break_strategy: 'skip',
      fiber_test_setup_definition_strategy: 'both',
      data_save_policy: 'do_not_save',
      test_type: 'monitoring',
    });
  };
  
  if(state?.SettingsUpdatesystem?.httpRequestStatus === 'loading' || loading){
    return <h1>loading ...</h1>
  }
  return (
    <SystemSettingsMain
      onResetButtonClick={onResetButtonClick}
      onSaveButtonClick={onSaveButtonClick}>
      <div className="flex flex-col gap-y-4">
        <Rowinput name="Break Strategy">
          <Select
            value={system?.break_strategy}
            onChange={e => {
              let old = {...system!};
              old.break_strategy = e.target.value.toLowerCase();
              setSystem(old);
            }}
            className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]">
            <option value="" className="hidden ">
              {system?.break_strategy}
            </option>
            <option value={undefined} className="hidden">
              {system?.break_strategy}
            </option>
            <option>Continue</option>
            <option>Skip</option>
          </Select>
        </Rowinput>

        <Rowinput name="Fiber Test Setup Definition Strategy">
          <Select
            value={system?.fiber_test_setup_definition_strategy}
            onChange={e => {
              let old = {...system!};
              old.fiber_test_setup_definition_strategy =
                e.target.value.toLowerCase();
              setSystem(old);
            }}
            className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]">
            <option value="" className="hidden ">
              {system?.fiber_test_setup_definition_strategy}
            </option>
            <option value={undefined} className="hidden">
              {system?.fiber_test_setup_definition_strategy}
            </option>
            <option>none</option>
            <option>monitoring_only</option>
            <option>both</option>
          </Select>
        </Rowinput>

        <Rowinput name="Data Save Policy">
          <Select
            value={system?.data_save_policy}
            onChange={e => {
              let old = {...system!};
              old.data_save_policy = e.target.value.toLowerCase();
              setSystem(old);
            }}
            className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]">
            <option value="" className="hidden">
              {system?.data_save_policy}
            </option>
            <option value={undefined} className="hidden">
              {system?.data_save_policy}
            </option>

            <option>do_not_save</option>
            <option>save</option>
          </Select>
        </Rowinput>

        <Rowinput name="Test Type">
          <Select
            value={system?.test_type}
            onChange={e => {
              let old = {...system!};
              old.test_type = e.target.value.toLowerCase();
              setSystem(old);
            }}
            className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]">
            <option value="" className="hidden">
              {system?.test_type}
            </option>
            <option value={undefined} className="hidden">
              {system?.test_type}
            </option>
            <option>monitoring</option>
            <option>maintenance</option>
          </Select>
        </Rowinput>
      </div>
    </SystemSettingsMain>
  );
};

export default SystemPage;
