import L from 'leaflet';
import icon from '~/assets/icons/severIcon.png';

const MapServerIcon = new L.Icon({
  iconUrl: icon,
  iconRetinaUrl: icon,
  iconSize: new L.Point(30, 30),
  className: 'leaflet-div-icon',
});

export default MapServerIcon;
