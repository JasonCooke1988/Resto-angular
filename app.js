const express = require('express');
const app = express(),
    bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
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

    const newReservation = {
        date: req.body.date,
        tableNumber: req.body.tableNumber
    }

    let permissionToCreate = true;

    // const date = new Date(reservation.date);
    // const parsedDate = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`

    const day = moment(newReservation.date).format('YYYY-MM-DD');
    const newReservationMoment = moment(newReservation.date);

    console.log('parsed date:', day)

    //Tries to find all reservations for that table happening on the same day
    await reservationModel.find({
        // date: reservation.date,
        date: {$gte: day},
        tableNumber: newReservation.tableNumber
    }).then((res) => {
        console.log('Reservation duplicate check :', res)

        //Check if result is null if not check each reservation to see if new reservation conflicts with existing ones
        if (res != null) {
            console.log('checking reservations from db :')
            res.forEach(reservation => {
                let before = moment(reservation.date).subtract(2, 'hours')
                let after = moment(reservation.date).add(2, 'hours')

                if (newReservationMoment.isBetween(before,after)){
                    permissionToCreate = false;
                }
            })

        } else {
            console.log('response from db is null')
            permissionToCreate = false;
        }

        console.log('permissionToCreate :', permissionToCreate)
    }).catch((err) => {
        console.error(err)
    });

    if (!permissionToCreate) {
        return res.send({success: false, error: 'Reservation existe déjà'});
    }

    // return await reservationModel.create(newReservation)
    //     .then(() => {
    //         console.log('reservation created')
    //         res.send({success: true})
    //     })
    //     .catch((error) => res.send({success: false, error: error}));
})

app.get('/api/delete_all_reservations', async (req, res) => {

    return reservationModel.deleteMany({});
})


module.exports = app;
