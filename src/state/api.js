import Urbit from "@urbit/http-api";

const auth = localStorage.getItem("tirrel-desktop-auth");

export const api = new Urbit(auth?.url || process.env.REACT_APP_URL, auth?.code || process.env.REACT_APP_CODE, 'garden');

api.connect();

api.ship = auth?.ship || process.env.REACT_APP_SHIP;

window.api = api;
