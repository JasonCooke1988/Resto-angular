const express = require('express');
const app = express(),
    bodyParser = require('body-parser');
const mongoose = require('mongoose');
const tableSchema = require("./models");
const tableModel = mongoose.model('table', tableSchema);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/app/dist/resto/"));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/app/dist/resto/index.html")
});

app.get('/resto-admin', (req, res) => {
    res.sendFile(process.cwd() + "/app/dist/resto/index.html")
});

app.get('/api/tables', async (req, res, next) => {

    const tables = await tableModel.find();

    try {
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).send(error);
        console.log(error)
    }
});

app.post("/api/add_table", async (req, res) => {


    const table = new tableModel({...req.body});

    try {
        await table.save();
        res.send(table);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/api/save_table', async (req, res) => {

    const table = new tableModel({...req.body});

    try {
        await table.updateOne(table);
        res.send(table);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.put('/api/save_all_tables', async (req, res) => {

    // const tables = new tableModel.hydrate(req.body);
    const tables = tableModel.hydrate(req.body);

    const bulkOps = req.body.map(obj => {

        return {
            updateOne: {
                filter: {
                    _id: obj._id
                },
                update: {'$set': obj},
                upsert: true
            }
        }
    })

    try {
        tableModel.bulkWrite(bulkOps).then((BulkWriteResult) => {
            console.log("Tables updated", BulkWriteResult.modifiedCount)
        });
        res.send(tables);
    } catch (error) {
        console.log('error', error)
        res.status(500).send(error);
    }
})

module.exports = app;
