var express = require("express");
const bringApi = require(`bring-shopping`);
const serverless = require('serverless-http')


const app = express();
const router = express.Router();

app.use(express.static('src'));

const bring = new bringApi({mail: `benjamin.fuhlbruegge@gmail.com`, password: `9PiC!TSxnRXLrG&Q`});



app.get("/", async (req, res, next) => {
    try {
        await bring.login();
        console.log(`Successfully logged in as ${bring.name}`);
    } catch (e) {
        console.error(`Error on Login: ${e.message}`);
    }

    var x = await bring.loadLists();
    res.json(x);
   });

   app.get("/test", (req, res, next) => {
    res.json({"hello" : "test"});
   });


app.use('/.netlify/functions/app', router)


module.exports.handler = serverless(app)