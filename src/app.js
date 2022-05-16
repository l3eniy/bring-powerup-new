var express = require("express");
const bringApi = require(`bring-shopping`);
const serverless = require('serverless-http')
require('../build/html/index.html')


const app = express();
const router = express.Router();



const bring = new bringApi({mail: `benjamin.fuhlbruegge@gmail.com`, password: `9PiC!TSxnRXLrG&Q`});


router.get("/", async (req, res, next) => {
    try {
        await bring.login();
        console.log(`Successfully logged in as ${bring.name}`);
    } catch (e) {
        console.error(`Error on Login: ${e.message}`);
    }

    var x = await bring.loadLists();
    res.json(x);
   });


   router.get("/test", (req, res, next) => {
    res.json({"hello" : "test"});
   });


app.use('/api', router)


module.exports.handler = serverless(app)