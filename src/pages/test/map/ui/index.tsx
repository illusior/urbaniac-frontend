import {
  KeysOfMapPageParams,
  RouteEnum,
  getRoutePath,
  isAvailableMapNameParam,
} from '~/shared/config';
import {
  Navigate,
  useParams,
} from 'react-router-dom';
import { TestMapWidget } from '~/widgets/test';

interface MapProps {}

export const Map: React.FC<MapProps> = (_: MapProps): JSX.Element => {
  const { mapName = '' } = useParams<KeysOfMapPageParams>();

  const isMapAvailable = isAvailableMapNameParam(mapName);
  if (!isMapAvailable) {
    return <Navigate to={getRoutePath(RouteEnum.ERR_404_PAGE)} replace />;
  }

  return (
    <>
      <TestMapWidget mapName={mapName} />
    </>
  );
};
