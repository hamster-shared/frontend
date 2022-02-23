import { ApiPromise,WsProvider } from "@polkadot/api";
import types from "./types";
const BASE_URL = document.querySelector('body').getAttribute('baseurl')
const wsProvider = new WsProvider(BASE_URL || process.env.VUE_APP_NODE_ADDRESS);
const api = ApiPromise.create({provider: wsProvider,types});
export default api;