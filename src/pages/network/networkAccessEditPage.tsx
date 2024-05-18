import React, {useRef} from 'react';
import {SimpleBtn, Switch} from '~/components';
import {FormLayout} from '~/layout';
import {useNavigate, useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {EditViewer} from '~/container';
import {EditorRefType} from '~/container/editViewers';
import {AccessEnum} from '~/types';
import {useDispatch, useSelector} from 'react-redux';
import {
  setnetworkviewers,
  setnetworkviewersstatus,
} from './../../store/slices/networkslice';

const NetworkAccessPage = () => {
  const dispatch = useDispatch();
  const editor = useRef<EditorRefType>(null);

  const params = useParams<{networkId: string}>();
  const navigate = useNavigate();
  const {
    request,
    state: {viewers, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.networkAccessList,
      update: state.http.networkAccessUpdate,
    }),
    initialRequests: request => {
      request('networkAccessList', {params: {network_id: params.networkId!}});
      editor.current?.setAdminid(
        viewers?.data!.users.find(data => data.access == 'ADMIN')?.user.id ||
          '',
      );
      editor.current?.setAditablebycurrentuserList(
        viewers
          ?.data!.users.filter(data => data.editable_by_current_user === true)
          .map(viewer => viewer.user.id) || [],
      );
    },
    onUpdate: lastState => {
      if (
        lastState.viewers?.httpRequestStatus === 'loading' &&
        viewers?.httpRequestStatus === 'success'
      ) {
        editor.current?.setValues(
          viewers?.data!.users.map(viewer => viewer.user.id),
        );
        // editor.current?.setAditablebycurrentuserList(
        //   viewers?.data!.users.filter(data => data.editable_by_current_user == true).map(viewer => viewer.user.id),
        // );
      }
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        update?.httpRequestStatus === 'success'
      ) {
        request('networkAccessList', {params: {network_id: params.networkId!}});
        navigate('../access', {replace: true, relative: 'path'});
      }
    },
  });

  const buttons = (
    <div className="mt-[25px] w-auto ">
      <SimpleBtn
        className="mt-[25px] h-[40px] w-[149px]"
        disabled={update?.httpRequestStatus === 'loading'}
        onClick={() => {
          const admin = viewers?.data?.users?.find(
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

          dispatch(setnetworkviewers(users));
          dispatch(setnetworkviewersstatus(true));
          navigate(-1);
        }}>
        OK
      </SimpleBtn>

      <SimpleBtn
        onClick={() => {
          dispatch(setnetworkviewers([])),
            dispatch(setnetworkviewersstatus(false)),
            navigate(-1);
        }}
        className="ml-2 px-14 py-[12px]">
        <span>Cancel</span>
      </SimpleBtn>
    </div>
  );

  return (
    <FormLayout buttons={buttons} wrapperClassName="p-8 pb-0 pt-2 h-[calc(100vh-150px)]">
      <div className=" flex flex-row items-center">
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

export default NetworkAccessPage;
