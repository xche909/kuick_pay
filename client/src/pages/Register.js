import React, { useState, useContext } from 'react';
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {AuthContext} from "../context/auth"

import {useForm} from "../utils/hooks";

const Register = props => {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    
    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: "",
        password: "",
        email: "",
        confirmPassword: "",
        lastname: "",
        firstname: ""
    });

    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(proxy, {data:{register:userData}}){
            //console.log(userData);
            context.login(userData);
            props.history.push("/");
        },
        onError(err){
            //console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables:values
    });

    function registerUser(){
        addUser();
    }
    return ( 
        <div  className="form-container">
        <Form onSubmit={onSubmit} noValidate className={loading?"loading":""}>
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    error={errors.username?true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password?true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword?true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Lastname"
                    placeholder="Lastname"
                    name="lastname"
                    value={values.lastname}
                    error={errors.lastName?true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Firstname"
                    placeholder="Firstname"
                    name="firstname"
                    value={values.firstname}
                    error={errors.firstName?true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    error={errors.email?true:false}
                    onChange={onChange}
                />
                <Button type="submit" primary>Register</Button>
            </Form>
            {Object.keys(errors).length>0 && (<div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value=>(
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>)}
        </div>
     );
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
        $lastname: String!
        $firstname: String!
    ) {
        register(
            registerInput:{
                username: $username,
                email: $email,
                password: $password,
                confirmPassword: $confirmPassword,
                lastName: $lastname,
                firstName: $firstname
            }
        ){
            id email username createdAt token firstName lastName
        }
    }
`;
 
export default Register;