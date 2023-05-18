
// Setting up constants
const { apigee, ORG, ENVS }  = require('./app.js');
const { formatAxiosErr } = require("./utils.js");


// Function to list all environments
const listEnvironments = async () => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/environments`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("listEnvironments", error))
    }
};

// Function to list all apis
const listApis = async () => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/apis`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("listApis", error))
    }
};

// Function to get API proxy revision
const getApiProxyRevision = async (apiproxy, revision) => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/apis/${apiproxy}/revisions/${revision}`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("getApiProxyRevision", error))
    }
};

// Function to list API deployments
const listApiDeployments = async (apiproxy) => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/apis/${apiproxy}/deployments`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("listApiDeployments", error))
    }
};

// Function to list shared flow deployments
const listSharedFlowDeployments = async (sharedflow) => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/sharedflows/${sharedflow}/deployments`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("listSharedFlowDeployments", error))
    }
};

// Function to get shared flow revision
const getSharedFlowRevision = async (apiproxy, revision) => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/sharedflows/${apiproxy}/revisions/${revision}`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("getSharedFlowRevision", error))
    }
};

module.exports = {  
    listApis,
    listEnvironments,
    getApiProxyRevision,
    listApiDeployments,
    listSharedFlowDeployments,
    getSharedFlowRevision
};