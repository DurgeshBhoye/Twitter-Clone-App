import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

export const combineReducer = combineReducers({ userReducer: userReducer });


/* The code is using the `combineReducers` function from the Redux library. In this case, it is combining the `userReducer` into a single
reducer called `combineReducer`. */