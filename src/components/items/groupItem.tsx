import React, {FC, useState} from 'react';

type StateType = {
  open: boolean;
  selected: Record<string, boolean>;
};

type PropsType = {
  label: string;
  items: Array<{label: string; value: string | number}>;
};
const GroupItem: FC<PropsType> = ({items, label}) => {
  const [state, setState] = useState<StateType>({
    open: false,
    selected: {},
  });
  const keys = Object.keys(state.selected);

  const selectAll = () => {
    if (keys.length >= items.length) {
      setState({...state, selected: {}});
    } else {
      const selected: Record<string, boolean> = {};
      items.forEach(item => {
        selected[item.value] = true;
      });
      setState({...state, selected});
    }
  };
  const selectItem = (value: string | number) => () => {
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
        <input
          type="checkbox"
          checked={keys.length === items.length}
          onChange={selectAll}
        />
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
        <div className="my-1 ml-16">
          {items.map(item => (
            <div className="my-2 flex flex-row items-center" key={item.label}>
              <input
                checked={item.value in state.selected}
                type="checkbox"
                className="mr-4 cursor-pointer"
                onChange={selectItem(item.value)}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default GroupItem;
