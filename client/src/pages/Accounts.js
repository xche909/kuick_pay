import React, { Fragment, useContext, useState } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { Card, Statistic, Button, Table, Modal, Form, Menu, Icon } from 'semantic-ui-react';
import gql from "graphql-tag";
import { useForm } from '../utils/hooks';

const Accounts = () => { 
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrntPage] = useState(1);

    const { onChange, onSubmit, values } = useForm(openNewAccount, {
        name: "",
        balance: 0
    })  

    const [ currentAccount, setCurrentAccount ] = useState(null);
    const [open, setOpen] = useState(false);
    let transactions = [];

    const handleClick = (account) => setCurrentAccount(account);
    let accounts = [];
    const {  data } = useQuery(FETCH_ACCOUNTS_QUERY);
    if (data){
        accounts = data.getAccounts.filter(a=>a.username===context.user.username);
        //console.log(accounts);
    }

    const trans = useQuery(FETCH_TRANSACTIONS_QUERY);
    if (currentAccount&&trans){
        transactions = trans.data.getTransactions.filter(t=>t.senderAccountId === currentAccount.id);
        transactions = transactions.concat(trans.data.getTransactions.filter(t=>t.receiverAccountId === currentAccount.id));
        transactions = transactions.reverse();
        //console.log(transactions);
    }

    const [openAccount, {loading}] = useMutation(OPEN_ACCOUNT, {
        update(proxy, {data:{openAccount:newAccountData}}){
            const data = proxy.readQuery({
                query: FETCH_ACCOUNTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_ACCOUNTS_QUERY,
                data: { getAccounts: [newAccountData, ...data.getAccounts] }
            });
            values.name = ""
            setErrors({});
            setOpen(false);
            //console.log(newAccountData)
        },
        onError(err){
            setErrors({...errors,name: err.graphQLErrors[0].message});
            setOpen(true);
        },
        variables:values
    });

    function openNewAccount(){
        openAccount();
    }

    const chunk = (arr, size) =>
        arr
            .reduce((acc, _, i) =>
            (i % size)
                ? acc
                : [...acc, arr.slice(i, i + size)]
            , []);
    
    //console.log(transactions);
    const chunckedTransactions = chunk(transactions, 10);

    const result = currentAccount  ? (
        <Fragment>
            <Button onClick={()=>handleClick(null)} labelPosition='left' icon='left chevron' content='Back' />
            <h1>{currentAccount.name}</h1>
            <h2>{"$"+  Math.round(( currentAccount.balance+ Number.EPSILON) * 100) / 100}</h2>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Account</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {transactions.slice(10*currentPage-10, 10*currentPage).map(t=>{
                            if (t.senderUsername !== context.user.username && t.receiverUsername === context.user.username){
                                return (
                                    <Table.Row key={t.id}>
                                        <Table.Cell>{t.senderUsername}</Table.Cell>
                                        <Table.Cell>{t.senderAccountId}</Table.Cell>
                                        <Table.Cell>+${t.amount}</Table.Cell>
                                        <Table.Cell>{t.createdAt.split("T")[0]}</Table.Cell>
                                    </Table.Row>
                                )
                            } if(t.senderUsername === context.user.username && t.receiverUsername !== context.user.username){
                                return(
                                    <Table.Row key={t.id}>
                                        <Table.Cell>{t.receiverUsername}</Table.Cell>
                                        <Table.Cell>{t.receiverAccountId}</Table.Cell>
                                        <Table.Cell>-${t.amount}</Table.Cell>
                                        <Table.Cell>{t.createdAt.split("T")[0]}</Table.Cell>
                                    </Table.Row>
                                )
                            }if(t.senderUsername === context.user.username && t.receiverUsername === context.user.username && t.senderAccountId === currentAccount.id){
                                return (
                                    <Table.Row key={t.id}>
                                        <Table.Cell>{t.receiverUsername}</Table.Cell>
                                        <Table.Cell>{t.receiverAccountId}</Table.Cell>
                                        <Table.Cell>-${t.amount}</Table.Cell>
                                        <Table.Cell>{t.createdAt.split("T")[0]}</Table.Cell>
                                    </Table.Row>
                                )
                            } if(t.senderUsername === context.user.username && t.receiverUsername === context.user.username && t.receiverAccountId === currentAccount.id){
                                return(
                                    <Table.Row key={t.id}>
                                        <Table.Cell>{t.senderUsername}</Table.Cell>
                                        <Table.Cell>{t.senderAccountId}</Table.Cell>
                                        <Table.Cell>+${t.amount}</Table.Cell>
                                        <Table.Cell>{t.createdAt.split("T")[0]}</Table.Cell>
                                    </Table.Row>
                                )
                            } else{
                                return(
                                    <Table.Row key={t.id}>
                                        <Table.Cell>error!!!</Table.Cell>
                                        
                                    </Table.Row>
                                )
                            }
                        })}
                        
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
                            <Menu floated='right' pagination>
                                <Menu.Item as='a' icon>
                                <Icon name='chevron left' />
                                </Menu.Item>
                                {chunckedTransactions.map(c=><Menu.Item onClick={()=>setCurrntPage(chunckedTransactions.indexOf(c)+1)} key={chunckedTransactions.indexOf(c)+1} as='a'>{chunckedTransactions.indexOf(c)+1}</Menu.Item>)}
                                <Menu.Item as='a' icon>
                                <Icon name='chevron right' />
                                </Menu.Item>
                            </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            
        </Fragment>
        
    ) : (<Fragment>
        <Modal open={open}  onClose={() => setOpen(false)} onOpen={() => setOpen(true)} trigger={<Button color="teal" floated="right" labelPosition='right' icon='plus' content='Create New Account' />}>
            <Modal.Header>Create New Account</Modal.Header>
            <Modal.Content>
                <Form noValidate className={loading?"loading":""}>
                    <Form.Input
                        label="Account Name"
                        placeholder="Account name"
                        name="name"
                        value={values.name}
                        error={errors.name?true:false}
                        onChange={onChange}
                    />
                </Form>
                {Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {Object.values(errors).map(val => (
                                <li key={val}>{val}</li>
                            ))}
          </ul>
        </div>
      )}
            </Modal.Content>
            <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create Account"
          labelPosition='right'
          icon='plus'
          onClick={(event) => {
              onSubmit(event);
              }}
          color = "teal"
        />
      </Modal.Actions>
        </Modal>
        <h1>My Accounts</h1>
        <Card.Group centered>
        {accounts.map(a=>
        (
            <Card onClick={()=>handleClick(a)} key={a.id}>
                <Card.Content textAlign="center">
                    <Statistic>
                        <Statistic.Value>{"$"+  Math.round(( a.balance + Number.EPSILON) * 100) / 100}</Statistic.Value>
                        <Statistic.Label>{a.name}</Statistic.Label>
                    </Statistic>
                </Card.Content>
                
            </Card>
    )
    )}
        </Card.Group>
    </Fragment>);

    return result;
}

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

const FETCH_TRANSACTIONS_QUERY = gql`
    {
        getTransactions{
            id
            senderUsername
            receiverUsername
            senderAccountId
            receiverAccountId
            amount
            createdAt
        }
    }  
`;

const OPEN_ACCOUNT = gql`
    mutation openAccount(
        $name: String!
    ) {
        openAccount(
                name: $name,
        ){
            id name balance createdAt username
        }
    }
`;

/*
var FETCH_ACCOUNTS_QUERY = gql`
    query getAccountsOfWhom($username: String!){
        getAccountsOfWhom(username: $username){
        id 
        name
        username
        balance
        createdAt
        }
    }  
`;
*/


export default Accounts;