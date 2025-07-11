import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { getPlans } from '../store/slices/plan/planSlice';

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
      const response = dispatch(getPlans());
      
          if (getPlans.fulfilled.match(response)) {
            console.log('response', response.payload.plans)
          }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-[200px] bg-white shadow-sm">
        <Sidebar />
      </aside>

      {/* Mobile Hamburger */}
      <div className="absolute top-4 right-4 md:hidden z-40">
        <button onClick={() => setMobileSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Animated Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setMobileSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 z-50 h-full w-64 bg-white  shadow-lg"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-gray-700"
                >
                  ✕
                </button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
