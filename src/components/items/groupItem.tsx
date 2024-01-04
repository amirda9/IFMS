import React, {FC, useState} from 'react';
import Checkbox from '../checkbox/checkbox';

type StateType = {
  open: boolean;
  selected: Record<string, boolean>;
};

type PropsType = {
  label: string;
  items: Array<{label: string; value: string | number}>;
  onSelect?: (item: string | number) => void;
  selected: Array<string | number>;
};
const GroupItem: FC<PropsType> = ({items, label, onSelect, selected}) => {
  console.log(items, 'items');

  const [state, setState] = useState<StateType>({
    open: false,
    selected: {},
  });
  const keys = Object.keys(state.selected);

  const selectAll = () => {
    if (keys.length >= items.length) {
      items.forEach(value => {
        if (selected.includes(value.value)) {
          onSelect?.(value.value);
        }
      });
      setState({...state, selected: {}});
    } else {
      const stateSelected: Record<string, boolean> = {};
      items.forEach(item => {
        stateSelected[item.value] = true;
      });
      items.forEach(value => {
        if (!selected.includes(value.value)) {
          onSelect?.(value.value);
        }
      });
      setState({...state, selected: stateSelected});
    }
  };
  const selectItem = (value: string | number) => () => {
    // const allvalues = [...state.values];
    // const index = allvalues.indexOf(id!);
    // if(allvalues.indexOf(id!) > -1){
    //   allvalues.splice(index, 1);
    // }else{
    //   allvalues.push(id!)
    // }

    onSelect?.(value);
    if (value in state.selected) {
      const selected = {...state.selected};
      delete selected[value];
      setState({...state, selected});
    } else {
      setState({
        ...state,
        selected: {...state.selected, [value]: true},
      });
    }
  };

  return (
    <div>
      <div className="flex h-6 flex-row items-center">
        <Checkbox
          checkstatus={items.every(value => selected.includes(value.value))}
          onclick={selectAll}
          iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
          classname={' border-[1px] text-[#18C047] border-[#000000] mr-[7px]'}
        />
        {/* <input
          type="checkbox"
          checked={items.every(value => selected.includes(value.value))}
          onChange={selectAll}
        /> */}
        <span
          className="mx-4 cursor-pointer select-none text-lg"
          onClick={() => {
            setState({...state, open: !state.open});
          }}>
          {state.open ? '-' : '+'}
        </span>
        <span>{label}</span>
      </div>
      {state.open ? (
        <div className="my-1 ml-16 mt-[-9px]">
          {items.map(item => (
            <div
              className="flex h-[50px] flex-row pt-[37px] ml-[-18px] items-start border-l-[1px] border-dashed border-black"
              key={item.label}>
                <div className='flex flex-row w-full items-center'>
                  <span className='mt-[-10px] mr-[5px]'>....</span>
                  <Checkbox
                checkstatus={selected.includes(item.value)}
                onclick={selectItem(item.value)}
                iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
                classname={
                  'border-[1px] text-[#18C047] border-[#000000] mr-[7px]'
                }
              />
               <span>{item.label}</span>
                </div>
            
              {/* <input
                checked={selected.includes(item.value)}
                type="checkbox"
                className="mr-4 cursor-pointer"
                onChange={selectItem(item.value)}
              /> */}
             
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default GroupItem;
