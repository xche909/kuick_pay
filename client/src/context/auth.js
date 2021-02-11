import React, { createContext, useReducer } from 'react'
import jwtDecode from "jwt-decode";

const pathname = window.location.pathname;
const path = pathname === "/" ? "home" : pathname.substr(1);
const initState = {user:null, activeMenuItem: path}

if (localStorage.getItem("jwtToken")){
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
    //console.log(decodedToken);
    if (decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem("jwtToken");
    } else{
        initState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userdata) => {},
    logout: () => {},
    activeMenuItem: null,
    changeActiveMenuItem: (item) => {},
});

const authReducer = (state, action) => {
    switch(action.type){
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            }

        case "LOGOUT":
            return {
                ...state,
                user: null
            }
        case "CHANGE_ACTIVE_MENU_ITEM":
            return {
                ...state,
                activeMenuItem: action.payload
            }
        default:
            return state;
        
    }
}

const AuthProvider = (props) => {
    const [ state, dispatch ] = useReducer(authReducer, initState);
    const login = (userdata) => {
        localStorage.setItem("jwtToken", userdata.token);
        dispatch({
            type: "LOGIN",
            payload: userdata
        })
    };
    const logout = () => {
        localStorage.removeItem("jwtToken");
        dispatch({
            type: "LOGOUT",
        })
    };

    const changeActiveMenuItem = (item) =>{
        dispatch({
            type: "CHANGE_ACTIVE_MENU_ITEM",
            payload: item
        })
    }

    return (
        <AuthContext.Provider
            value={{user:state.user, login, logout, activeMenuItem: state.activeMenuItem, changeActiveMenuItem}}
            {...props}
        />
    )
}

export {AuthContext, AuthProvider}