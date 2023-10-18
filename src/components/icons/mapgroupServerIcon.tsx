import L from 'leaflet';
import icon from '~/assets/images/groupserverIcon.svg';
const MapgroupServerIcon = new L.Icon({
  iconUrl: icon,
  iconRetinaUrl: icon,
  iconSize: new L.Point(90, 90),
  className: 'border-none',
});

export default MapgroupServerIcon;