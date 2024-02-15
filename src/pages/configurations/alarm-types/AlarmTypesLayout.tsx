import {FC, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import { RootState } from '~/store';
import { deletealarmtype, setalarmlist } from '~/store/slices/alarmstypeslice';
import {$Delete, $Get} from '~/util/requestapi';

const AlarmTypesLayout: FC = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const {alarmtypelist} = useSelector((state: RootState) => state.alarmtypes);
  useEffect(() => {
    const getalarmms = async () => {
      const getalarmsresponse = await $Get(`otdr/alarm`);
      if (getalarmsresponse.status == 200) {
        const responsedata = await getalarmsresponse.json();
        dispatch(setalarmlist(responsedata))
      }
    };
    getalarmms();
  }, []);


  const Deletealarms = async (id: string) => {
    const deletealarmsresponse = await $Delete(`otdr/alarm/${id}`);
    if (deletealarmsresponse.status == 200) {
      dispatch(deletealarmtype(id))
      navigate('./');
    }
  };

  return (
    <SidebarLayout createTitle="Alarm Types Definition" canAdd>
      {alarmtypelist.map((data: any) => (
        <SidebarItem
          selected={true}
          canDelete={true}
          onDelete={() => Deletealarms(data.id)}
          name={data.name}
          to={data.id}
        />
      ))}
    </SidebarLayout>
  );
};

export default AlarmTypesLayout;
