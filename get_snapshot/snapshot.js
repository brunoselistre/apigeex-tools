// Importing required modules
const fs = require('fs/promises');
const settings = require("./settings.json");
const { unixEpochToIsoDate } = require("../src/utils.js");
const { 
    listEnvironments, 
    listApiDeployments, 
    listSharedFlowDeployments, 
    getApiProxyRevision, 
    getSharedFlowRevision 
} = require("../src/index");

// Function to add deployments to snapshot
const addDeploymentsToSnapshot = async (deploys, snapshot, resource) => {
    for (const { deployments } of deploys) {
        await Promise.all(deployments.map(async (deployment) => {
            const deploymentEnv = deployment.environment;
            delete deployment.environment;

            if (!settings.environments?.includes(deploymentEnv))
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
 * Function to get snapshot (main function)
 * @returns exports snapshot to json file
 */
const getSnapshot = (async () => {
    const apis = settings.apiProxies;
    const sharedFlows = settings.sharedFlows;

    const environmentList = await listEnvironments();
    const snapshot = { apiProxies: {}, sharedFlows: {} };

    environmentList.forEach(env => {
        if (settings.environments?.includes(env)) {
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
        await fs.writeFile(`./exports/${ORG}_snapshot.json`, JSON.stringify(snapshot));
        console.log(`${ORG}_snapshot.json generated successfully!`);
    } catch (err) {
        console.log(err);
    }
})();