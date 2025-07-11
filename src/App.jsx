import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import { useDispatch, useSelector } from "react-redux";
import { getPlans } from './store/slices/plan/planSlice';
import { ToastContainer } from 'react-toastify';


function App() {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.plan.plans)

  // console.log('plans', plans)
  useEffect(() => {
  }, [dispatch]);
  useEffect(() => {
    const response = dispatch(getPlans());

    if (getPlans.fulfilled.match(response)) {
      console.log('response', response.payload.plans)
    }
  }, []);

  return (
    <div className='min-h-screen  flex flex-wrap content-between main'>
      <div className='w-full block'>
        <main >
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default App
