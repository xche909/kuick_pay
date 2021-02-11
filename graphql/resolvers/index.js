const userResolvers = require("./users");
const accountResolvers = require("./accounts");
const transactionResolvers = require("./transactions");

module.exports = {
    Query:{
        ...userResolvers.Query,
        ...accountResolvers.Query,
        ...transactionResolvers.Query,
    },

    Mutation:{
        ...userResolvers.Mutation,
        ...accountResolvers.Mutation,
        ...transactionResolvers.Mutation,
    }
}