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
  // conditions: any;

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
const onlineoflineOptions = [{label: 'Offline'}, {label: 'Online'}];
const SuccessOptions = [{label: 'Successful'}, {label: 'Unsuccessful'}];
const RTUPortOptions = [{label: 'Connected'}, {label: 'Open'}];
const ReferenceNominalOptions = [
  {label: 'Reference Value'},
  {label: 'Nominal Value'},
];
const ReferenceOptions = [{label: 'Reference Value'}];
const OpticalRouteOptions = [{label: 'Valid'}, {label: 'Available'}];
const equaloperatorOptions = [{label: '='}];
const alloperatorOptions = [
  {label: '='},
  {label: '!='},
  {label: '<'},
  {label: '>'},
];
const twoOptions = [{label: '='}, {label: '!='}];
// **************************************************************
const ConditionGroup: FC<Props> = ({title}) => {
  const [allconditions,setAllconditions]=useState([])
  const dispatch = useDispatch();
  const params = useParams();
  const [titlesecurity, setTitlesecurity] = useState('');
  useEffect(() => {
    setTitlesecurity(title!);
    // setAllconditions(conditions)
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
      coef: 0,
    });
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const DeleteRow = (index: number) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    const finLowindex = alarmsdetailCopy!.alarm_definition![
      security()
    ]!.conditions!.findIndex(data => data.index == index);
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
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.operator = operatoroptions(name)[0].label;
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.value = valueoptions(name)[0].label;
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


  const changecoef=(name: number, index: number)=>{
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    const finLowindex = alarmsdetailCopy!.alarm_definition![
      security()
    ]!.conditions!.findIndex(data => data.index == index);
    alarmsdetailCopy!.alarm_definition![security()]!.conditions[
      finLowindex
    ]!.coef = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  }

  const changeFault = (name: string) => {
    const alarmsdetailCopy: alarmtypedetailtype = deepcopy(alarmtypedetail);
    alarmsdetailCopy!.alarm_definition![security()]!.fault = name;
    dispatch(setalarmsdetail(alarmsdetailCopy));
  };

  const valueoptions = (parametername: string) => {
    if (parametername == 'Switch Status' || parametername == 'OTDR Status') {
      return onlineoflineOptions;
    } else if (
      parametername == 'Switching Status' ||
      parametername == 'Applying Test Parameters' ||
      parametername == 'Test Execution' ||
      parametername == 'Receiving Results'
    ) {
      return SuccessOptions;
    } else if (parametername == 'RTU Port Status') {
      return RTUPortOptions;
    } else if (parametername == 'Optical Route Reference') {
      return OpticalRouteOptions;
    } else if (
      parametername == 'Link Length' ||
      parametername == 'Optical Route Length' ||
      parametername == 'Link Loss' ||
      parametername == 'Optical Route Loss' ||
      parametername == 'Splice Loss' ||
      parametername == 'Connector Loss' ||
      parametername == 'Connector Loss'
    ) {
      return ReferenceNominalOptions;
    } else {
      return ReferenceOptions;
    }
  };

  const operatoroptions = (operatorname: string) => {
    if (
      operatorname == 'Switch Status' ||
      operatorname == 'OTDR Status' ||
      operatorname == 'Switching Status' ||
      operatorname == 'Applying Test Parameters' ||
      operatorname == 'Test Execution' ||
      operatorname == 'Receiving Results' ||
      operatorname == 'RTU Port Status'
    ) {
      return equaloperatorOptions;
    } else if (operatorname == 'Optical Route Reference') {
      return twoOptions;
    } else {
      return alloperatorOptions;
    }
  };

  const hasecoef = (parametername: string) => {
    if (
      parametername == 'Link Length' ||
      parametername == 'Optical Route Length' ||
      parametername == 'Link Loss' ||
      parametername == 'Optical Route Loss' ||
      parametername == 'ORL' ||
      parametername == 'Noise Floor' ||
      parametername == 'Splice Loss' ||
      parametername == 'Connector Loss' ||
      parametername == 'Splice Reflectance' ||
      parametername == 'Connector Reflectance' ||
      parametername == 'Event Location' ||
      parametername == 'Event Loss' ||
      parametername == 'Event Reflectance'
    ) {
      return true;
    } else {
      return false;
    }
  };


  return (
    <div className="flex flex-col gap-y-6 rounded-lg bg-arioCyan px-6 py-4">
      <div className="flex flex-row items-center">
        <span className="flex-grow font-semibold">{title}</span>
        <span className="mr-[10px]">Fault</span>
        <Select
          onChange={e => {
            changeFault(e.target.value);
          }}
          value={alarmtypedetail!.alarm_definition![security()]!.fault || "No"}
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
        <span className="col-span-3 text-center">Parameter</span>
        <span className="col-span-2 text-center">Operator</span>
        <span className="col-span-3 text-center">Value</span>
        <span className="col-span-2">AND/OR</span>
        <span className="col-span-1 flex justify-center">Delete</span>

        {alarmtypedetail!.alarm_definition![
                    security()
                  ]!.conditions?.map((cond: any, index: number) => (
          <Fragment key={index}>
            {/* Parameter */}
            <div className="col-span-3">
              <Select
                onChange={e => {
                  changeParameter(e.target.value, cond.index);
                }}
                value={cond.parameter}
                className="w-full disabled:text-gray-400 disabled:opacity-100">
                {parameteroptins.map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            {/* Operator */}
            <div className="col-span-2 text-center">
              <Select
                onChange={e => {
                  changeoperator(e.target.value, cond.index);
                }}
                value={cond.operator}
                className="w-4/5 disabled:text-gray-400 disabled:opacity-100">
                {operatoroptions(
                  alarmtypedetail!.alarm_definition![
                    security()
                  ]!.conditions!.find(data => data.index == cond.index)!
                    .parameter,
                ).map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            {/* Value */}

            {hasecoef(
              alarmtypedetail!.alarm_definition![security()]!.conditions!.find(
                data => data.index == cond.index,
              )!.parameter
            ) ? (
              <div className="fle-row  col-span-3 flex justify-between">
                <input
                value={cond.coef}
                 onChange={e => {
                  changecoef(Number(e.target.value), cond.index);
                }}
                  type="number"
                  className="w-[36%] rounded-[7px] border-[1px] pl-[10px] border-black disabled:text-gray-400 disabled:opacity-100"
                />
                x
                <Select
                  onChange={e => {
                    changevalue(e.target.value, cond.index);
                  }}
                  value={cond.value}
                  className="w-[57%] disabled:text-gray-400 disabled:opacity-100">
                  {valueoptions(
                    alarmtypedetail!.alarm_definition![
                      security()
                    ]!.conditions!.find(data => data.index == cond.index)!
                      .parameter,
                  )!.map(data => (
                    <option>{data.label}</option>
                  ))}
                </Select>
              </div>
            ) : (
              <div className="col-span-3 bg-[red] text-center">
                <Select
                  onChange={e => {
                    changevalue(e.target.value, cond.index);
                  }}
                  value={cond.value}
                  className="w-[90%] disabled:text-gray-400 disabled:opacity-100">
                  {valueoptions(
                    alarmtypedetail!.alarm_definition![
                      security()
                    ]!.conditions!.find(data => data.index == cond.index)!
                      .parameter,
                  )!.map(data => (
                    <option>{data.label}</option>
                  ))}
                </Select>
              </div>
            )}

            {/* AND / OR */}
            <div className="col-span-2">
              <Select
                onChange={e => {
                  changeandor(e.target.value, cond.index);
                }}
                value={cond.logical_operator}
                className="ml-[4px] w-[100px]">
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
