import {useNavigate} from 'react-router-dom';
import {Description, SimpleBtn, Table} from '~/components';
import {ColType, ItemType} from '~/components/views/Table';
import {useAppDispatch} from '~/hooks';
import {userAccessActions} from '~/store/slices';

type Props<
  C extends string,
  DC extends C | never,
  Item extends ItemType<C, DC>,
> = {
  editButtonText: string;
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
  tableColumns,
  tableItems,
  tableLoading,
}: Props<C, DC, Item>) => {
  const dispatch = useAppDispatch();

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
      <div className="flex flex-row self-end gap-x-4">
        <SimpleBtn
          className="self-end"
          onClick={() => {
            dispatch(userAccessActions.setIsEditingUserAccess(true));
          }}>
          {editButtonText}
        </SimpleBtn>
        <SimpleBtn
          className="self-end"
          onClick={() => {
            navigate('../../');
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default AccessTablesView;
