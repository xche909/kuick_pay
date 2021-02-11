const { AuthenticationError } = require("apollo-server");
const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const checkAuth = require("../../util/checkAuth");
const { validatePayForm } = require("../../util/validators");

module.exports = {
    Query: {
        getTransactions: async () =>{
            try {
                const transactions = await Transaction.find(); 
                return transactions;
            } catch(error){
                throw new Error(error)
            }
        },

        getTransaction: async (_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                if (transaction){
                    return transaction;
                } else{
                    throw new Error("Transaction does not exist");
                }
            } catch (error){
                throw new Error(error);
            }
        }
    },
    Mutation: {
        makeTransaction: async(_,{amount, senderAccountId, receiverAccountId}, context)=>{
            //Check login status
            const user = checkAuth(context);
            try {
            //Check account exist and belongs to the user
            const senderAccount = await Account.findById(senderAccountId);
            if (senderAccount){
                if(senderAccount.username !== user.username){
                    throw new AuthenticationError("Action not allowed");
                }
            } else{
                throw new Error("Sender account not found");
            }
            //Check two accounts are not the same
            if (senderAccountId === receiverAccountId){
                throw new Error("Sending account and receiving account can not be the same");
            }
            //Validate user input data
            const {valid, errors} = validatePayForm(senderAccountId, receiverAccountId, amount);
            if (!valid){
                throw new UserInputError("Errors", {errors});
            }
            //Check amount exist
            if (amount.length === 0){
                throw new Error("Please enter an amount");
            }
            //Check amount is positive
            if (amount <= 0){
                throw new Error("Please enter a correct amount");
            }
            //Check user has got enough balance
            if (senderAccount.balance - amount < 0){
                throw new Error("Not sufficient fund");
            }
            //Check receiver account is valid
            const receiverAccount = await Account.findById(receiverAccountId);
            if (receiverAccount){
                //Make transaction happen
                senderAccount.balance -= amount;
                receiverAccount.balance += amount;
                await senderAccount.save();
                await receiverAccount.save();
                //Record transaction
                const newTransaction = new Transaction({
                    senderUsername: user.username,
                    receiverUsername: receiverAccount.username,
                    senderAccountId: senderAccount.id,
                    receiverAccountId: receiverAccount.id,
                    amount,
                    createdAt: new Date().toISOString()
                });

                const transaction = await newTransaction.save();
                return transaction;
            } else{
                throw new Error("Receiver account not found");
            }
            } catch(error){
                throw new Error(error);
            }
        }
    }
}