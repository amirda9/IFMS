import {FC, useState} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {SimpleBtn, TabItem} from '~/components';
import AppDialog from '~/components/modals/AppDialog';

const TestSetupDetailsModal: FC = () => {
  const params = useParams();

  return (
    <AppDialog
      footerClassName="flex justify-end"
      footer={
        <div className="flex gap-x-4">
          <SimpleBtn type="submit">Save</SimpleBtn>
          <SimpleBtn link to="..">
            Cancel
          </SimpleBtn>
        </div>
      }>
      <div className="flex h-full w-full flex-col">
        <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
          <TabItem to="." name="Parameters" />
          <TabItem to="learning" name="Learning" />
          <TabItem to="test-program" name="Test Program" />
          <TabItem to="status" name="Status" />
        </div>

        <Outlet key={params.alarmId} />
      </div>
    </AppDialog>
  );
};

export default TestSetupDetailsModal;
