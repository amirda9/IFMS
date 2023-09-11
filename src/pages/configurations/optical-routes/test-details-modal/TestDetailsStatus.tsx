import dayjs from 'dayjs';
import {FC} from 'react';
import {Description, SimpleBtn} from '~/components';

const TestDetailsStatus: FC = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-grow">
      <div className="flex flex-col gap-y-4 flex-grow">
        <Description label="Current Learning Cycle">
          <span>1</span>
        </Description>
        <Description label="On Learning">
          <span>No</span>
        </Description>
        <Description label="Next Cycle Start">
          <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
        </Description>
        <Description label="Next Cycle Start">
          <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
        </Description>
        <Description label="First Reference Time">
          <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
        </Description>
        <Description label="Last Reference Time">
          <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
        </Description>
        <Description label="Reference Status">
          <span>Valid</span>
        </Description>
        <Description label="Last Learning Count">
          <span>24</span>
        </Description>
      </div>
      <div className="flex gap-x-4 self-end">
        <SimpleBtn link to="..">
          Ok
        </SimpleBtn>
        <SimpleBtn link to="..">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default TestDetailsStatus;
