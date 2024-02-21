import {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Select} from '~/components';
import {RootState} from '~/store';
import {
  changeAutomaticEventDate,
  setSelectedautomaticEvent,
} from '~/store/slices/alarmstypeslice';
import classNames from '~/util/classNames';

type Props = {
  label: string;
  hasCheckbox?: boolean;
  className?: string;
  selectsClassName?: string;
  name:
    | 'delete_resolved_after'
    | 'delete_in_progress_after'
    | 'delete_timeout_after'
    | 'timeout_pending_after'
    | 'timeout_acknowledged_after'
    | 'escalate_acknowledged_after'
    | 'escalate_pending_after';
  parentName: 'escalate_alarm' | 'timeout_alarm' | 'delete_alarm';
};

const ScheduleSelector: FC<Props> = ({
  label,
  hasCheckbox = true,
  className,
  selectsClassName,
  parentName,
  name,
}) => {
  const {alarmtypedetail, selectedautomaticevents} = useSelector(
    (state: RootState) => state.alarmtypes,
  );
  const dispatch = useDispatch();
  return (
    <div className={classNames('flex items-center', className)}>
      {hasCheckbox && (
        <span className="mr-2">
          <input
            checked={
              selectedautomaticevents.findIndex(data => data == name) > -1?true:false
            }
            onChange={() => dispatch(setSelectedautomaticEvent(name))}
            type="checkbox"
          />
        </span>
      )}

      <span className="flex-grow">{label}</span>

      <div className="flex flex-row justify-between gap-x-8">
        <Select
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value={alarmtypedetail.automatic_events[parentName][name]['days']! || 0}
          disabled={
            selectedautomaticevents.findIndex(data => data == name) > -1
              ? false
              : true
          }
          onChange={e =>
            dispatch(
              changeAutomaticEventDate({
                inputname: 'days',
                parentName: parentName,
                name: name,
                value: Number(e.target.value),
              }),
            )
          }
          className={classNames('w-16', selectsClassName)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Select>
        <Select
          disabled={
            selectedautomaticevents.findIndex(data => data == name) > -1
              ? false
              : true
          }
          onChange={e =>
            dispatch(
              changeAutomaticEventDate({
                inputname: 'hours',
                parentName: parentName,
                name: name,
                value: Number(e.target.value),
              }),
            )
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value={alarmtypedetail.automatic_events[parentName][name]['hours']!}
          className={classNames('w-16', selectsClassName)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Select>
        <Select
          disabled={
            selectedautomaticevents.findIndex(data => data == name) > -1
              ? false
              : true
          }
          onChange={e =>
            dispatch(
              changeAutomaticEventDate({
                inputname: 'minutes',
                parentName: parentName,
                name: name,
                value: Number(e.target.value),
              }),
            )
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value={alarmtypedetail.automatic_events[parentName][name]['minutes']!}
          className={classNames('w-16', selectsClassName)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Select>
      </div>
    </div>
  );
};

export default ScheduleSelector;
