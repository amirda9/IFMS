import {Dispatch, SetStateAction} from 'react';
import {useNavigate} from 'react-router-dom';
import {Description, SimpleBtn, Table} from '~/components';
import {ColType, ItemType} from '~/components/views/Table';

type Props<
  C extends string,
  DC extends C | never,
  Item extends ItemType<C, DC>,
> = {
  editButtonText: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  tableColumns: Record<C, ColType>;
  tableItems: Array<Item>;
  tableLoading: boolean;
};

const AccessTablesView = <
  C extends string,
  Item extends ItemType<C, DC>,
  DC extends C | never = never,
>({
  editButtonText,
  setIsEditing,
  tableColumns,
  tableItems,
  tableLoading,
}: Props<C, DC, Item>) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-3/5 flex-1">
        <Description label="">
          <Table
            items={tableItems}
            cols={tableColumns}
            loading={tableLoading}
            containerClassName="flex-1"
          />
        </Description>
      </div>
      <div className="self-end">
        <SimpleBtn
          className="self-end"
          type="submit"
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(true);
            navigate('./', {state: {isEditing: ''}});
          }}>
          {editButtonText}
        </SimpleBtn>
      </div>
    </>
  );
};

export default AccessTablesView;
