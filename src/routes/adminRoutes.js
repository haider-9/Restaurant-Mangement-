import { adminComponentMap } from '../features/adminComponentMap';
import RoleBasedComponent from '../components/routing/RoleBasedComponents';

export const generateAdminRoutes = (role) => {
  const routes = [];

  for (const [path, value] of Object.entries(adminComponentMap)) {
    if (value.roles[role]) {
      routes.push({
        path,
        element: <RoleBasedComponent route={path} />,
      });
    }
  }

  return routes;
};
