import {FC, Fragment, useEffect, useState} from 'react';
import {IoAddOutline, IoTrashOutline} from 'react-icons/io5';
import {Select} from '~/components';
import {
  alarmtypedetailtype,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {deepcopy} from '~/util';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
type Props = {
  title?: string;
  conditions: any;

  // {
  //       parameter: string;
  //       operator: '=' | '!=';
  //       value: string;
  //       andOr: 'AND' | 'OR';
  //       disabled?: boolean;
  //       coef: number;
  //     }[] | undefined;
};
[];
const parameteroptins = [
  {label: 'Switch Status'},
  {label: 'OTDR Status'},
  {label: 'Switching Status'},
  {label: 'Applying Test Parameters'},
  {label: 'Test Execution'},
  {label: 'Receiving Results'},
  {label: 'RTU Port Status'},
  {label: 'Link Length'},
  {label: 'Optical Route Length'},
  {label: 'Link Loss'},
  {label: 'Optical Route Loss'},
  {label: 'ORL'},
  {label: 'Noise Floor'},
  {label: 'Splice Loss'},
  {label: 'Connector Loss'},
  {label: 'Splice Reflectance'},
  {label: 'Connector Reflectance'},
  {label: 'Number of Events'},
  {label: 'Event Location'},
  {label: 'Event Type'},
  {label: 'Event Loss'},
  {label: 'Event Reflectance'},
  {label: 'Valid Available'},
  {label: 'Optical Route Reference'},
];

const Operatoroptions = [
  {label: '='},
  {label: '!='},
  {label: '>'},
  {label: '<'},
];

const andoroptions = [
  {label: 'AND', value: 'AND'},
  {label: 'OR', value: 'OR'},
  {label: 'XOR', value: 'XOR'},
];

const Faultoptins = [{label: 'Yes'}, {label: 'No'}];

// **************************************************************
const ConditionGroup: FC<Props> = ({title, conditions}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const [titlesecurity, setTitlesecurity] = useState('');
  useEffect(() => {
    setTitlesecurity(title!);
  }, []);
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  useEffect(() => {}, []);

  const security = () => {
    if (title == 'Low Severity Condition') {
      return 'low_severity';
    } else if (title == 'Medium Severity Condition') {
      return 'medium_severity';
    } else {
      return 'high_severity';
    }
  };

  const Add = () => {
    const alarmsdetailCopy = deepcopy(alarmtypedetail);
    alarmsdetailCopy!.alarm_definition![security()]!.conditions!.push({
      index:
        alarmsdetailCopy!.alarm_definition![security()]!.conditions!.length,
      parameter: 'Switch Status',
      operator: '=',
      value: 'Offline',
      logical_operator: 'AND',
      coef: 1,
    });
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const DeleteRow = (index: number) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
      const finLowindex =
        alarmsdetailCopy!.alarm_definition![security()]!.conditions!.findIndex(
          data => data.index == index,
        );
      alarmsdetailCopy!.alarm_definition![security()]!.conditions!.splice(
        finLowindex,
        1,
      );
      dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const changeandor = (name: string, index: number) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    const finLowindex = alarmsdetailCopy!.alarm_definition![
      security()
    ]!.conditions!.findIndex(data => data.index == index);
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.logical_operator = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const changeParameter = (name: string, index: number) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    const finLowindex = alarmsdetailCopy!.alarm_definition![
      security()
    ]!.conditions!.findIndex(data => data.index == index);
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.parameter = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const changeoperator = (name: string, index: number) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    const finLowindex = alarmsdetailCopy!.alarm_definition![
      security()
    ]!.conditions!.findIndex(data => data.index == index);
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.operator = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const changevalue = (name: string, index: number) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    const finLowindex = alarmsdetailCopy!.alarm_definition![
      security()
    ]!.conditions!.findIndex(data => data.index == index);
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.value = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const changeFault = (name: string) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    alarmsdetailCopy!.alarm_definition![security()]!.fault = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };
  return (
    <div className="flex flex-col gap-y-6 rounded-lg bg-arioCyan px-6 py-4">
      <div className="flex flex-row items-center">
        <span className="flex-grow font-semibold">{title}</span>
        <span className="mr-[10px]">Fault</span>
        <Select
          onChange={e => {
            changeFault(e.target.value)
          }}
          value={alarmtypedetail!.alarm_definition![security()]!.fault}
          className="mr-[50px] w-[100px] disabled:text-gray-400 disabled:opacity-100">
          {Faultoptins.map(data => (
            <option>{data.label}</option>
          ))}
        </Select>
        <span className="flex flex-row">
          <IoAddOutline
            onClick={Add}
            className="cursor-pointer text-2xl text-green-500 active:text-green-300"
          />
          <span>Add</span>
        </span>
      </div>
      <div className="grid grid-cols-11 gap-y-2">
        <span className="col-span-3">Parameter</span>
        <span className="col-span-2">Operator</span>
        <span className="col-span-3">Value</span>
        <span className="col-span-2">AND/OR</span>
        <span className="col-span-1 flex justify-center">Delete</span>

        {conditions?.map((cond: any, index: number) => (
          <Fragment key={index}>
            {/* Parameter */}
            <div className="col-span-3">
              <Select
                onChange={e => {
                  changeParameter(e.target.value, cond.index);
                }}
                value={cond.parameter}
                className="w-3/5 disabled:text-gray-400 disabled:opacity-100">
                {parameteroptins.map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            {/* Operator */}
            <div className="col-span-2">
              <Select
                onChange={e => {
                  changeoperator(e.target.value, cond.index);
                }}
                value={cond.operator}
                className="w-3/5 disabled:text-gray-400 disabled:opacity-100">
                {Operatoroptions.map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            {/* Value */}
            <div className="col-span-3">
              <Select
                onChange={e => {
                  changevalue(e.target.value, cond.index);
                }}
                value={cond.value}
                className="w-3/5 disabled:text-gray-400 disabled:opacity-100">
                {Operatoroptions.map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            {/* AND / OR */}
            <div className="col-span-2">
              <Select
                onChange={e => {
                  changeandor(e.target.value, cond.index);
                }}
                value={cond.logical_operator}
                className="w-26">
                {andoroptions.map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            {/* Delete */}
            <div className="col-span-1 flex justify-center">
              <IoTrashOutline
                onClick={() => DeleteRow(cond.index)}
                size={24}
                aria-disabled={false}
                className="cursor-pointer text-red-500 active:text-red-300"
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ConditionGroup;
