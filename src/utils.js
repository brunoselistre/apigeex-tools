/**
 * Function to convert Unix epoch to ISO date
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

module.exports = { 
    unixEpochToIsoDate, 
    formatAxiosErr 
};