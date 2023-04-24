import { Route, Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils';

function PrivateRoute({ component: Component, ...rest }: { component: React.ComponentType, path: string }) {
  return (
    <Route
      {...rest}
      element={
        getAuthToken() ? (
          <Component />
        ) : (
          // @ts-ignore
          <Navigate to={{ pathname: '/remitano-app', state: { from: props.location } }} replace />
        )
      }
    />
  );
}

export default PrivateRoute;
