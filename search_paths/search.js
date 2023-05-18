var prompt = require('prompt');

const { listApis, listApiDeployments, getApiProxyRevision } = require("../src/index");

const searchPaths = async (path, environment) => { 
    const { proxies: apis } = await listApis()

    let apisFromEnv = await Promise.all(apis.map(async (api) => {
        const { deployments } = await listApiDeployments(api.name);
        return deployments.flat();
    }))

    apisFromEnv = apisFromEnv.flat().filter((deploy) => deploy.environment === environment);

    let searchEntries = await Promise.all(apisFromEnv.map(async (apiDeployment) => {
        let res = await getApiProxyRevision(apiDeployment.apiProxy, apiDeployment.revision);
        let {name, basepaths} = res;
        return {name, basepaths };
    }))

    let pathExists = false;
    let apiName = "";
    
    searchEntries.forEach((entry) => {
        let exists = entry.basepaths.some((curPath) => curPath === path);
        if(exists) {
            pathExists = true;
            apiName = entry?.name;
        }
    })

    return { pathExists, apiName };
}

const main = (async () => { 
    prompt.start();
    prompt.get(['basepath', 'environment'], function (err, result) {
        searchPaths(result.basepath, result.environment)
            .then((res) => {
                console.log("--------------------------------------------------------")
                console.log(`Exists: ${res.pathExists}`)
                console.log(`API Name: ${res.apiName ? res.apiName : "None"}`)
                console.log("--------------------------------------------------------")

            })
            .catch(console.error); 
    });
    
})();

