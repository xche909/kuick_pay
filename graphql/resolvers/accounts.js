const Account = require("../../models/Account");
const checkAuth = require("../../util/checkAuth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
    Query:{
        getAccounts : async () =>{
            try {
                const accounts = await Account.find().sort({createdAt: -1});
                return accounts;
            } catch (error){
                throw new Error(error);
            }
        },

        getAccount : async (_,{accountId}) =>{
            try {
                const account = await Account.findById(accountId);
                if (account){
                    return account;
                } else{
                    throw new Error("Account not found");
                }
            } catch (error){
                throw new Error(error);
            }
        },

        getAccountsOfWhom: async (_, {username}) => {
            try {
                const accounts = await Account.find({username});
                return accounts;
                
            } catch (error){
                throw new Error(error);
            }
        }
    },

    Mutation:{
        openAccount : async (_,{name, balance = 0}, context) => {
            const user = checkAuth(context);
            if (name.trim()===""){
                throw new Error("Account name must not be empty");
            }
            //Check 
            const newAccount = new Account({
                name,
                balance,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const account = await newAccount.save();

            return account;
        },

        changeAccountName: async (_,{accountId, name},context)=>{
            const user = checkAuth(context);
            try{
                const account = await Account.findById(accountId);
                if (account){
                    if (account.username === user.username){
                        account.name = name;
                        await account.save();
                        return account;
                    } else{
                        throw new AuthenticationError("Action not allowed");
                    }
                } else{
                    throw new Error("Account not found");
                }
            } catch(error){
                throw new Error(error);
            }
        },

        closeAccount: async (_, {accountId}, context) => {
            const user = checkAuth(context);

            try{
                const account = await Account.findById(accountId);
                if (account){
                    if (account.username === user.username){
                        await account.delete();
                        return "Account closed successfully!";
                    } else{
                        throw new AuthenticationError("Action not allowed");
                    }
                } else{
                    throw new Error("Account not found");
                }
            } catch (error){
                throw new Error(error);
            }

        }
    }
}