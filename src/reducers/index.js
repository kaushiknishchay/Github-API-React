import {combineReducers} from "redux-immutable";
import {gitHub} from "./githHub";

const rootReducer = combineReducers({
    github: gitHub
});

export default rootReducer;