const express = require('express');

const app = express(),
bodyParser = require('body-parser');

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

app.get('/api/tables', (req, res, next) => {
    const tables = [
            {
                id: 1,
                width: 50,
                height: 50,
                x: 100,
                y: 100,
                tableNumber: 1,
                seats: 2,
                selected: false,
                hovering: false
            },
            {
                id: 2,
                width: 100,
                height: 50,
                x: 200,
                y: 200,
                tableNumber: 2,
                seats: 5,
                selected: false,
                hovering: false
            }
        ]
    ;
    res.status(200).json(tables);
});

module.exports = app;
