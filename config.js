const WORKFLOW_PAYLOAD = {
    "workflow": {
        "workflow_name": "Workflow-30-July-2025-19-55-12",
        "workflow_description": "",
        "nodes": [],
        "connections": {},
        "is_active": false,
        "meta_data": {}
    }
}

const NODE_CATEGORY_MAP = {
    "n8n-nodes-base.code": "FLOW",
    "n8n-nodes-base.if": "FLOW",
    "n8n-nodes-base.httpRequest": "HELPERS",
    "n8n-nodes-base.noOp": "FLOW"
}

const NODE_INPUT_MAP = {
    "n8n-nodes-base.code": {
        "input": 1,
        "output": 1
    },
    "n8n-nodes-base.webhook": {
        "input": 0,
        "output": 1
    },
    "n8n-nodes-base.httpRequest": {
        "input": 1,
        "output": 2
    },
    "n8n-nodes-base.if": {
        "input": 1,
        "output": 2
    },
    "n8n-nodes-base.noOp": {
        "input": 1,
        "output": 0
    }
}
const NODE_COLOR_MAP = {
    "n8n-nodes-base.code": {
        "main": "#2E8B57",
        "background": "#E0F4EC",
        "iconBackground": "#BEEAD6"
    },
    "n8n-nodes-base.httpRequest": {
        "main": "#4682B4",
        "background": "#DFEFF9",
        "iconBackground": "#C9DCE7"
    },
    "n8n-nodes-base.if": {
        "main": "#4682B4",
        "background": "#DFEFF9",
        "iconBackground": "#C9DCE7"
    },
    "n8n-nodes-base.noOp": {
        "background": "#DFEFF9",
        "iconBackground": "#C9DCE7",
        "main": "#4682B4"
    }
}
const NODE_ICON_MAP = {
    "n8n-nodes-base.code": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/7f22be08-936d-4e6b-a054-0c4a9a438913.svg",
    "n8n-nodes-base.httpRequest": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/14380500-c678-4798-b3b1-0abc9513abec.svg",
    "n8n-nodes-base.webhook": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/1f75e990-884b-11ee-b580-b3308ce481b4.svg",
    "n8n-nodes-base.if": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/e4ec79fc-21d9-428b-b615-243f7a681746.svg",
    "n8n-nodes-base.noOp": "https://s3.ap-south-1.amazonaws.com/staging.in.pro.zuper/attachments/6c287db0-ff7c-11e7-b3a8-29b417a4f3fa/d00b5202-9b28-49f6-96da-24ccc836dd86.svg"
}
// for node id
const NODE_TYPE_MAP = {
    "n8n-nodes-base.webhook": "external_webhook",
    "n8n-nodes-base.code": "code",
    "n8n-nodes-base.httpRequest": "http_request_v2",
    "n8n-nodes-base.if": "if_else",
    "n8n-nodes-base.noOp": "no_op"
}

const NODE_NAME_MAP = {
    "n8n-nodes-base.webhook": "external_webhook",
    "n8n-nodes-base.code": "code",
    "n8n-nodes-base.httpRequest": "http_request",
    "n8n-nodes-base.if": "if_else",
    "n8n-nodes-base.noOp": "no_op"
}

const ACTION_TYPE_MAP = {
    "n8n-nodes-base.webhook": "TRIGGER",
    "n8n-nodes-base.code": "ACTION",
    "n8n-nodes-base.httpRequest": "ACTION",
    "n8n-nodes-base.if": "ACTION",
    "n8n-nodes-base.noOp": "ACTION"
}

const NODE_ID_MAP = {
    "live": {
        "n8n-nodes-base.webhook": "b753a2d6-860c-49a7-b902-ac4e193140cd",
        "n8n-nodes-base.code": "d15fd095-70f3-4d53-9103-5786dfd52b37",
        "n8n-nodes-base.httpRequest": "462a06a3-b66e-413f-a937-475a98f2a42d",
        "n8n-nodes-base.if": "19dd8b19-5974-4a2c-9735-a9ca36ac5a4d",
        "n8n-nodes-base.noOp": "10092d00-c480-4096-8c1b-b1d040a2c3e1"
    },
    "staging": {
        "n8n-nodes-base.webhook": "5d8e0658-6703-11f0-b01b-02b972573ccd",
        "n8n-nodes-base.code": "5d8e0c56-6703-11f0-b01b-02b972573ccd",
        "n8n-nodes-base.httpRequest": "5d8e2562-6703-11f0-b01b-02b972573ccd",
        "n8n-nodes-base.if": "5d8e09a9-6703-11f0-b01b-02b972573ccd",
        "n8n-nodes-base.noOp": "5d8e1889-6703-11f0-b01b-02b972573ccd"
    },
}

const OPERATION_VALUE_MAP = {
    "equals": "EQUAL_TO",
    "notEquals": "NOT_EQUAL_TO",
    "gt": "GREATER_THAN",
    "lt": "LESS_THAN",
    "gte": "GREATER_THAN_OR_EQUAL_TO",
    "lte": "LESS_THAN_OR_EQUAL_TO",
    "empty": "EMPTY",
    "notExists": "EMPTY",
    "not_empty": "NOT_EMPTY",
    "exists": "NOT_EMPTY",
}

const FIELD_TYPE_MAP = {
    "string": "STRING",
    "number": "NUMBER",
    "boolean": "BOOLEAN",
    "date": "DATE",
    "object": "OBJECT",
    "array": "ARRAY",
}


module.exports = {
    WORKFLOW_PAYLOAD,
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
}