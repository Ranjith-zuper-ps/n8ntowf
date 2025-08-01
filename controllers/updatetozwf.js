const axios = require('axios');

module.exports = async function (wfData, convertedJson) {
    try {
        console.log('convertedJson', convertedJson, wfData);
        const apiUrl = `https://${wfData?.region}-workflow.zuperpro.com/api/workflows/${wfData?.workflow_uid}`; // Replace with your actual API URL

        const response = await axios.put(apiUrl,
            ({ "workflow": convertedJson }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': wfData?.api_key
                },

            }
        );

        return response.data;

    } catch (error) {
        console.error("Error in module export:", error);
        throw error;
    }
}