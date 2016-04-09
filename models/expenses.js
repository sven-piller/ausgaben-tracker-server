var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var timestamps = require("mongoose-times");

var ExpenseSchema = new Schema({
    date: String,
    content: String,
    merchant: String,
    categories: String,
    amount: String
});

ExpenseSchema.plugin(timestamps);

module.exports = mongoose.model('Expense', ExpenseSchema);
