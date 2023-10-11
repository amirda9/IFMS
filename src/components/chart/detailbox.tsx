import React from 'react';
const Datatext = (props: {name: string}) => {
  return (
    <span className="w-[50px] text-[20px] font-light leading-[24.2px] text-[#000000] mb-[20px]">
      {props.name}
    </span>
  );
};

const Row = () => {
  return (
    <div className="flex w-full flex-row justify-between">
      <Datatext name="a:" />
      <Datatext name="4.124" />
      <Datatext name="km" />
      <Datatext name="22.05" />
      <Datatext name="dB" />
    </div>
  );
};

function Detailbox() {
  return (
    <div className="mt-[20px] box-border h-[195px] w-[370px] rounded-[10px] bg-[#C6DFF8] p-[20px]">
      <Row />
      <Row />
      <Row />
      <Row />
    </div>
  );
}

export default Detailbox;
