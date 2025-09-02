const {
    NODE_CATEGORY_MAP,
    NODE_INPUT_MAP,
    NODE_COLOR_MAP,
    NODE_ICON_MAP,
    NODE_TYPE_MAP,
    NODE_NAME_MAP,
    ACTION_TYPE_MAP,
    NODE_ID_MAP,
    OPERATION_VALUE_MAP,
    FIELD_TYPE_MAP
} = require('../config.js');

function hasExpression(str) {
    return /{{[^{}]+}}/.test(str);
}

function convertJsonObjectAccess(expr) {
    
    expr = expr.replace(
        /\$\(['"]([^'"]+)['"]\)\.all\(\)\[0\]\.json(?!\.)/g,
        (_, nodeName) => `$.getNodeData('${nodeName}')[0]['data']`
    );
    
    expr = expr.replace(
        /\$\(['"]([^'"]+)['"]\)\.item\.json(?!\.)/g,
        (_, nodeName) => `$.getNodeData('${nodeName}')[0]['data']`
    );
    return expr;
}

function convertN8nExpression(expression, nodeMap) {
    if (!expression || typeof expression !== 'string') return expression;

    expression = convertJsonObjectAccess(expression);

    //{{ $json.field }} case
    expression = expression.replace(/\{\{\s*\$json\.([a-zA-Z0-9_]+)\s*\}\}/g,
        (_, field) => `{{$.getNodeData('__CURRENT_NODE__')[0]['data']['${field}']}}`
    );

    // {{ $('Node Name').all()[0].json.field }} case
    expression = expression.replace(
        /\{\{\s*\$\(\s*'([^']+)'\s*\)\.all\(\)\[0\]\.json\.([a-zA-Z0-9_]+)\s*\}\}/g,
        (_, nodeName, field) => `{{$.getNodeData('${nodeName}')[0]['data']['${field}']}}`
    );

    // $json.field
    expression = expression.replace(/\$json\.([a-zA-Z0-9_]+)/g,
        (_, field) => `$.getNodeData('__CURRENT_NODE__')[0]['data']['${field}']`
    );
    // $('Node Name').all()[0].json.field
    expression = expression.replace(
        /\$\(['"]([^'"]+)['"]\)\.all\(\)\[0\]\.json\.([a-zA-Z0-9_]+)/g,
        (_, nodeName, field) => `$.getNodeData('${nodeName}')[0]['data']['${field}']`
    );
    // $('Node Name').item.json.field
    expression = expression.replace(
        /\$\(['"]([^'"]+)['"]\)\.item\.json\.([a-zA-Z0-9_]+)/g,
        (_, nodeName, field) => `$.getNodeData('${nodeName}')[0]['data']['${field}']`
    );

    return expression;
}

function convertExpressionInObject(obj, nodeMap) {
    if (typeof obj === 'string') {
        return convertN8nExpression(obj, nodeMap);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => convertExpressionInObject(item, nodeMap));
    }
    
    if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = convertExpressionInObject(obj[key], nodeMap);
        }
        return newObj;
    }
    
    return obj;
}

function replaceCurrentNodePlaceholder(obj, nodeName) {
    if (typeof obj === 'string') {
        return obj.replace(/__CURRENT_NODE__/g, nodeName);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => replaceCurrentNodePlaceholder(item, nodeName));
    }
    
    if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = replaceCurrentNodePlaceholder(obj[key], nodeName);
        }
        return newObj;
    }
    
    return obj;
}

