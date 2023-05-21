var prompt = require('prompt');

const { listApis, listApiDeployments, getApiProxyRevision } = require("../src/index");

const searchPaths = async (path) => { 
    let pathExists, apiName, environments;

    const { proxies: apis } = await listApis()

    let apisFromEnv = await Promise.all(apis.map(async (api) => {
        const { deployments } = await listApiDeployments(api.name);
        return deployments.flat();
    }))

    let searchEntries = await Promise.all(
        apisFromEnv.flat().reduce((acc, obj) => {
            // Group environments from deploys
            const existingObj = acc.find(item => item.apiProxy === obj.apiProxy);
            if (existingObj)
                existingObj.environments.push(obj.environment);
            else 
                acc.push({ environments: [obj.environment], apiProxy: obj.apiProxy, revision: obj.revision });

            return acc;
        }, [])
        .map(async (apiDeployment) => {
            // Filter unnecessary info from response 
            let res = await getApiProxyRevision(apiDeployment.apiProxy, apiDeployment.revision);
            let { name, basepaths } = res;
            return { name, basepaths, environments: apiDeployment.environments };
        }
    ));

    searchEntries.forEach((entry) => {
        let exists = entry.basepaths.some((curPath) => curPath === path);
        if(exists) {
            pathExists = exists;
            apiName = entry?.name;
            environments = entry?.environments;
        }
    })
    return { pathExists, apiName, environments };
}

async function main() {
    prompt.start();
    prompt.get(['basepath'], function (err, result) {
        searchPaths(result.basepath)
            .then((res) => {
                console.log("--------------------------------------------------------")
                console.log(`Exists: ${res?.pathExists || "None"}`)
                console.log(`API Name: ${res?.apiName || "None"}`)
                console.log(`Deployments: ${res?.environments || "None"}`)
                console.log("--------------------------------------------------------")
            })
            .catch(console.error)
            .finally(() => prompt.get(['continue(y/n)'], (err, result) =>  (result['continue(y/n)'].toLowerCase() === 'y' ? main() : undefined)));
    });
};
main()
