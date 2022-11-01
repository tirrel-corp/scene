import Urbit from "@urbit/http-api";
import { getAuth } from "../lib/auth";

const auth = getAuth();

export const api = new Urbit(auth?.url || process.env.REACT_APP_URL, auth?.code || process.env.REACT_APP_CODE, 'garden');

api.connect();

api.ship = auth?.ship || process.env.REACT_APP_SHIP;

window.ship = auth?.ship || process.env.REACT_APP_SHIP;
window.url = auth?.url || process.env.REACT_APP_URL;

window.api = api;
