/\*\*

- Express server for migrating n8n workflows to Zuper workflows.
-
- Features:
- - Renders a homepage using EJS templating engine.
- - Serves static files from the 'public' directory.
- - Provides an API endpoint `/api/migratewf` to handle workflow migration:
- - Accepts a multipart/form-data POST request with:
-     - 'file': n8n workflow JSON file.
-     - 'data': workflow metadata JSON string (must include workflow_name, env, region, api_key).
- - Validates required fields in metadata.
- - Creates a new workflow in Zuper using metadata.
- - Converts n8n workflow JSON to Zuper workflow format.
- - Saves the converted workflow to a local file (`converted-to-zuper.json`).
- - Updates the created Zuper workflow with the converted workflow data.
- - Returns success or error response.
-
- Dependencies:
- - express: Web framework.
- - multer: Handles file uploads.
- - fs, path: File system utilities.
- - EJS: Templating engine.
- - createwf.js: Creates a new workflow in Zuper.
- - convertn8ntozwf.js: Converts n8n workflow JSON to Zuper format.
- - updatetozwf.js: Updates Zuper workflow with converted data.
-
- Usage:
- - Start the server and POST to `/api/migratewf` with required fields and n8n workflow file.
    \*/
