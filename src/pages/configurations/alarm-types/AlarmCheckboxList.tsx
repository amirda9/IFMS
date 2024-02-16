import {FC, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {setalarmsdetail} from '~/store/slices/alarmstypeslice';
import {deepcopy} from '~/util';

type Item = {
  label: string;
  items?: Item[];
};

type Props = {
  title?: string;
  titleCheckbox?: boolean;
  items: Item[];
  type: string;
};

const AlarmCheckboxList: FC<Props> = ({title, titleCheckbox, items, type}) => {
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  const [disabled,setDisabled]=useState(false)
  const dispatch = useDispatch();
  const renderItemGroup = (item: Item) => {
    return (
      <>
        <div className="pb-2">
          {/* <span className="mr-2">
            <input
              onChange={() => {
                if (type == 'Primary') {
                }
              }}
              type="checkbox"
            />
          </span>
          <span>{item.label}</span> */}
        </div>
        {item?.items?.map(item => (
          <div className="pl-4">
            <div className="pb-2">
              <span className="mr-2">
                <input
                disabled={type == 'Primary' || type == "sending"?false:!disabled}
                  checked={
                    type == 'Primary'
                      ? alarmtypedetail.alarm_content.primary_source ==
                        item.label
                      : alarmtypedetail.alarm_content.secondary_source ==
                        item.label
                  }
                  onChange={() => {
                    const alarmtypedetailCopy = deepcopy(alarmtypedetail);
                    if (type == 'Primary') {
                      if(alarmtypedetail.alarm_content.primary_source == item.label){
                        alarmtypedetailCopy.alarm_content.primary_source=null
                      }else{
                        alarmtypedetailCopy.alarm_content.primary_source =
                        item.label;
                      }
                    } else {
                      if(alarmtypedetail.alarm_content.secondary_source == item.label){
                        alarmtypedetailCopy.alarm_content.secondary_source =null
                       
                      }else{
                        alarmtypedetailCopy.alarm_content.secondary_source =
                        item.label;
                      }
             
                    }
                    dispatch(setalarmsdetail(alarmtypedetailCopy));
                  }}
                  type="checkbox"
                />
              </span>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      {(title || titleCheckbox) && (
        <div>
          {titleCheckbox && (
            <span className="mr-2">
              <input
              checked={disabled}
              onChange={()=> setDisabled(!disabled)} type="checkbox" />
            </span>
          )}
          {title && <span>{title}</span>}
        </div>
      )}
      <div className="h-[652px] flex-grow border border-black bg-white p-4">
        {items.map(renderItemGroup)}
      </div>
    </div>
  );
};

export default AlarmCheckboxList;
