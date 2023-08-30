import {Description, Select} from '~/components';
import SystemSettingsMain from '../SystemSettingsMain';

const SystemPage = () => {
  return (
    <SystemSettingsMain>
      <div className="flex flex-col gap-y-4">
        <Description label="Break Strategy" labelClassName="w-80">
          <Select className="w-1/5">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>Continue</option>
            <option>Skip</option>
          </Select>
        </Description>

        <Description
          label="Fiber Test Setup Definition Strategy"
          labelClassName="w-80">
          <Select className="w-1/5">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>None</option>
            <option>Monitoring Only</option>
            <option>Both</option>
          </Select>
        </Description>

        <Description label="Data Save Policy" labelClassName="w-80">
          <Select className="w-1/5">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>Save Trace File</option>
            <option>Don’t Save Trace File</option>
          </Select>
        </Description>

        <Description label="Test Type" labelClassName="w-80">
          <Select className="w-1/5">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>Monitoring</option>
            <option>Proactive Maintenance</option>
          </Select>
        </Description>

        <Description
          label="Degraded fiber Handeling Strategy"
          labelClassName="w-80">
          <Select className="w-1/5">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>Enabled</option>
            <option>Disable</option>
          </Select>
        </Description>
      </div>
    </SystemSettingsMain>
  );
};

export default SystemPage;