function convertParameters(nodeType, parameters, region = "", workflowUID) {
    switch (nodeType) {
        case 'code':
            return { "code": parameters.jsCode };
        case 'http_request_v2':
            return {
                method: {
                    type: hasExpression(parameters?.method || "") ? "EXPRESSION" : "FIXED",
                    value: (parameters.method || 'GET').replace(/^=/, ""),
                },
                url: {
                    type: hasExpression(parameters?.url || "") ? "EXPRESSION" : "FIXED",
                    value: (parameters.url || "").replace(/^=/, ""),
                },
                timeout: {
                    type: "FIXED",
                    value: parameters.timeout !== undefined ? parameters.timeout : 60,
                },
                password: {
                    type: "FIXED",
                    value: parameters.password || "",
                },
                username: {
                    type: "FIXED",
                    value: parameters.username || "",
                },
                json_body: {
                    type: hasExpression(parameters?.jsonBody || "") ? "EXPRESSION" : "FIXED",
                    value: (parameters.jsonBody || "").replace(/^=/, ""),
                },
                send_body: {
                    type: "FIXED",
                    value: parameters?.jsonBody ? true : false,
                },
                ignore_ssl: {
                    type: "FIXED",
                    value: parameters.ignoreSsl !== undefined ? parameters.ignoreSsl : false,
                },
                content_type: {
                    type: "FIXED",
                    value: parameters.contentType || "application/json",
                },
                error_action: {
                    type: "FIXED",
                    value: parameters.errorAction || "CONTINUE",
                },
                send_headers: {
                    type: "FIXED",
                    value: parameters.headerParameters?.parameters.length ? true : false,
                },
                raw_body_data: {
                    type: "FIXED",
                    value: parameters.rawBodyData || "",
                },
                authentication: {
                    type: "FIXED",
                    value: parameters.authentication || "NONE",
                },
                body_data_type: {
                    type: "FIXED",
                    value: parameters.bodyDataType || "JSON",
                },
                query_parameters: Array.isArray(parameters?.queryParameters?.parameters)
                    ? parameters.queryParameters.parameters.map(q => ({
                        query_key: {
                            type: hasExpression(q?.name) ? "EXPRESSION" : "FIXED",
                            value: (q.name || "").replace(/^=/, "")
                        },
                        query_value: {
                            type: hasExpression(q?.value) ? "EXPRESSION" : "FIXED",
                            value: (q.value || "").replace(/^=/, "")
                        }
                    }))
                    : [],
                send_query_param: {
                    type: "FIXED",
                    value: parameters.sendQueryParam !== undefined ? parameters.sendQueryParam : false,
                },
                body_content_type: {
                    type: "FIXED",
                    value: parameters.bodyContentType || "JSON",
                },
                header_parameters: (parameters.headerParameters?.parameters || []).map(h => ({
                    header_key: {
                        type: hasExpression(h?.name) ? "EXPRESSION" : "FIXED",
                        value: (h.name || "").replace(/^=/, "")
                    },
                    header_value: {
                        type: hasExpression(h?.value) ? "EXPRESSION" : "FIXED",
                        value: (h.value || "").replace(/^=/, "")
                    }
                })),
                form_data_parameters: Array.isArray(parameters?.formDataParameters?.parameters)
                    ? parameters.formDataParameters.parameters.map(f => ({
                        form_key: {
                            type: hasExpression(f?.name) ? "EXPRESSION" : "FIXED",
                            value: (f.name || "").replace(/^=/, "")
                        },
                        form_value: {
                            type: hasExpression(f?.value) ? "EXPRESSION" : "FIXED",
                            value: (f.value || "").replace(/^=/, "")
                        }
                    }))
                    : [],
                body: {
                    type: "json",
                    value: parameters.jsonBody || null,
                },
            };
        case 'external_webhook':
            return {
                "url": { "type": "FIXED", "value": "" },
                "method": { "type": "FIXED", "value": "GET" },
                "live_url": {
                    "type": "FIXED",
                    "value": `https://${region}-workflow.zuperpro.com/api/gatekeeper/workflow/webhook/${workflowUID}`
                },
                "test_url": {
                    "type": "FIXED",
                    "value": `https://${region}-workflow.zuperpro.com/api/gatekeeper/workflow/webhook-test/${workflowUID}`
                },
                "send_headers": { "type": "FIXED", "value": false },
                "respond_after": { "type": "FIXED", "value": false },
                "webhook_method": {
                    "type": "FIXED",
                    "value": parameters?.httpMethod || "POST"
                },
                "header_parameters": []
            }
        case 'if_else':
            return convertN8nConditionsToZuper(parameters?.conditions);
        default:
            return parameters;
    }
}

function convertN8nConditionsToZuper(n8nConditions) {
    const conditions = [];
    const combine = {
        "type": "FIXED",
        "value": n8nConditions?.combinator.toUpperCase() || "AND"
    }

    if (!n8nConditions || !Array.isArray(n8nConditions?.conditions)) {
        return conditions;
    }

    for (const cond of n8nConditions.conditions) {
        const zuperCondition = {
            field_key: FIELD_TYPE_MAP[cond?.operator?.type] || "STRING",
            operation: {
                type: "FIXED",
                value: OPERATION_VALUE_MAP[cond.operator?.operation] || cond.operator?.operation || "EQUALS"
            },
            value1: {
                type: hasExpression(cond.leftValue) ? "EXPRESSION" : "FIXED",
                value: cond.leftValue || ""
            },
            value2: {
                type: hasExpression(cond.rightValue) ? "EXPRESSION" : "FIXED",
                value: cond.rightValue || ""
            }
        };

        if (cond.operator && cond.operator.type === "boolean") {
            zuperCondition.operation.value = cond.operator.operation === "true" ? "NOT_EMPTY" : "EMPTY";
        } else {
            zuperCondition.value2.value = cond.rightValue || "";
        }

        conditions.push(zuperCondition);
    }

    return { combine, conditions };
}

