import { useSelector } from 'react-redux';
import { adminComponentMap } from '../../features/adminComponentMap';
import { Suspense } from 'react';
import Loader from '../common/Loader';

const RoleBasedComponents = ({ route }) => {
  const {userData } = useSelector((state) => state.auth);
// const role = "super"

  const roles = userData?.role?.split("-")[0]

  if (!userData || !roles) return <div className="p-4 text-red-500">Unauthorized</div>;

  const Component = adminComponentMap[route]?.roles?.[roles];

  if (!Component) {
    return (
      <div className="p-4 text-gray-600">
        <strong>{route}</strong> not available for <strong>{roles}</strong>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader/>}>
      <Component />
    </Suspense>
  );
};

export default RoleBasedComponents;
