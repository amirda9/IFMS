import {FC} from 'react';
import ConditionGroup from './ConditionGroup';
import {SimpleBtn} from '~/components';

const AlarmTypeDefinitionPage: FC = () => {
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-grow flex-col gap-y-8 w-4/5">
        <ConditionGroup title="Low Severity Condition" />

        <ConditionGroup
          title="Medium Severity Condition"
          conditions={[
            {
              parameter: 'Fault: Type',
              operator: '=',
              value: 'Break',
              andOr: 'AND',
            },
            {
              parameter: 'Fault: Status',
              operator: '!=',
              value: 'Cleared',
              andOr: 'AND',
            },
          ]}
        />

        <ConditionGroup
          title="High Severity Condition"
          conditions={[
            {
              parameter: 'Fault: Type',
              operator: '=',
              value: 'Break',
              andOr: 'AND',
              disabled: true,
            },
            {
              parameter: 'Fault: Status',
              operator: '!=',
              value: 'Cleared',
              andOr: 'AND',
              disabled: true,
            },
          ]}
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
