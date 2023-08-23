import {Dispatch, FC, SetStateAction} from 'react';
import {SimpleBtn} from '~/components';

type Props = {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

const EditAccessTables: FC<Props> = ({setIsEditing}) => {
  return (
    <>
      <div className="flex gap-x-2 self-end">
        <SimpleBtn
          onClick={() => {
            alert('Not implemented yet...');
          }}>
          Save
        </SimpleBtn>
        <SimpleBtn
          onClick={() => {
            setIsEditing(false);
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default EditAccessTables;
