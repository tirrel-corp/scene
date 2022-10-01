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
import Login from "./components/Onboarding/login";
import Welcome from "./components/Onboarding/welcome";
import NewAccount from './components/Onboarding/new';
import PlanetList from "./components/Onboarding/planetList"
import PayDetailScreen from './components/Onboarding/detail';
import PayScreen from "./components/Onboarding/pay";
import ConfirmScreen from "./components/Onboarding/confirm";
import Debug from "./components/Onboarding/debug";
import 'tippy.js/dist/tippy.css';

const authLoader = async () => {
  const auth = await window.localStorage.getItem("tirrel-desktop-auth") || {
    ship: process.env.REACT_APP_SHIP,
    code: process.env.REACT_APP_CODE,
    url: process.env.REACT_APP_URL
  };
  return JSON.parse(auth)
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Onboarding />,
    loader: authLoader,
    children: [
      {
        path: "",
        element: <Welcome />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "new",
        element: <NewAccount />,
        children: [
          {
            path: "",
            element: <PlanetList />
          },
          {
            path: "detail",
            element: <PayDetailScreen />
          },
          {
            path: "pay",
            element: <PayScreen />
          },
          {
            path: "confirm",
            element: <ConfirmScreen />
          }
        ]
      },
      {
        path: 'debug',
        element: <Debug />
      }
    ]
  },
  {
    path: '/app',
    element: <App />,
    loader: authLoader
  },
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
