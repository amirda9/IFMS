import {useSelector} from 'react-redux';
import {TextInput} from '~/components';
import {RootState} from '~/store';
const valueunit: any = {
  EventLocation: 'Km',
  NumberofEvents: '',
  EventLoss: 'dB',
  EventReflectance: 'dB',
  OpticalRouteLength: 'Km',
  SwitchStatus: '',
};

function Index() {
  const {alarmmodaldata} = useSelector((state: RootState) => state.alarmsslice);

  return (
    <div className="ml-[80px]  w-[calc(100%-80px)]">
      <div className="mt-8 flex w-full flex-row justify-between">
        <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
          Parameter
        </div>
        <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
          Value
        </div>
      </div>

      {alarmmodaldata?.contributing_conditions?.map(
        (contributingdata, index) => {
          let unit = valueunit[contributingdata.parameter.split(' ').join('')];
          let parametervalue =
            unit == 'Km'
              ? (contributingdata.measured_value / 1000).toFixed(2)
              : contributingdata.measured_value.toFixed(2);
          return (
            <div className="w-full" key={index}>
              {contributingdata.coef ? (
                <div className="mt-8 flex w-full flex-row items-center justify-between">
                  <TextInput
                    onChange={() => {}}
                    value={`${contributingdata.parameter}: ${parametervalue} ${unit}`}
                    className="h-[40px] w-[40%]"
                  />

                  <span className="text-[20px]">
                    {contributingdata.operator}
                  </span>
                  <div className="flex w-[50%] flex-row justify-between">
                    <TextInput
                      type="text"
                      onChange={() => {}}
                      value={contributingdata.coef}
                      className="h-[40px] w-[20%]"
                    />
                    <span className="mt-2">x</span>

                    <TextInput
                      type="text"
                      onChange={() => {}}
                      value={`${contributingdata.value}: ${parametervalue} ${unit}`}
                      className="h-[40px] w-[70%]"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex w-full flex-row justify-between">
                  <TextInput
                    type="text"
                    onChange={() => {}}
                    value={contributingdata.parameter}
                    className="h-[40px] w-[40%]"
                  />

                  {contributingdata.operator ? (
                    <span className="text-[20px]">
                      {contributingdata.operator}
                    </span>
                  ) : null}

                  <TextInput
                    type="text"
                    onChange={() => {}}
                    value={contributingdata.value}
                    className="h-[40px] w-[50%]"
                  />
                </div>
              )}
            </div>
          );
        },
      )}
    </div>
  );
}

export default Index;
