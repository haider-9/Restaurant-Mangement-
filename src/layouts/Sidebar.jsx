/* eslint-disable no-unused-vars */
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { adminComponentMap } from '../features/adminComponentMap';
import logo from '../assets/images/landing/textLogo.svg'
import { Iconly } from 'react-iconly';

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);
  const roles = role?.split('-')[0]

  const links = Object.entries(adminComponentMap)
    .filter(([_, value]) => value.roles[roles])
    .map(([key, value]) => ({
      path: `/${key}`,
      label: value.label,
      icon: value.icon
    }));

  return (
    <nav className="flex flex-col gap-2 px-4 text-left">
      <div className=' flex justify-start'>
        <img src={logo} alt="" className=' w-28' />
      </div>
      {links.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${isActive ? 'bg-primary text-white' : 'text-textPrimary'}  text-[16px] font-medium p-2 rounded-xl`
          }
        >
          {({ isActive }) => (
            <div className='flex items-center gap-3'>
              <span>
                <Iconly
                  name={icon}
                  set='light' 
                  secondaryColor={isActive ? 'white' : 'gray'} 
                  stroke='regular'
                  size='' />
              </span>
              <span className='tracking-wide'>{label}</span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
