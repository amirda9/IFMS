import {FC} from 'react';

type Item = {
  label: string;
  items?: Item[];
};

type Props = {
  title: string;
  titleCheckbox?: boolean;
  items: Item[];
};

const renderItemGroup = (item: Item) => {
  return (
    <>
      <div className='pb-2'>
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item.items && (
        <div className="pl-4">{item.items.map(renderItemGroup)}</div>
      )}
    </>
  );
};

const AlarmContentBox: FC<Props> = ({title, titleCheckbox, items}) => {
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div>
        {titleCheckbox && (
          <span className='mr-2'>
            <input type="checkbox" />
          </span>
        )}
        <span>{title}</span>
      </div>
      <div className="flex-grow border border-black bg-white p-4">
        {items.map(renderItemGroup)}
      </div>
    </div>
  );
};

export default AlarmContentBox;
