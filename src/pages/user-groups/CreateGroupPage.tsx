import {FC, FormEventHandler, useState} from 'react';
import {toast} from 'react-toastify';
import {Description, SimpleBtn, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';

const CreateGroupPage: FC = () => {
  const [groupNameValue, setGroupNameValue] = useState('');

  const {
    request,
    state: {createGroup},
  } = useHttpRequest({
    selector: state => ({createGroup: state.http.createGroup}),
    onUpdate: (lastState, state) => {
      if (lastState.createGroup?.httpRequestStatus === 'loading') {
        if (state.createGroup?.httpRequestStatus === 'success') {
          toast('Group was created successfully.', {type: 'success'});
        } else if (state.createGroup?.httpRequestStatus === 'error') {
          if (state.createGroup.error?.status === 422) {
            toast('Validation error.', {type: 'error'});
          } else {
            toast(
              (state.createGroup.error?.data?.detail as string) ||
                'An unknown error has occurred.',
              {type: 'error'},
            );
          }
        }
      }
    },
  });

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    request('createGroup', {data: {name: groupNameValue, users: []}});
  };

  return (
    <div className="flex flex-grow flex-col gap-4">
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={handleFormSubmit}>
        <div className="flex flex-col">
          <Description label="Name" items="start">
            <TextInput
              name="name"
              onChange={e => setGroupNameValue(e.target.value)}
              className="disabled:cursor-not-allowed disabled:bg-slate-200"
            />
          </Description>
        </div>
        <div className="flex flex-row gap-x-2 self-end">
          <SimpleBtn
            loading={createGroup?.httpRequestStatus === 'loading'}
            type="submit">
            Save
          </SimpleBtn>
          <SimpleBtn link to="../">
            Cancel
          </SimpleBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupPage;
