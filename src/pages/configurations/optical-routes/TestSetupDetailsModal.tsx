import {FC, useState} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {TabItem} from '~/components';
import AppDialog from '~/components/modals/AppDialog';

const TestSetupDetailsModal: FC = () => {
  const params = useParams();

  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('..');
  };

  return (
    <AppDialog>
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
