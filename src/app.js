// Importing configuration
const config = require("../config.json");
const axios = require("axios");

// Setting up constants
const TOKEN = config.token;
const ORG = config.organization;
const ENVS = config.environments;

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