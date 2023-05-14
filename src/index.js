// Importing required modules
const fs = require('fs/promises');
const axios = require("axios");

// Importing configuration
const config = require("../config.json");
const ENVS = config.environments;

// Setting up constants
const ORG = config.organization;
const TOKEN = config.token;


// Creating axios instance
const apigee = axios.create({
    baseURL: "https://apigee.googleapis.com",
    timeout: 5000,
    headers: { Authorization: `Bearer ${TOKEN}` },
});

// Function to list all environments
const listEnvironments = async () => {
    try {
        const { data } = await apigee.get(`/v1/organizations/${ORG}/environments`);
        return data;
    } catch (error) {
        console.log(formatAxiosErr("listEnvironments", error))
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

// Function to add deployments to snapshot
const addDeploymentsToSnapshot = async (deploys, snapshot, resource) => {
    for (const { deployments } of deploys) {
        await Promise.all(deployments.map(async (deployment) => {
            const deploymentEnv = deployment.environment;
            delete deployment.environment;

            if (!ENVS.includes(deploymentEnv))
                return;


            deployment.deployStartTime = unixEpochToIsoDate(deployment.deployStartTime);

            const revisionFn = (resource === "apiProxies") ? getApiProxyRevision : getSharedFlowRevision;
            const revisionMetadata = await revisionFn(deployment.apiProxy, deployment.revision);

            if (resource === "sharedFlows") {
                deployment.sharedFlow = deployment.apiProxy;
                delete deployment.apiProxy;
            }

            if (revisionMetadata?.lastModifiedAt)
                deployment.lastModifiedAt = unixEpochToIsoDate(revisionMetadata.lastModifiedAt);

            if (revisionMetadata?.basepaths)
                deployment.basepaths = revisionMetadata.basepaths;

            snapshot[resource][deploymentEnv].push(deployment);
        }));
    }
};

/**
 * Function to get snapshot (Consider as main function)
 * @returns exports snapshot to json file
 */
const getSnapshot = (async () => {
    const apis = config.apiProxies;
    const sharedFlows = config.sharedFlows;

    const environmentList = await listEnvironments();
    const snapshot = { apiProxies: {}, sharedFlows: {} };

    environmentList.forEach(env => {
        if (ENVS.includes(env)) {
            snapshot.apiProxies[env] = [];
            snapshot.sharedFlows[env] = [];
        }
    });

    const fetchApiDeployments = apis.map(api => listApiDeployments(api.name));
    const fetchSharedFlowDeployments = sharedFlows.map(sharedFlow => listSharedFlowDeployments(sharedFlow.name));

    const apiDeployments = await Promise.all(fetchApiDeployments);
    const sharedFlowDeployments = await Promise.all(fetchSharedFlowDeployments);

    await addDeploymentsToSnapshot(apiDeployments, snapshot, 'apiProxies');
    await addDeploymentsToSnapshot(sharedFlowDeployments, snapshot, 'sharedFlows');

    try {
        await fs.writeFile(`./snapshots/${ORG}_snapshot.json`, JSON.stringify(snapshot));
        console.log(`${ORG}_snapshot.json generated successfully!`);
    } catch (err) {
        console.log(err);
    }
})();

// Function to convert Unix epoch to ISO date
/**
 * 
 * @param {*} epoch 
 * @returns 
 */
const unixEpochToIsoDate = (epoch) => new Date(Number(epoch)).toISOString();

// Function to format Axios error
const formatAxiosErr = (sourceFn, err) => {
    const { status, message, code } = err.response.data.error || {};
    const { method, baseURL, url } = err.response.config || {};
    const request = { reqMethod: method?.toUpperCase(), reqHost: baseURL, reqPath: url };
    const response = { code, status, message };
    return { errTriggeredBy: sourceFn, request, response };
};