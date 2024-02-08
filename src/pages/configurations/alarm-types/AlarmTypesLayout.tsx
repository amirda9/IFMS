import {FC, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import {$Delete, $Get} from '~/util/requestapi';

const AlarmTypesLayout: FC = () => {
  const [alarms, setAlarms] = useState<any>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getalarmms = async () => {
      const getalarmsresponse = await $Get(`otdr/alarm`);
      if (getalarmsresponse.status == 200) {
        const responsedata = await getalarmsresponse.json();
        setAlarms(responsedata);
      }
    };
    getalarmms();
  }, []);


  const deletealarms = async (id: string) => {
    const deletealarmsresponse = await $Delete(`otdr/alarm/${id}`);
    if (deletealarmsresponse.status == 200) {
      navigate('./');
    }
  };

  return (
    <SidebarLayout createTitle="Alarm Types Definition" canAdd>
      {alarms.map((data: any) => (
        <SidebarItem
          selected={true}
          canDelete={true}
          onDelete={() => deletealarms(data.id)}
          name={data.name}
          to={data.id}
        />
      ))}
    </SidebarLayout>
  );
};

export default AlarmTypesLayout;
