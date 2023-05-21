// Importing configuration
require('dotenv').config()
const axios = require("axios");

// Setting up constants
const TOKEN = process.env.TOKEN;
const ORG = process.env.ORG;
const ENVS = process.env.ENVS;

// Creating axios instance
const apigee = axios.create({
    baseURL: "https://apigee.googleapis.com",
    timeout: 5000,
    headers: { Authorization: `Bearer ${TOKEN}` },
});

// Exporting module
module.exports = { 
    TOKEN,
    ORG,
    ENVS,  
    apigee
};