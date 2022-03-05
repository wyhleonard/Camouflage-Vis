import {combineReducers, createStore} from "redux";
import globalReducer from "./GlobalStore"

const rootReducer = combineReducers({
    global: globalReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;