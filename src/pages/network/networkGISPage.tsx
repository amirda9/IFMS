import React from 'react';
import {SimpleBtn} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';

const NetworkGisPage = () => {
  const buttons = (
    <>
      <SimpleBtn link to="../edit-access">
        Add Shapefile
      </SimpleBtn>
      <SimpleBtn>Explore</SimpleBtn>
      <SimpleBtn>History</SimpleBtn>
      <SimpleBtn>Save</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      <div className="flex flex-col gap-y-4">
        {[...new Array(3)].map((_, index) => (
          <div className="flex h-20 w-2/3 flex-row items-center justify-between rounded-lg bg-gis px-4">
            <div className="flex flex-row gap-x-20">
              <span>{index + 1}</span>
              <span>Whole Network</span>
            </div>
            <div className="flex flex-row gap-x-8">
              <SimpleBtn>Download</SimpleBtn>
              <IoTrashOutline
                size={24}
                className="text-red-500 active:text-red-300"
              />
            </div>
          </div>
        ))}
      </div>
    </FormLayout>
  );
};

export default NetworkGisPage;
