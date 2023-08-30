import {Dispatch, SetStateAction} from 'react';
import {SimpleBtn, Table} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {ColType, ItemType} from '~/components/views/Table';

type Props<
  C extends string,
  DC extends C | never,
  Item extends ItemType<C, DC>,
> = {
  tableColumns: Record<C, ColType>;
  noAccessItems: Array<Item>;
  accessedItems: Array<Item>;
  noAccessTableLoading?: boolean;
  accessedTableLoading?: boolean;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
  handleNoAccessCheckboxClick: (item: Item) => void;
  handleAccessedCheckboxClick: (item: Item) => void;
  noAccessSelected: string[];
  accessedSelected: string[];
  handleAddClick: () => void;
  handleRemoveClick: () => void;
  handleSaveClick: () => void;
};

const EditAccessTablesView = <
  C extends string,
  Item extends ItemType<C, DC>,
  DC extends C | never = never,
>({
  tableColumns,
  noAccessItems,
  accessedItems,
  noAccessTableLoading,
  accessedTableLoading,
  setIsEditing,
  handleNoAccessCheckboxClick,
  handleAccessedCheckboxClick,
  noAccessSelected,
  accessedSelected,
  handleAddClick,
  handleRemoveClick,
  handleSaveClick,
}: Props<C | "select", DC, Item>) => {
  return (
    <>
      <div className="flex flex-grow items-center gap-x-4">
        <Table
          cols={tableColumns}
          items={noAccessItems}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleNoAccessCheckboxClick(value)}
              checked={noAccessSelected.includes(value.id)}
            />
          )}
          loading={noAccessTableLoading}
          containerClassName="flex-grow h-full"
        />
        <DoubleSideButtonGroup
          onClickRightButton={handleAddClick}
          onClickLeftButton={handleRemoveClick}
        />
        <Table
          cols={tableColumns}
          items={accessedItems}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleAccessedCheckboxClick(value)}
              checked={accessedSelected.includes(value.id)}
            />
          )}
          loading={accessedTableLoading}
          containerClassName="flex-grow h-full"
        />
      </div>
      <div className="flex gap-x-2 self-end">
        <SimpleBtn onClick={handleSaveClick}>Save</SimpleBtn>
        <SimpleBtn
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(false);
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default EditAccessTablesView;
