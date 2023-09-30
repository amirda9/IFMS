import {ReactNode, useState} from 'react';
import GeneralLoadingSpinner from '../loading/GeneralLoadingSpinner';
import classNames from '~/util/classNames';
import { BsChevronDown } from 'react-icons/bs';

export type ColType = {label: string; size?: string; sort?: boolean};

export type ItemType<C extends string, DC extends C | never> = Record<
  Exclude<C, DC>,
  ReactNode
> &
  Partial<Record<DC, any>> &
  Record<string, any>;

type PropsType<
  C extends string,
  DC extends C | never,
  Item extends ItemType<C, DC>,
> = {
  dynamicColumns?: DC[];
  renderDynamicColumn?: (data: {
    key: DC;
    value: Item;
    index: number;
  }) => ReactNode;
  cols: Record<C, ColType>;
  items: Array<Item>;
  containerClassName?: string;
  loading?: boolean;
  keyExtractor?: (value: Item) => string;
  bordered?: boolean;
  tabicon?:string[];
  onclicktitle?:Function
};
const Table = <
  C extends string,
  Item extends ItemType<C, DC>,
  DC extends C | never = never,
>({
  items,
  cols,
  tabicon,
  dynamicColumns = [],
  renderDynamicColumn,
  containerClassName,
  loading,
  keyExtractor,
  bordered,
  onclicktitle=()=>{}
}: PropsType<C, DC, Item>) => {
  const headerItems = Object.entries(cols) as Array<[C, ColType]>;
  const [sortalfabet,setSortalfabet]=useState(true)

  const renderHeader = ([key, col]: [C, ColType]) => (
    <th
    onClick={()=>{onclicktitle(col.label,sortalfabet),tabicon && tabicon?.indexOf(col.label) > -1?setSortalfabet(!sortalfabet):null}}
      key={key}
      className={classNames(
        col.size,
        bordered
          ? 'border-b border-r border-gray96 last:border-r-0'
          : 'border-r border-[#969696] border-[1px] border-t-[0px] last:border-r-[0px] first:border-l-[0px]',
        'bg-blueLight py-1 cursor-pointer font-normal text-sm border-[#969696] border-[1px] relative border-t-[0px]',
      )}>
      {col.label}
{tabicon && tabicon?.indexOf(col.label) > -1?
<>
{sortalfabet?
  <BsChevronDown  className='absolute right-[5px] top-[8px]' />
:
<BsChevronDown  className='absolute rotate-180 right-[5px] top-[8px]' />
}

</>
 
:null
}
         

 
    </th>
  );

  const renderRow = (row: Item, index: number) => (
    <tr
      className={classNames(
        '[&_td]:bg-white [&_td]:py-1',
        bordered && 'border-b border-gray96 last:border-b-0',
      )}
      key={keyExtractor ? keyExtractor(row) : Object.values(row).join('')}>
      {headerItems.map(([key]) => (
        <td
          key={key}
          className={classNames(
            bordered && 'border-r border-gray96 last:border-r-0',
          )}>
          {dynamicColumns?.includes(key as DC)
            ? renderDynamicColumn?.({key: key as DC, value: row, index})
            : row[key as Exclude<C, DC>]}
           
        </td>
    
      ))}
         
    </tr>
  );

  return (
    <div
      className={classNames(
        'overflow-hidden bg-white',
        bordered
          ? 'rounded-t-lg border border-gray96'
          : 'rounded-md border border-black',
        containerClassName,
      )}>
      <table className="max-h-full w-full rounded-lg [&_td]:text-center">
        <thead>
          <tr
            className={classNames(
              !bordered &&
                '[&_td]:border-b [&_td]:border-r [&_td]:!border-goodGray relative',
            )}>
            {headerItems.map(renderHeader)}
         
          </tr>
     
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headerItems.length}>
                <GeneralLoadingSpinner />
              </td>
            </tr>
          ) : (
            items.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
