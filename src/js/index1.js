const request_promise_native_1 = __importDefault(require("request-promise-native"));

var BRING_ICON = 'https://global-uploads.webflow.com/5fbe6548a005d56f0dd39a2e/5fc24a65f7e1555200865e1b_bring-logo.svg';
var Promise = TrelloPowerUp.Promise
var TRELLO_API_KEY = "00c34f6aad85b68994bdc5dbc0c5454a"
var API_CALLS_SLEEP_DURATION = 125



var onBtnClick = function (t, opts) {
    console.log('Someone clicked the button');
    let x = t.get('member', 'private', 'auth');
    console.log(x);
};


function onCardChecklistsClick (e) {
    return ensureUserAuthorized(e, function () {
        return e.popup({
            title: "Download Checklists As...",
            items: [{text: "TXT file", callback: downloadCardChecklists}]
        })
    })
}

function ensureUserAuthorized(e, t) {
    return e.get("member", "private", "token").then(function (n) {
        return n ? t() : renderAuthPopup(e)
    })
}

function renderAuthPopup(e) {
    return e.popup({
        title: "Authorization Required",
        args: {apiKey: TRELLO_API_KEY},
        url: "./authorize.html",
        height: 180
    })
}

function downloadCardChecklists (e) {
    return getChecklists(e, "cards", e.getContext().card).then(async function (t) {
        //var n = stringifyChecklist(t);
        // console.log(t)
        console.log(getCheckedItems(t))
        await addToBring()
        e.closePopup()
    })
}

function getCheckedItems(e) {
    let t = [];
    let n = 0;
    let f = 0;
    for (; f < e.length; f++) {
        if(e[f].name === 'Zutaten') {
            for (; n < e[f].checkItems.length; n++) {
                var r = e[f].checkItems[n];
                if( r.state === "incomplete") {
                    t.push(r.name);
                }
            }
        }
    }
    return t
}

function getChecklists (e, t, n) {
    return new Promise(function (r) {
        return e.get("member", "private", "token").then(function (e) {
            var o = new XMLHttpRequest;
            o.addEventListener("readystatechange", function () {
                this.readyState === this.DONE && r(JSON.parse(this.responseText))
            }), o.open("GET", "https://api.trello.com/1/" + t + "/" + n + "/checklists?key=" + TRELLO_API_KEY + "&token=" + e),
                o.send(null)
        })
    })
}

async function addToBring(){
    const bringapi = new Bring({mail: `benjamin.fuhlbruegge@gmail.com`, password: `9PiC!TSxnRXLrG&Q`});
    try {
        await bringapi.login();
        console.log(`Successfully logged in as ${bringapi.name}`);
        return bringapi;
    } catch (e) {
        console.error(`Error on Login: ${e.message}`);
    }
    const xyz = await bringapi.saveItem('9b7a5bb0-f4f2-4b83-b545-3fa72545216d',"Gouda", "2TL")
}






// #######################################




