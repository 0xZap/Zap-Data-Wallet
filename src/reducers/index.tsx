import { combineReducers } from "redux";
import requests from "./requests";
import authReducer from "./authSlice";
import history from "./history";
// import plugins from "./plugins";

const rootReducer = combineReducers({
  requests,
  auth: authReducer,
  history,
  //   plugins,
});

export type AppRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
