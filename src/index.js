import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  redirect,
  RouterProvider
} from 'react-router-dom';
import './css/index.css';
import Onboarding from "./Onboarding";
import Dashboard from './Dashboard';
import ErrorView from "./ErrorView";
import Login from "./components/Onboarding/login";
import Welcome from "./components/Onboarding/welcome";
import NewAccount from './components/Onboarding/new';
import PlanetList from "./components/Onboarding/planetList"
import PayDetailScreen from './components/Onboarding/detail';
import PayScreen from "./components/Onboarding/pay";
import ConfirmScreen from "./components/Onboarding/confirm";
import Debug from "./components/Onboarding/debug";
import PulsingLogo from "./components/PulsingLogo";
import { get, getColors } from "./lib/background";
import { getAuth } from "./lib/auth";
import 'tippy.js/dist/tippy.css';
import { api } from './state/api';

const App = React.lazy(() => import('./App'));

const authLoader = async () => {
  const stored = getAuth();
  if (!!stored) {
    if (!stored.ship) {
      const name = await fetch(`${stored.url}/~/name.json`);
      const nameText = await name.text();
      const auth = { ...stored, ship: nameText.slice(1) };
      window.localStorage.setItem('tirrel-desktop-auth', JSON.stringify(auth));
      api.ship = nameText.slice(1);
      window.ship = nameText.slice(1);
      return { auth, api }
    }
    api.ship = stored.ship;
    window.ship = stored.ship;
    return { auth: stored, api };
  }
  return { auth: stored, api };
};

const appLoader = async () => {
  const bg = await get();
  const colors = await getColors(`${bg.startsWith('hallstatt') ? '' : 'file://'}${encodeURI(bg)}`);
  const auth = await authLoader();
  return { ...auth, ...{ bg: bg + `?${new Date().getTime()}`, pal: colors } }
}

const router = createHashRouter([
  {
    path: "/",
    loader: authLoader,
    element: <Onboarding />,
    errorElement: <ErrorView />,
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
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: 'debug',
        element: <Debug />
      }
    ]
  },
  {
    path: '/app',
    loader: appLoader,
    element: (
      <React.Suspense fallback={
        <div className="min-w-[100vw] min-h-[100vh] flex justify-center items-center">
          <PulsingLogo />
        </div>
      }>
        <App />
      </React.Suspense>
    ),
    errorElement: <ErrorView />,
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
