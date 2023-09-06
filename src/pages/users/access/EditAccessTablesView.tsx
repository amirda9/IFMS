import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
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
  handleNoAccessCheckboxClick,
  handleAccessedCheckboxClick,
  noAccessSelected,
  accessedSelected,
  handleAddClick,
  handleRemoveClick,
  handleSaveClick,
}: Props<C | 'select', DC, Item>) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('.', {state: {isEditingUserAccess: true}});
  }, []);

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
      <div className="flex gap-x-4 self-end">
        <SimpleBtn onClick={handleSaveClick}>Ok</SimpleBtn>
        <SimpleBtn
          onClick={() => {
            navigate('../access');
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default EditAccessTablesView;
