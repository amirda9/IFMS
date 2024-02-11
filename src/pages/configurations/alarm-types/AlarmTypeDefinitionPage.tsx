import {FC, useEffect} from 'react';
import ConditionGroup from './ConditionGroup';
import {SimpleBtn} from '~/components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

const AlarmTypeDefinitionPage: FC = () => {
  const params=useParams()
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);

  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-grow flex-col gap-y-8 w-4/5">
        <ConditionGroup title="Low Severity Condition" 
        conditions={alarmtypedetail?.alarm_definition?.low_severity?.conditions}
        />

        <ConditionGroup
          title="Medium Severity Condition"
          conditions={alarmtypedetail?.alarm_definition?.medium_severity?.conditions}
        />

        <ConditionGroup
          title="High Severity Condition"
          conditions={alarmtypedetail?.alarm_definition?.high_severity?.conditions}
        />

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

export default AlarmTypeDefinitionPage;
