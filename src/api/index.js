import { ApiPromise,WsProvider } from "@polkadot/api";
import types from "./types";
const wsProvider = new WsProvider(process.env.VUE_APP_NODE_ADDRESS);
const api = ApiPromise.create({provider: wsProvider,types});
export default api;