module.exports = function (wfData, n8nJson) {
    const nodeMap = {};
    const nodes = n8nJson?.nodes?.map((node) => {
        let nodeType = NODE_TYPE_MAP[node?.type] || node.type.replace("n8n-nodes-base.", "");
        if (nodeType === "n8n-nodes-base.noOp") nodeType = "noOp";
        
        // Use original node name as ID
        const zuperNodeId = node.name;
        nodeMap[node.name] = zuperNodeId;
        
        let formFields = convertParameters(
            nodeType, 
            node.parameters || {}, 
            wfData?.region, 
            wfData?.workflow_uid
        );
        
        // Convert n8n expressions to Zuper format
        formFields = convertExpressionInObject(formFields, nodeMap);
        
        let zwfData = {
            id: zuperNodeId,
            node_uid: node.id,
            node_name: NODE_NAME_MAP[node?.type],
            node_display_name: nodeType,
            action_key: NODE_NAME_MAP[node?.type],
            action_name: node?.name,
            action_type: ACTION_TYPE_MAP[node?.type] || "ACTION",
            module: "",
            description: "",
            credentials: {},
            is_active: true,
            input: NODE_INPUT_MAP[node?.type]?.input || 1,
            output: NODE_INPUT_MAP[node?.type]?.output || 1,
            node_icon: NODE_ICON_MAP[node?.type],
            color: NODE_COLOR_MAP[node?.type],
            position: {
                x: node.position[0],
                y: node.position[1]
            },
            form_fields: formFields,
            node_category: NODE_CATEGORY_MAP[node.type] || "FLOW",
            master_node_uid: NODE_ID_MAP[wfData?.env][node.type],
        };
        
        // Replace __CURRENT_NODE__ placeholder with actual node name
        zwfData.form_fields = replaceCurrentNodePlaceholder(
            zwfData.form_fields, 
            node.name
        );

        if (NODE_COLOR_MAP[node?.type]) {
            zwfData['color'] = NODE_COLOR_MAP[node?.type];
        }

        return zwfData;
    });

    const connections = [];
    const n8nConnections = n8nJson.connections || {};

    Object.entries(n8nConnections).forEach(([sourceNodeName, outputs]) => {
        outputs.main.forEach((targets, i) => {
            targets.forEach((conn) => {
                const sourceId = nodeMap[sourceNodeName];
                const targetId = nodeMap[conn.node];
                
                if (!sourceId || !targetId) return;
                
                // Get source node type for handle determination
                const sourceNode = n8nJson.nodes.find(n => n.name === sourceNodeName);
                const sourceNodeType = sourceNode ? 
                    NODE_TYPE_MAP[sourceNode?.type] || sourceNode.type.replace("n8n-nodes-base.", "") : 
                    "";
                
                let sourceHandle = "one-a";
                switch (sourceNodeType) {
                    case "external": 
                        sourceHandle = "trigger-a";
                        break;
                    case "http_request_v2":
                    case "if_else":
                        if (i === 0) sourceHandle = "two-a";
                        else if (i === 1) sourceHandle = "two-b";
                        break;
                }
                
                connections.push({
                    id: `reactflow__edge-${sourceId}-${sourceHandle}-${targetId}-a`,
                    type: "buttonEdge",
                    source: sourceId,
                    target: targetId,
                    markerEnd: { type: "arrow" },
                    sourceHandle: sourceHandle,
                    targetHandle: "a"
                });
            });
        });
    });

    return {
        workflow_uid: wfData?.workflow_uid,
        workflow_name: n8nJson?.name || wfData?.workflow_name || `Workflow-${new Date().toISOString()}`,
        workflow_description: "",
        workflow_icon: "https://zuper.co/favicon.ico",
        nodes,
        connections,
        is_active: false,
    };
}