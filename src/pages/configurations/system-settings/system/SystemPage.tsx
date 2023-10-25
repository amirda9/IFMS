import {Description, Select} from '~/components';
import SystemSettingsMain from '../SystemSettingsMain';
import {ReactNode} from 'react';
type Rowinputtype = {
  name: string;
  children: ReactNode;
};

const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="flex w-[700px] flex-row justify-between mb-[6px]">
      <span className="w-[400px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};
// -------------------- main --------------------------- main ---------------------- main --------------------- main --------

const SystemPage = () => {
  return (
    <SystemSettingsMain>
      <div className="flex flex-col gap-y-4">
        <Rowinput name="Break Strategy">
        <Select  className="w-full">
            <option value="" className="hidden">
            Skip
            </option>
            <option value={undefined} className="hidden">
            Skip
            </option>
            <option>Continue</option>
            <option>Skip</option>
          </Select>
        </Rowinput>
        
        <Rowinput name="Fiber Test Setup Definition Strategy">
        <Select  className="w-full">
            <option value="" className="hidden">
            None
            </option>
            <option value={undefined} className="hidden">
            None
            </option>
            <option>None</option>
            <option>Monitoring Only</option>
            <option>Both</option>
          </Select>
        </Rowinput>

        <Rowinput name="Data Save Policy">
        <Select  className="w-full">
            <option value="" className="hidden">
            Data Save Policy
            </option>
            <option value={undefined} className="hidden">
            Data Save Policy
            </option>
            <option>Data Save Policy</option>
            <option>Don’t Save Trace File</option>
          </Select>
        </Rowinput>

        <Rowinput name="Test Type">
        <Select  className="w-full">
            <option value="" className="hidden">
            Monitoring
            </option>
            <option value={undefined} className="hidden">
            Monitoring
            </option>
            <option>Monitoring</option>
            <option>Maintenance</option>
          </Select>
        </Rowinput>
      </div>
    </SystemSettingsMain>
  );
};

export default SystemPage;
