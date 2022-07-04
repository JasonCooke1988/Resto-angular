const express = require('express');

const app = express(),
bodyParser = require('body-parser');
const tableModel = require("./models");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/app/dist/resto/"));

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/app/dist/resto/index.html")
});

app.get('/resto-admin', (req,res) => {
    res.sendFile(process.cwd()+"/app/dist/resto/index.html")
});

app.get('/api/tables', async (req, res, next) => {
    const tables = await tableModel.find();

    try{
        res.status(200).json(tables);
    } catch (error){
        res.status(500).send(error);
    }
});

app.post("/api/add_table", async (request, response) => {
    const table = new tableModel(request.body);

    try {
        await table.save();
        response.send(table);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;
