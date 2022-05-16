var express = require("express");
const bringApi = require(`bring-shopping`);
var app = express();
app.use(express.static('src'));

const bring = new bringApi({mail: `benjamin.fuhlbruegge@gmail.com`, password: `9PiC!TSxnRXLrG&Q`});


app.get("/url", async (req, res, next) => {
    try {
        await bring.login();
        console.log(`Successfully logged in as ${bring.name}`);
    } catch (e) {
        console.error(`Error on Login: ${e.message}`);
    }

    var x = await bring.loadLists();
    res.json(x);
   });

app.listen(3000, () => {
 console.log("Server running on port 3000");
});