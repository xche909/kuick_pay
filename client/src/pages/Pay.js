import React, { Fragment, useContext, useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { Tab, Input, Form, Select, Button, Modal } from 'semantic-ui-react';
import gql from "graphql-tag";
import {useTransferForm, usePayForm} from "../utils/hooks";


const Pay = () => {
    const context = useContext(AuthContext);

    //Modal switch
    const [open, setOpen] = useState(false);

    //Errors for the forms
    const [errors, setErrors] = useState("");
    const [errors2, setErrors2] = useState("");

    let {onChangeInput,onSelectionInputFrom,onSelectionInputTo, onSubmit, values } = useTransferForm(transfer, {
        senderAccountId: "",
        receiverAccountId:"",
        amount: "",
    });

    let {onChangeInput2, onSelectionInputFrom2, onSubmit2, values2} = usePayForm(paySomeoneElse, {
        senderAccountId:"",
        receiverAccountId:"",
        amount: ""
    });

    const [transferFunds, {loading}] = useMutation(TRANSFER, {
        update(proxy, {data:{makeTransaction:userData}}){
            console.log(userData);
            values = {
                senderAccountId: "",
                receiverAccountId:"",
                amount: "",
            };
            setErrors("");
            setOpen(true);
        },
        onError(err){
            //console.log(values);
            //console.log(err);
            if (err.graphQLErrors[0].message.includes("CastError") || err.graphQLErrors[0].message.includes("ReferenceError")){
                setErrors("Please provide valid accounts")
            } else{
                setErrors(err.graphQLErrors[0].message);
            }
           
            
        },
        variables:{
            senderAccountId: values.senderAccountId,
            receiverAccountId: values.receiverAccountId,
            amount: values.amount.match(/^[0-9]+(\.[0-9]{1,2})?$/) ? parseFloat(values.amount) : 0,
        }
    });

    function transfer(){
        transferFunds();
    }

    const [paySomeone, {loading2}] = useMutation(TRANSFER, {
        update(proxy, {data:{makeTransaction:userData}}){
            console.log(userData);
            values2 = {
                senderAccountId: "",
                receiverAccountId:"",
                amount: "",
            };
            setErrors2("");
            setOpen(true);
        },
        onError(err){
            //console.log(values2);
            //console.log(err);
            if (err.graphQLErrors[0].message.includes("CastError") || err.graphQLErrors[0].message.includes("ReferenceError")){
                setErrors2("Please provide valid accounts")
            } else{
                setErrors2(err.graphQLErrors[0].message);
            }
           
            
        },
        variables:{
            senderAccountId: values2.senderAccountId,
            receiverAccountId: values2.receiverAccountId,
            amount: values2.amount.match(/^[0-9]+(\.[0-9]{1,2})?$/) ? parseFloat(values2.amount) : 0,
        }
    });

    function paySomeoneElse(){
        paySomeone();
    }

    //Grab accouts of the user logged in
    let accounts = [];
    const {  data } = useQuery(FETCH_ACCOUNTS_QUERY);
    if (data){
        accounts = data.getAccounts.filter(a=>a.username===context.user.username);
        //console.log(accounts);
    }

    //Load accounts to dropdown lists
    let fromOptions = [];
    let toOptions = [];
    accounts.forEach(a=>{
        fromOptions.push({key:a.id, text:a.name+"("+a.id+")", value:a.id});
        toOptions.push({key:a.id, text:a.name+"("+a.id+")", value:a.id});
    })

    //Panes of the tab
    const panes = [
        { menuItem: 'Transfer Funds', render: () => (
        <Tab.Pane>
            <Form onSubmit={onSubmit} noValidate className={loading?"loading":""}>
                <Form.Group widths="equal">
                <Form.Field
                    control={Select}
                    label={{ children: 'From', htmlFor: 'form-select-control-from' }}
                    options={fromOptions}
                    search
                    searchInput={{id:"form-select-control-from"}}
                    placeholder='-'
                    name="from"
                    value={values.senderAccountId}
                    onChange={onSelectionInputFrom }
                />
                <Form.Field
                    control={Select}
                    label='To'
                    options={toOptions}
                    placeholder='-'
                    name="to"
                    value={values.receiverAccountId}
                    onChange={onSelectionInputTo}
                />
                <Form.Field
                    control={Input}
                    label='Amount'
                    placeholder='$'
                    name="amount"
                    value={values.amount}
                    onChange={onChangeInput}
                />
                </Form.Group>
                <Button type="submit" primary>Transfer</Button>
            </Form>
            {errors?(<div className="ui error message">{errors}</div>):null}        
        </Tab.Pane>
        ) },
        { menuItem: 'Pay Someone Else', render: () => (
            <Tab.Pane>
                <Form onSubmit={onSubmit2} noValidate className={loading2?"loading":""}>
                    <Form.Group widths="equal">
                    <Form.Field
                        control={Select}
                        label={{ children: 'Pay From', htmlFor: 'form-select-control-from' }}
                        options={fromOptions}
                        search
                        searchInput={{id:"form-select-control-pay-from"}}
                        placeholder='-'
                        name="from"
                        value={values2.senderAccountId}
                        onChange={onSelectionInputFrom2}
                    />
                    <Form.Field
                        control={Input}
                        label='Receiver Account ID'
                        placeholder='Enter receiver account ID'
                        name="receiverAccountId"
                        value={values2.receiverAccountId}
                        onChange={onChangeInput2}
                    />
                    <Form.Field
                        control={Input}
                        label='Amount'
                        placeholder='$'
                        name="amount"
                        value={values2.amount}
                        onChange={onChangeInput2}
                    />
                    </Form.Group>
                    <Button type="submit" primary>Transfer</Button>
                </Form>
                {errors2?(<div className="ui error message">{errors2}</div>):null}        
            </Tab.Pane>
            ) },
      ]
    
    return ( 
        <Fragment>
            <Modal
                centered
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
            <Modal.Header>Success</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    Transaction has been made successfully!
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
            <Button onClick={() => {setOpen(false);window.location.href="/accounts";}}>OK</Button>
            </Modal.Actions>
            </Modal>
            <h1>Pay page</h1>
            <Tab panes={panes} />
        </Fragment>
        
     );
};

const FETCH_ACCOUNTS_QUERY = gql`
    {
        getAccounts{
        id 
        name
        username
        balance
        createdAt
        }
    }  
`;
 
const TRANSFER = gql`
    mutation makeTransaction(
        $senderAccountId: ID!
        $receiverAccountId: ID!
        $amount: Float!
    ) {
        makeTransaction(
                senderAccountId: $senderAccountId,
                receiverAccountId: $receiverAccountId,
                amount: $amount
        ){
            id senderUsername senderAccountId receiverUsername receiverAccountId amount createdAt
        }
    }
`;

export default Pay;