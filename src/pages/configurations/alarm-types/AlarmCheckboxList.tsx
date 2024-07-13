import {FC, useEffect, useState} from 'react';
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
        </div>
        {item?.items?.map(item => (
          <div className="pl-4">
            <div className="pb-2">
              <span className="mr-2">
                <input
                disabled={(type == 'Primary' || type == "sending") && alarmtypedetail.alarm_content.secondary_source == item.label?true:(type == 'Primary' || type == "sending") && alarmtypedetail.alarm_content.secondary_source != item.label?false:alarmtypedetail.alarm_content.primary_source == item.label?true:!disabled}
                  checked={
                    type == 'Primary'
                      ? alarmtypedetail.alarm_content.primary_source ==
                        item.label
                      :type == 'Secondary'? alarmtypedetail.alarm_content.secondary_source ==
                        item.label:alarmtypedetail.alert_sending?.user?.findIndex((data:string)=> data == item.label)>-1 || false
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
                    } else if(type == 'Secondary') {
                      if(alarmtypedetail.alarm_content.secondary_source == item.label){
                        alarmtypedetailCopy.alarm_content.secondary_source =null
                       
                      }else{
                        alarmtypedetailCopy.alarm_content.secondary_source =
                        item.label;
                      }
             
                    }else{
                      if(alarmtypedetail.alert_sending!.user.findIndex((data:string)=> data == item.label)>-1){
                        alarmtypedetailCopy.alert_sending.user =alarmtypedetail.alert_sending!.user.filter((data)=> data != item.label)
                       
                      }else{
                        alarmtypedetailCopy.alert_sending!.user.push(item.label)
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
  useEffect(()=>{
if(alarmtypedetail?.alarm_content?.secondary_source?.length>0 && type == "Secondary"){
  setDisabled(true)
}
  },[])

   const onclicsecondery=()=>{
    if(disabled == true){
      let alarmtypedetailCopy=deepcopy(alarmtypedetail)
      alarmtypedetailCopy.alarm_content.secondary_source =""
 dispatch(setalarmsdetail(alarmtypedetailCopy))
    }
    setDisabled(!disabled)
  }
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      {(title || titleCheckbox) && (
        <div>
          {titleCheckbox && (
            <span className="mr-2">
              <input
              checked={disabled}
              onChange={()=> onclicsecondery()} type="checkbox" />
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
