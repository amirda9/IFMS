import {Description, TextInput} from '~/components';
import SystemSettingsMain from '../SystemSettingsMain';

const wavelengths = [
  850, 1300, 1310, 1383, 1410, 1470, 1490, 1510, 1530, 1550, 1570, 1590, 1610,
  1625, 1630, 1650,
];

const iorInitialValues = [
  1.4139, 1.4142, 1.4678, 1.4679, 1.468, 1.4681, 1.4682, 1.4683, 1.4683, 1.4684,
  1.4685, 1.4686, 1.4687, 1.4687, 1.4689, -66.3,
];

const rbsInitialValues = [
  -73.7, -73.3, -79.44, -80.205, -80.48, -81.28, -81.45, -81.7, -81.87, -82,
  -82.2, -82.4, -82.58, -82.64, -82.821,
];

const OpticalRoutePage = () => {
  return (
    <SystemSettingsMain contentClassName="flex flex-col gap-y-4">
      <Description
        labelClassName="min-w-[25rem]"
        label="Helix factor of multimode fiber">
        <TextInput type="number" defaultValue={1.01} />
      </Description>
      <Description
        labelClassName="min-w-[25rem]"
        label="Helix factor of singlemode fiber">
        <TextInput type="number" defaultValue={1.01} />
      </Description>
      {wavelengths.map((wl, i) => (
        <Description
          labelClassName="min-w-[25rem]"
          label={`IOR for ${wl} nm wavelength on ${
            i <= 1 ? 'multimode' : 'singlemode'
          } fiber`}>
          <TextInput type="number" defaultValue={iorInitialValues[i]} />
        </Description>
      ))}
      {wavelengths.map((wl, i) => (
        <Description
          labelClassName="min-w-[25rem]"
          label={`RBS for ${wl} nm wavelength on ${
            i <= 1 ? 'multimode' : 'singlemode'
          } fiber`}>
          <TextInput type="number" defaultValue={rbsInitialValues[i]} />
        </Description>
      ))}
    </SystemSettingsMain>
  );
};

export default OpticalRoutePage;
