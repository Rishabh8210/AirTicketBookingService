const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {PORT, DB_SYNC} = require('./config/serverConfig')
const ApiRoutes = require('./routes/index');
const app = express();
const db = require('./models/index');


const setupAndStartServer = async() => {
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cors());
    app.use('/api', ApiRoutes);

    app.listen(PORT, async() => {
        if(DB_SYNC){
            db.sequelize.sync({alter: true});
        }
        console.log(`Server is running at PORT ${PORT}`)
    })
}

setupAndStartServer();



