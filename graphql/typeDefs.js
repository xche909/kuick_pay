const { gql } = require("apollo-server");

//These are GraphQl type definitions
//Each of them corresponds to one model in MongoDb
//with the same attributes but with one more called "id" of type ID!.
//for user, one more extra "token"

module.exports = gql `
    type User{
        id: ID!,
        username: String!,
        password: String!,
        email: String!,
        createdAt: String!,
        firstName: String!,
        lastName: String!,
        token: String!
    }
    
    input RegisterInput{
        username: String!,
        password: String!,
        confirmPassword: String!,
        email: String!,
        firstName: String!,
        lastName: String!,
    }

    type Account{
        id: ID!,
        name: String!
        username: String!,
        createdAt: String!,
        balance: Float!,
    }

    type Transaction{
        id: ID!,
        senderUsername: String!,
        receiverUsername: String!,
        senderAccountId: ID!,
        receiverAccountId: ID!,
        amount: Float!,
        createdAt: String!
    }

    type Query {
        getUsers: [User],
        getAccounts: [Account],
        getAccount(accountId: ID!): Account,
        getAccountsOfWhom(username: String!): [Account],
        getTransactions: [Transaction],
        getTransaction(transactionId: ID!): Transaction,
    }

    type Mutation {
        register(registerInput: RegisterInput): User!,
        login(username: String, password: String): User!,
        changePassword(username: String, password: String, newPassword: String, confirmNewPassword: String): User!,
        openAccount(name: String, balance: Int): Account!,
        closeAccount(accountId: ID!): String! ,
        changeAccountName(accountId: ID!, name: String): Account!,
        makeTransaction(amount: Float!, senderAccountId: ID!, receiverAccountId: ID!): Transaction!
    }
`