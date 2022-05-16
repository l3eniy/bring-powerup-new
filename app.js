var express = require("express");
const bringApi = require(`bring-shopping`);
const serverless = require('serverless-http')


const app = express();

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


   app.post('/addtobring', (req, res) => {

    // Die Liste übernehmen und an Bring schicken!!!
    var xy = req.body;
    console.log(xy);
    return res.send(`folgendes wurde empfangen: ${xy}`);
  });



   app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })



