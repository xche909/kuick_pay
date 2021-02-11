import React, {Fragment, useContext} from 'react';
import Logo from "../images/logo.png";
import { Image } from 'semantic-ui-react'
import { AuthContext } from "../context/auth"
import ExchangeRate from '../components/ExchangeRate';


const Home = () => {
    const context = useContext(AuthContext);
    //console.log(context);
    
    return ( 
        <Fragment>
            {context.user?<h1>Hi, {context.user.firstName + " " + context.user.lastName}!</h1>:""}
            <h2>Welcome to Kuick Pay</h2>
            <h4>Your favorite banking app in New Zealand.</h4>
            <Image src={Logo} fluid />
            <ExchangeRate/>
        </Fragment>
        
     );
}


 
export default Home;