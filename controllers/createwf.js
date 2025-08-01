const axios = require('axios');

let { WORKFLOW_PAYLOAD } = require('../config.js');

module.exports = async function createWorkflow(workflowInfo) {
    try {
        let workflowPayload = WORKFLOW_PAYLOAD;
        workflowPayload.workflow.workflow_name = workflowInfo.workflow_name;
        const response = await axios.post(
            `https://${workflowInfo?.region}-workflow.zuperpro.com/api/workflows`,
            workflowPayload,
            {
                headers: { 'x-api-key': workflowInfo.api_key },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(JSON.stringify(error.response.data));
        }
        throw error;
    }
}