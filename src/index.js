import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from 'react-router-dom';
import './css/index.css';
import App from './App';
import Onboarding from "./Onboarding";
import 'tippy.js/dist/tippy.css';

const rootLoader = async () => {
  const data = await authLoader();
  if (data.ship) {
    return redirect("/app");
  }
}
const authLoader = async () => {
  return window.localStorage.getItem("tirrel-desktop-auth") || {
    ship: process.env.REACT_APP_SHIP,
    code: process.env.REACT_APP_CODE,
    url: process.env.REACT_APP_URL
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Onboarding />,
    loader: rootLoader
  },
  {
    path: '/app',
    element: <App />,
    loader: authLoader
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
