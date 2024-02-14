import {FC, useEffect} from 'react';
import ConditionGroup from './ConditionGroup';
import {SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '~/store';
import {$Put} from '~/util/requestapi';
import {toast} from 'react-toastify';
const AlarmTypeDefinitionPage: FC = () => {
  const params = useParams();
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  const updatedefinition = async () => {
    const response = await $Put(`otdr/alarm/${params.alarmId}`, {
      alarm_definition: {
        low_severity: {
          conditions:
            alarmtypedetail.alarm_definition!.low_severity!.conditions!.map(
              data => ({
                parameter: data.parameter,
                operator: data.operator,
                coef: data.coef,
                value: data.value,
                logical_operator: data.logical_operator,
              }),
            ),
          fault: alarmtypedetail.alarm_definition!.low_severity!.fault,
        },
        medium_severity: {
          conditions:
            alarmtypedetail.alarm_definition!.medium_severity!.conditions!.map(
              data => ({
                parameter: data.parameter,
                operator: data.operator,
                coef: data.coef,
                value: data.value,
                logical_operator: data.logical_operator,
              }),
            ),
          fault: alarmtypedetail.alarm_definition!.medium_severity!.fault,
        },
        high_severity: {
          conditions:
            alarmtypedetail.alarm_definition!.high_severity!.conditions!.map(
              data => ({
                parameter: data.parameter,
                operator: data.operator,
                coef: data.coef,
                value: data.value,
                logical_operator: data.logical_operator,
              }),
            ),
          fault: alarmtypedetail.alarm_definition!.high_severity?.fault!,
        },
      },
    });
    if (response.status == 201) {
      toast('با موفقیت انجام شد', {type: 'success',autoClose:1000});
    } else {
      toast('با خطا مواجه شد', {type: 'error',autoClose:1000});
    }
  };
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex w-4/5 flex-grow flex-col gap-y-8">
        <ConditionGroup
          title="Low Severity Condition"
          conditions={
            alarmtypedetail?.alarm_definition?.low_severity?.conditions
          }
        />

        <ConditionGroup
          title="Medium Severity Condition"
          conditions={
            alarmtypedetail?.alarm_definition?.medium_severity?.conditions
          }
        />

        <ConditionGroup
          title="High Severity Condition"
          conditions={
            alarmtypedetail?.alarm_definition?.high_severity?.conditions
          }
        />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={updatedefinition} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeDefinitionPage;
