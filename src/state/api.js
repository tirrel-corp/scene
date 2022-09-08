import Urbit from "@urbit/http-api";

export const api = new Urbit(process.env.REACT_APP_URL, process.env.REACT_APP_CODE, 'garden');
api.connect();
api.ship = process.env.REACT_APP_SHIP

window.api = api;
