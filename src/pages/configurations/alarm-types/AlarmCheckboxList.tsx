import {FC} from 'react';

type Item = {
  label: string;
  items?: Item[];
};

type Props = {
  title?: string;
  titleCheckbox?: boolean;
  items: Item[];
  type:string
};



const AlarmCheckboxList: FC<Props> = ({title, titleCheckbox, items,type}) => {
 
  const renderItemGroup = (item: Item) => {
    return (
      <>
        <div className="pb-2">
          <span className="mr-2">
            <input 
            onChange={()=>{
              if(type == "Primary"){
                alert("kk")
              }
            }}
            type="checkbox" />
          </span>
          <span>{item.label}</span>
        </div>
        {item?.items?.map(item => (
          <div className="pl-4">
            <div className="pb-2">
              <span className="mr-2">
                <input
                 onChange={()=>{
              if(type == "Primary"){
                alert("kk")
              }
            }}
                
                type="checkbox" />
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
              <input type="checkbox" />
            </span>
          )}
          {title && <span>{title}</span>}
        </div>
      )}
      <div className="flex-grow border border-black p-4 bg-white h-[652px]">
        {items.map(renderItemGroup)}
      </div>
    </div>
  );
};

export default AlarmCheckboxList;
