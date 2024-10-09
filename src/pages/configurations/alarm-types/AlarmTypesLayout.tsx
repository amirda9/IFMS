import {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import {RootState} from '~/store';
import {deletealarmtype, setalarmlist} from '~/store/slices/alarmstypeslice';
import {$Delete, $Get} from '~/util/requestapi';
import Swal from 'sweetalert2';
import {
  setGetalarmtype,
} from '~/store/slices/alarmstypeslice';
const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};
const AlarmTypesLayout: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {alarmtypelist,alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  useEffect(() => {
    const getalarmms = async () => {
      const getalarmsresponse = await $Get(`otdr/alarm`);
      if (getalarmsresponse?.status == 200) {
        const responsedata = await getalarmsresponse?.json();
        dispatch(setalarmlist(responsedata));
      }
    };
    getalarmms();
  }, []);

  const Deletealarms = async (id: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        const deletealarmsresponse = await $Delete(`otdr/alarm/${id}`);
        if (deletealarmsresponse?.status == 200) {
          dispatch(deletealarmtype(id));
          navigate('./');
        }
      }
    });
  };


  
  return (
    <SidebarLayout createTitle="Alarm Types Definition" canAdd>
      {alarmtypelist.map((data: any) => (
        <SidebarItem
        onclick={()=> dispatch(setGetalarmtype(false))}
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
