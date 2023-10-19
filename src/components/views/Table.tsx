import {ReactNode, useEffect, useState} from 'react';
import GeneralLoadingSpinner from '../loading/GeneralLoadingSpinner';
import classNames from '~/util/classNames';
import {BsChevronDown} from 'react-icons/bs';

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
  tabbodybg?: {name: string; bg: string}[];
  keyExtractor?: (value: Item) => string;
  bordered?: boolean;
  tabicon?: string;
  onclicktitle?: Function;
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
  tabbodybg = [],
  keyExtractor,
  bordered,
  onclicktitle = () => {},
}: PropsType<C, DC, Item>) => {
  const headerItems = Object.entries(cols) as Array<[C, ColType]>;
  const [selectedtab, setselectedtab] = useState<string>(tabicon || '');
  const [sortalfabet, setSortalfabet] = useState(true);
  const changeTab = (name: string) => {
    if (name == selectedtab) {
      onclicktitle(name, sortalfabet);
      setSortalfabet(!sortalfabet);
    } else {
      setselectedtab(name);
      onclicktitle(name, false);
      setSortalfabet(true);
    }
  };
  // tabicon && tabicon == col.label?setSortalfabet(!sortalfabet):null
  const renderHeader = ([key, col]: [C, ColType]) => (
    <th
      onClick={() => {
        changeTab(col.label);
      }}
      key={key}
      className={classNames(
        col.size,
        bordered
          ? 'border-b border-r border-gray96 last:border-r-0'
          : 'border-[1px] border-r border-t-[0px] border-[#969696] first:border-l-[0px] last:border-r-[0px]',
        'relative cursor-pointer border-[1px] border-t-[0px] border-[#969696] bg-blueLight py-1 text-sm font-normal',
      )}>
      {col.label}
      {tabicon == col.label ? (
        <>
          {sortalfabet ? (
            <BsChevronDown className="absolute right-[5px] top-[8px]" />
          ) : (
            <BsChevronDown className="absolute right-[5px] top-[8px] rotate-180" />
          )}
        </>
      ) : null}
    </th>
  );

  const renderRow = (row: Item, index: number) => {

    return (
      <tr
        className={classNames(
          '[&_td]:py-1',
          bordered && 'border-b border-gray96 last:border-b-0',
        )}
        key={keyExtractor ? keyExtractor(row) : Object.values(row).join('')}>
        {headerItems.map(([key]) => {
            let BG =row.tabbodybg?.find((data: any) => data.name == key)?.bg || 'white';
          return (
            <td
              style={{backgroundColor: BG}}
              key={key}
              className={classNames(
                bordered && `border-r  border-gray96 last:border-r-0`,
              )}>
              {dynamicColumns?.includes(key as DC)
                ? renderDynamicColumn?.({key: key as DC, value: row, index})
                : row[key as Exclude<C, DC>]}
            </td>
          );
        })}
      </tr>
    );
  };

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
                'relative [&_td]:border-b [&_td]:border-r [&_td]:!border-goodGray',
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
