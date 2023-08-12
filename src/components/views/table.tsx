import React, {ReactNode} from 'react';

type ColType = {label: string; size?: string; sort?: boolean};

type ItemType<C extends string, DC extends C | never> = Record<
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
  width?: string;
  loading?: boolean;
  keyExtractor?: (value: Item) => string;
};
const Table = <
  C extends string,
  Item extends ItemType<C, DC>,
  DC extends C | never = never,
>({
  items,
  cols,
  dynamicColumns = [],
  renderDynamicColumn,
  width = 'w-full',
  loading,
  keyExtractor,
}: PropsType<C, DC, Item>) => {
  const headerItems = Object.entries(cols) as Array<[key: C, value: ColType]>;

  const renderHeader = ([key, col]: [key: C, col: ColType]) => {
    return (
      <td key={key} className={`${col.size ? col.size : ''} `}>
        {col.label}
      </td>
    );
  };

  const renderRow = (row: Item, index: number) => {
    return (
      <tr
        className="[&_td]:bg-white [&_td]:py-1 last:[&_td]:last:rounded-br-md first:[&_td]:last:rounded-bl-md"
        key={keyExtractor ? keyExtractor(row) : Object.values(row).join('')}>
        {headerItems.map(([key]) => {
          return (
            <td key={key}>
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
    <div className={`h-full ${width} rounded-md border border-black bg-white`}>
      {loading ? (
        'loading'
      ) : (
        <table className="max-h-full w-full [&_td]:text-center">
          <thead>
            <tr
              className="[&_td]:border-r [&_td]:!border-goodGray
           [&_td]:border-b [&_td]:bg-blueLight [&_td]:py-1 first:[&_td]:rounded-tl-md last:[&_td]:rounded-tr-md">
              {headerItems.map(renderHeader)}
            </tr>
          </thead>
          <tbody>{items.map(renderRow)}</tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
