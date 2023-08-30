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
            dispatch(userAccessActions.setIsEditingUserAccess(true));
          }}>
          {editButtonText}
        </SimpleBtn>
      </div>
    </>
  );
};

export default AccessTablesView;
