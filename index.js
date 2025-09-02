const express = require('express');
const multer = require('multer');

const fs = require('fs');
const path = require('path');
const cors = require('cors');

const createNewWorkflow = require('./controllers/createwf.js');
const convertN8nToZuper = require('./controllers/convertn8ntozwf.js')
const updateToZuperWorkflow = require('./controllers/updatetozwf.js');

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Optional: serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.ejs
});


// Set up multer to handle multipart/form-data
const storage = multer.memoryStorage(); // or diskStorage for saving to disk
const upload = multer({ storage });

// Route to handle file and JSON
// For example, file field is 'file', JSON field is 'data'
app.post('/api/migratewf', upload.single('file'), async (req, res) => {

    const file = req.file; // file data
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileContents = JSON.parse(file.buffer.toString('utf-8'));

    if (!req.body.data) {
        return res.status(400).json({ error: 'No JSON data provided' });
    }


    const requiredFields = ['workflow_name', 'env', 'region', 'api_key'];
    let workFlowInfo;
    try {
        workFlowInfo = JSON.parse(req.body.data);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON data' });
    }

    const missingFields = requiredFields.filter(field => !(field in workFlowInfo));
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    let workflowData = await createNewWorkflow(workFlowInfo);
    if (!workflowData || workflowData.type !== 'success') {
        return res.status(500).json({ message: 'Failed to create workflow', error: workflowData?.error });
    }
    workFlowInfo['workflow_uid'] = workflowData.workflow_uid;
    // Convert to zuper workflow
    let convertedJson = await convertN8nToZuper(workFlowInfo, fileContents);

    fs.writeFileSync('./converted-to-zuper.json', JSON.stringify(convertedJson, null, 2));
    let updateResponse = await updateToZuperWorkflow(workFlowInfo, convertedJson);

    if (!updateResponse || updateResponse.type !== 'success') {
        return res.status(500).json({ message: 'Failed to update workflow', error: updateResponse?.error });
    }

    res.json({ message: 'Workflow updated successfully', data: updateResponse });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});