import { createStore } from "redux";
import { combineReducer } from "./combineReducer";


export const store = createStore(
    combineReducer
)


/* The code is creating a Redux store using the `createStore` function from the Redux library. The
`createStore` function takes in a reducer function as an argument and returns a Redux store object. */