class Bring {
    constructor(options) {
        this.mail = options.mail;
        this.password = options.password;
        this.url = options.url || `https://api.getbring.com/rest/v2/`;
        this.uuid = options.uuid || ``;
        this.headers = {
            'X-BRING-API-KEY': `cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp`,
            'X-BRING-CLIENT': `webApp`,
            'X-BRING-CLIENT-SOURCE': `webApp`,
            'X-BRING-COUNTRY': `DE`
        };
    } // endConstructor
    /**
     * Try to log into given account
     */
    async login() {
        let data;
        try {
            data = await request_promise_native_1.default.post(`${this.url}bringauth`, {
                form: {
                    email: this.mail,
                    password: this.password
                }
            });
        }
        catch (e) {
            throw new Error(`Cannot Login: ${e.message}`);
        } // endCatch
        data = JSON.parse(data);
        this.name = data.name;
        this.uuid = data.uuid;
        this.bearerToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.headers[`X-BRING-USER-UUID`] = this.uuid;
        this.headers[`Authorization`] = `Bearer ${this.bearerToken}`;
        this.putHeaders = {
            ...this.headers,
            ...{ 'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8` }
        };
    } // endLogin
    /**
     *   Loads all shopping lists
     */
    async loadLists() {
        try {
            const data = await (0, request_promise_native_1.default)(`${this.url}bringusers/${this.uuid}/lists`, { headers: this.headers });
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get lists: ${e.message}`);
        } // endCatch
    } // endLoadLists
    /**
     *   Get all items from the current selected shopping list
     */
    async getItems(listUuid) {
        try {
            const data = await (0, request_promise_native_1.default)(`${this.url}bringlists/${listUuid}`, { headers: this.headers });
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get items for list ${listUuid}: ${e.message}`);
        } // endCatch
    } // endGetItems
    /**
     *   Get detailed information about all items from the current selected shopping list
     */
    async getItemsDetails(listUuid) {
        try {
            const data = await (0, request_promise_native_1.default)(`${this.url}bringlists/${listUuid}/details`, { headers: this.headers });
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get detailed items for list ${listUuid}: ${e.message}`);
        } // endCatch
    } // endGetItemsDetails
    /**
     *   Save an item to your current shopping list
     *
     *   @param itemName The name of the item you want to send to the bring server
     *   @param specification The litte description under the name of the item
     *   @param listUuid The listUUID you want to receive a list of users from.
     *   returns an empty string and answerHttpStatus should contain 204. If not -> error
     */
    async saveItem(listUuid, itemName, specification) {
        try {
            const data = await request_promise_native_1.default.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=${itemName}&recently=&specification=${specification}&remove=&sender=null`
            });
            return data;
        }
        catch (e) {
            throw new Error(`Cannot save item ${itemName} (${specification}) to ${listUuid}: ${e.message}`);
        } // endCatch
    } // endSaveItem
    /**
     *   remove an item from your current shopping list
     *
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @param listUuid The lisUUID you want to receive a list of users from.
     *   should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async removeItem(listUuid, itemName) {
        try {
            const data = await request_promise_native_1.default.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=&recently=&specification=&remove=${itemName}&sender=null`
            });
            return data;
        }
        catch (e) {
            throw new Error(`Cannot remove item ${itemName} from ${listUuid}: ${e.message}`);
        } // endCatch
    } // endRemoveItem
    /**
     *   move an item to recent items list
     *
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @param listUuid The lisUUID you want to receive a list of users from.
     *   should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async moveToRecentList(listUuid, itemName) {
        try {
            const data = await request_promise_native_1.default.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=&recently=${itemName}&specification=&remove=&&sender=null`
            });
            return data;
        }
        catch (e) {
            throw new Error(`Cannot remove item ${itemName} from ${listUuid}: ${e.message}`);
        } // endCatch
    } // endRemoveItem
    /**
     *   Get all users from a shopping list
     *
     *   @param listUuid The listUUID you want to receive a list of users from
     */
    async getAllUsersFromList(listUuid) {
        try {
            const data = await (0, request_promise_native_1.default)(`${this.url}bringlists/${listUuid}/users`, { headers: this.headers });
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get users from list: ${e.message}`);
        } // endCatch
    } // endGetAllUsersFromList
    /**
     * Get the user settings
     */
    async getUserSettings() {
        try {
            const data = await (0, request_promise_native_1.default)(`${this.url}bringusersettings/${this.uuid}`, { headers: this.headers });
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get user settings: ${e.message}`);
        } // endCatch
    } // endGetUserSettings
    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    async loadTranslations(locale) {
        try {
            const data = await (0, request_promise_native_1.default)(`https://web.getbring.com/locale/articles.${locale}.json`);
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get translations: ${e.message}`);
        } // endCatch
    } // endLoadTranslations
    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    async loadCatalog(locale) {
        try {
            const data = await (0, request_promise_native_1.default)(`https://web.getbring.com/locale/catalog.${locale}.json`);
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get catalog: ${e.message}`);
        } // endCatch
    } // endLoadCatalog
    /**
     *   Get pending invitations
     */
    async getPendingInvitations() {
        try {
            const data = await (0, request_promise_native_1.default)(`${this.url}bringusers/${this.uuid}/invitations?status=pending`, {
                headers: this.headers
            });
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error(`Cannot get pending invitations: ${e.message}`);
        } // endCatch
    } // endGetPendingInvitations
}





//##########################################






window.TrelloPowerUp.initialize({
    'show-settings': function(t, options){
        // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
        // what should Trello show. We highly recommend the popup in this case as
        // it is the least disruptive, and fits in well with the rest of Trello's UX
        return t.popup({
            title: 'Bring anmelden',
            url: './configure.html',
            height: 184 // we can always resize later
        });
    }, "card-buttons": function (e) {
        var t = {icon: BRING_ICON, text: "zu Bring", callback: onCardChecklistsClick};
        return e.card("all").then(function (e) {
            return e.badges.checkItems > 0 ? [t] : []
        })
    }, "authorization-status": function (e) {
        return e.get("member", "private", "token").then(function (e) {
            return {authorized: !!e}
        })
    }, "show-authorization": function (e) {
        return renderAuthPopup(e)
    }
}, {
    appKey: '00c34f6aad85b68994bdc5dbc0c5454a',
    appName: 'bring-powerup'
});