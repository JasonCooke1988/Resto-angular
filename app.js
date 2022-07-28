const express = require('express');
const app = express(),
    bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {tableSchema, reservationSchema} = require("./models");
const tableModel = mongoose.model('table', tableSchema);
const reservationModel = mongoose.model('reservation', reservationSchema);

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

app.put('/api/save_tables', async (req, res) => {

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

    return await tableModel.bulkWrite(bulkOps)
        .then((BulkWriteResult) => {
        console.log("Tables updated", BulkWriteResult.modifiedCount)
        res.send({success: true});
        })
        .catch((error) => res.send({success: false, errorCode: error.code}));
})

app.delete('/api/delete_table', async (req, res) => {

    const table = new tableModel({...req.body});

    try {
        await table.deleteOne(table);
        res.send(table);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post('/api/save_reservation', async (req, res) => {

    const reservation = {
        date: req.body.date,
        tableNumber: req.body.tableNumber
    }

    return await reservationModel.create(reservation)
        .then(() => {
            console.log('reservation created')
            res.send({success: true})
        })
        .catch((error) => res.send({success: false, error: error}));
})

app.get('/api/delete_all_reservations', async (req, res) => {

    return reservationModel.deleteMany({});
})


module.exports = app;
