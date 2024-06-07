import {
  KeysOfMapPageParams, RouteEnum, getRoutePath,
} from '~/shared/config';
import {
  Navigate, useParams,
} from 'react-router-dom';
import { TestMapWidget } from '~/widgets/test';

interface MapProps {}

const AVAILABLE_MAPS = [
  'mari-el',
  'russia',
  'world',
];

export const Map: React.FC<MapProps> = (_: MapProps): JSX.Element => {
  const { mapName = '' } = useParams<KeysOfMapPageParams>();

  const isMapAvailable = AVAILABLE_MAPS.includes(mapName);
  if (!isMapAvailable) {
    return <Navigate to={getRoutePath(RouteEnum.ERR_404_PAGE)} replace />;
  }

  return (
    <TestMapWidget mapName={mapName} />
  );
};
