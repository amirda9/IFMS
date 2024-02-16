import {FC} from 'react';
import {Select, SimpleBtn} from '~/components';
import ScheduleSelector from './ScheduleSelector';

const AlarmTypeEventPage: FC = () => {
  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <div className="flex w-3/5 flex-grow flex-col gap-y-8">
        {/* --- */}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Escalate Alarm</h4>
          <div className="flex gap-x-2 items-center">
            <span>
              <input type="checkbox" />
            </span>

            <span className='mr-4'>
              Escalate Alarms Only If Alarm Severity Is At Least
            </span>

            <Select>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Select>
          </div>

          <div className="flex justify-end gap-x-8 items-center">
            <span className='w-16 text-center'>Days</span>
            <span className='w-16 text-center'>Hours</span>
            <span className='w-16 text-center'>Minutes</span>
          </div>

          <ScheduleSelector label="Escalate Alarms only if Alarm Severity is at least" />
          <ScheduleSelector label="Escalate Alarms only if Alarm Severity is at least" />
        </div>

        {/* ---*/}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Time Out Alarm</h4>
          <ScheduleSelector label="Time Out Pending Alarms after" />
          <ScheduleSelector label="Time Out Acknowledged Alarms after" />
        </div>

        {/* --- */}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Delete Alarm</h4>
          <ScheduleSelector label="Delete Resolved Alarms after" />
          <ScheduleSelector label="Delete Ignored or Abandoned Alarms after" />
          <ScheduleSelector label="Delete Time Out Alarms after" />
          <ScheduleSelector label="Delete Obsolete Alarms after" />
        </div>
      </div>

      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn type="submit">Save</SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeEventPage;
