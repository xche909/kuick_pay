import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth"

const FuncRoute = ({ component: Component, ...rest }) => {
    const context = useContext(AuthContext);

    return(
        <Route
            {...rest}
            render = {props=>context.user?<Component {...props}/>:<Redirect to="/"/>}
        />
    )
}

export default FuncRoute;