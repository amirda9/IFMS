import React, {useRef} from 'react';
import {SimpleBtn, Switch} from '~/components';
import {FormLayout} from '~/layout';
import {useNavigate, useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {EditViewer} from '~/container';
import {EditorRefType} from '~/container/editViewers';
import {AccessEnum} from '~/types';
import {setregionviewers,setregionviewersstatus} from './../../store/slices/networkslice';
import {useDispatch, useSelector} from 'react-redux';
const RegionAccessPage = () => {
  const dispatch = useDispatch();
  const {regionDetail} = useSelector((state: any) => state.http);

  const editor = useRef<EditorRefType>(null);
  const params = useParams<{regionId: string}>();
  const navigate = useNavigate();
  const {
    request,
    state: {viewers, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.regionAccessList,
      update: state.http.regionAccessUpdate,
    }),
    initialRequests: request => {
      request('regionAccessList', {params: {region_id: params.regionId!.split('_')[0]}});
      editor.current?.setAdminid(
        viewers?.data!.users.find(data => data.access == 'ADMIN')?.user.id ||
          '',
      );
      editor.current?.setAditablebycurrentuserList(
        viewers?.data!.users.filter(data => data.editable_by_current_user === true).map(viewer => viewer.user.id) || [],
      );
    },
    onUpdate: lastState => {
      if (
        lastState.viewers?.httpRequestStatus === 'loading' &&
        viewers?.httpRequestStatus === 'success'
      ) {
        editor.current?.setValues(
          viewers.data!.users.map(viewer => viewer.user.id),
        );
      }
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        update?.httpRequestStatus === 'success'
      ) {
        request('regionAccessList', {params: {region_id: params.regionId!}});
        navigate('../access', {replace: true, relative: 'path'});
      }
    },
  });

  const buttons = (
    <>
      {/* {regionDetail?.data?.access == 'ADMIN' ? ( */}
      <SimpleBtn
        disabled={update?.httpRequestStatus === 'loading'}
        onClick={() => {
          const admin = viewers!.data!.users.find(
            value => value.access === AccessEnum.admin,
          );
          const viewerList = editor.current!.values;

          if (admin) {
            const index = viewerList.indexOf(admin.user.id);
            if (index !== -1 && index !== null) {
              viewerList.splice(index, 1);
            }
          }

          const users = viewerList.map(value => value);
          dispatch(setregionviewers(users));
          dispatch(setregionviewersstatus(true));
          navigate(-1);

          // request('regionAccessUpdate', {
          //   params: {region_id: params.regionId!},
          //   data: {users},
          // });
        }}>
        OK
      </SimpleBtn>
      {/* ):null} */}
      <SimpleBtn onClick={() => {dispatch(setregionviewersstatus(false)),navigate(-1)}}>Cancel</SimpleBtn>
    </>
  );

  return (
    <FormLayout buttons={buttons} wrapperClassName="p-2">
      <div className="mb-4 flex flex-row items-center">
        <span>Users</span>
        <Switch
          wrapperClassName="mx-5"
          onChange={value => {
            editor.current?.setGroup(value);
          }}
        />
        <span>Groups</span>
      </div>
      <EditViewer ref={editor} />
    </FormLayout>
  );
};

export default RegionAccessPage;
