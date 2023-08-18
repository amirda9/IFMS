import React from 'react';
import {SimpleBtn, TextInput} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';

const LinkPointsPage = () => {
  const buttons = (
    <>
      <SimpleBtn type="submit">Save</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      {[...new Array(7)].map((_, index) => (
        <div className="my-4 flex w-1/2 flex-row items-center justify-between rounded-md bg-gis p-4">
          <span>{index + 1}</span>
          <TextInput />
          <TextInput />
          <IoTrashOutline
            size={24}
            className="cursor-pointer  text-red-500  active:text-red-300"
          />
        </div>
      ))}
    </FormLayout>
  );
};

export default LinkPointsPage;
