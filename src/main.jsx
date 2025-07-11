import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Login from '../src/pages/auth/Login.jsx'
import SignUp from '../src/pages/auth/SignUp.jsx'
import NotFound from '../src/pages/404/NotFound.jsx'
import LandingPage from '../src/pages/landing/LandingPage.jsx'

//swiper library import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { path } from 'framer-motion/client'

import RoleBasedComponents from '../src/components/routing/RoleBasedComponents.jsx'
import AdminLayout from '../src/layouts/AdminLayout.jsx'
import WidgetEntry from '../src/components/reservationwidgets/WidgetEntry.jsx'

import { ToastContainer } from 'react-toastify'

import { Toaster } from '../src/components/common/toast/Toaster.jsx'
import SuccessPage from '../src/pages/payment/SuccessPage.jsx'
import FailurePage from '../src/pages/payment/FailurePage.jsx'
import WidgetTestPage from './testWidget/WidgetTestPage.jsx'



const router = createBrowserRouter([

  {
    path: "/",
    element: (
      <App />
    ),
    children: [
      {
        path: "/",
        element: (
          // <AuthLayout authentication={true}>
          <LandingPage />
          // </AuthLayout>
        ),
      },
      {
        path: "/auth/login",
        element: (
          // <AuthLayout authentication={true}>
          <Login />
          // </AuthLayout>
        ),
      },
      {
        path: "/auth/sign-up",
        element: (
          // <AuthLayout authentication={true}>
          <SignUp />
          // </AuthLayout>
        ),
      },
      {
        path: "/*",
        element: (
          <NotFound />
        ),
      },
    ]
  },
  {
    path: "/reservation-widget",
    element: <WidgetEntry />
  },
  {
    path: "/payment/success",
    element: <SuccessPage />
  },
  {
    path: "/payment/fail",
    element: <FailurePage />
  },
  //test for widget
  {
    path: "/widget-test",
    element: <WidgetTestPage />
  },

  {
    path: "/",
    element: (
      <AdminLayout />
    ),
    children: [
      {
        path: "dashboard",
        element: <RoleBasedComponents route="dashboard" />
      },
      {
        path: "tenants",
        element: <RoleBasedComponents route="tenants" />
      },
      {
        path: "chat",
        element: <RoleBasedComponents route="chat" />
      },
      {
        path: "billing",
        element: <RoleBasedComponents route="billing" />
      },
      {
        path: "booking",
        element: <RoleBasedComponents route="booking" />
      },
      {
        path: "floor-plan",
        element: <RoleBasedComponents route="floor-plan" />
      },
      {
        path: "assign-staff",
        element: <RoleBasedComponents route="assign-staff" />
      },
      {
        path: "staff-manage",
        element: <RoleBasedComponents route="staff-manage" />
      },
      {
        path: "booking",
        element: <RoleBasedComponents route="booking" />
      },
      {
        path: "manage-event",
        element: <RoleBasedComponents route="manage-event" />
      },
      {
        path: "location",
        element: <RoleBasedComponents route="location" />
      },
      {
        path: "guest-book",
        element: <RoleBasedComponents route="guest-book" />
      },
      {
        path: "report",
        element: <RoleBasedComponents route="report" />
      },
      {
        path: "setting",
        element: <RoleBasedComponents route="setting" />
      },
      {
        path: "logout",
        element: <RoleBasedComponents route="logout" />
      }
    ]
  },

]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider
        router={router}
      />
      <Toaster />
      <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          style={{
            zIndex: 9999
          }}
        />
    </Provider>
  </React.StrictMode>,
)