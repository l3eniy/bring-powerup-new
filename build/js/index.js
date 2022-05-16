"use strict";
var _extends = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    },

    Promise = TrelloPowerUp.Promise,
    HOSTING_DOMAIN = "https://jc-trello-exporter.netlify.com",
    TRELLO_API_KEY = "d2cb57df20bf79a27dcb9a18bd6607e5",
    POWER_UP_ICON_URL = HOSTING_DOMAIN + "/images/jc-icon.png",
    CSV_SEPARATOR = "\t",
    API_CALLS_SLEEP_DURATION = 125,

    sleep = function (e) {
        return new Promise(function (t) {
            return setTimeout(t, e)
        })
    },

    logEvent = function (e, t) {
        return amplitude.getInstance().logEvent(e, t)
    },

    onBoardChecklistsClick = function (e) {
        return ensureUserAuthorized(e, function () {
            return e.popup({
                title: "Download Checklists As...",
                items: [{text: "CSV file (can take a while)", callback: downloadBoardChecklists}]
            })
        })
    },

    onCardChecklistsClick = function (e) {
        return ensureUserAuthorized(e, function () {
            return e.popup({
                title: "Download Checklists As...",
                items: [{text: "TXT file", callback: downloadCardChecklists}]
            })
        })
    },

    downloadBoardChecklists = function (e) {
        return Promise.all([e.board("id", "name"), e.lists("id", "name").then(convertArrayToObjectWithIdAsKeys), e.cards("id", "name", "idList", "badges").then(function (e) {
            for (var t = [], n = 0; n < e.length; n++) e[n].badges.checkItems > 0 && (delete e[n].badges, t.push(e[n]));
            return t
        }).then(function (t) {
            var n = [];
            return new Promise(function (r) {
                for (var o = function (o, i) {
                    i = i.then(function () {
                        var i = getChecklists(e, "cards", t[o].id).then(function (e) {
                            return t[o].checklists = e, t[o]
                        });
                        return n.push(i), t.length - 1 === o && r(), sleep(API_CALLS_SLEEP_DURATION)
                    }), a = i
                }, i = 0, a = Promise.resolve(); i < t.length; i++) o(i, a)
            }).then(function () {
                return Promise.all(n)
            })
        })]).then(function (t) {
            for (var n = '"List' + CSV_SEPARATOR + "Card" + CSV_SEPARATOR + 'Checklists"\n', r = t[0], o = t[1], i = t[2], a = {
                checklistsCount: 0,
                checklistItemsCount: 0
            }, s = 0; s < i.length; s++) {
                var c = i[s];
                n += o[i[s].idList].name + CSV_SEPARATOR + c.name + CSV_SEPARATOR + '"' + stringifyChecklist(c.checklists).replace(/"/g, '""') + '"\n';
                var l = getChecklistsMeta(c.checklists), u = l.checklistsCount, h = l.checklistItemsCount;
                a.checklistsCount += u, a.checklistItemsCount += h
            }
            downloadFile(r.name + " Checklists.csv", n);
            var d = e.getContext();
            logEvent("ExportBoard", _extends({
                board: d.board,
                organization: d.organization,
                member: d.member,
                cardsCount: i.length
            }, a)), e.closePopup()
        })
    },

    downloadCardChecklists = function (e) {
        return getChecklists(e, "cards", e.getContext().card).then(function (t) {
            var n = stringifyChecklist(t);
            downloadFile("Smart Checklist.txt", n);
            var r = e.getContext();
            logEvent("ExportCard", _extends({
                card: r.card,
                board: r.board,
                organization: r.organization,
                member: r.member
            }, getChecklistsMeta(t))), e.closePopup()
        })
    },

    ensureUserAuthorized = function (e, t) {
        return e.get("member", "private", "token").then(function (n) {
            return n ? t() : renderAuthPopup(e)
        })
    },

    getChecklists = function (e, t, n) {
        return new Promise(function (r) {
            return e.get("member", "private", "token").then(function (e) {
                var o = new XMLHttpRequest;
                o.addEventListener("readystatechange", function () {
                    this.readyState === this.DONE && r(JSON.parse(this.responseText))
                }), o.open("GET", "https://api.trello.com/1/" + t + "/" + n + "/checklists?key=" + TRELLO_API_KEY + "&token=" + e), o.send(null)
            })
        })
    },

    getChecklistsMeta = function (e) {
        var t = 0;
        for (var n in e) e.hasOwnProperty(n) && (t += e[n].checkItems.length);
        return {checklistsCount: e.length, checklistItemsCount: t}
    },

    stringifyChecklist = function (e) {
        for (var t = "", n = 0; n < e.length; n++) {
            var r = e[n];
            t += "## " + r.name + "\n";
            for (var o = 0; o < r.checkItems.length; o++) {
                var i = r.checkItems[o];
                t += ("complete" === i.state ? "+" : "-") + " " + i.name + "\n"
            }
        }
        return t
    },

    convertArrayToObjectWithIdAsKeys = function (e) {
        for (var t = {}, n = 0; n < e.length; n++) {
            var r = e[n];
            t[r.id] = r, delete r.id
        }
        return t
    },

    downloadFile = function (e, t) {
        var n = document.createElement("a");
        n.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(t)), n.setAttribute("download", e), n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n)
    },

    renderAuthPopup = function (e) {
        return e.popup({
            title: "Authorization Required",
            args: {apiKey: TRELLO_API_KEY},
            url: "./authorize.html",
            height: 180
        })
    };


TrelloPowerUp.initialize({
    "board-buttons": function () {
        return [{icon: POWER_UP_ICON_URL, text: "Smart Checklist", callback: onBoardChecklistsClick}]
    }, "card-buttons": function (e) {
        var t = {icon: POWER_UP_ICON_URL, text: "Export Checklists", callback: onCardChecklistsClick};
        return e.card("all").then(function (e) {
            return e.badges.checkItems > 0 ? [t] : []
        })
    }, "authorization-status": function (e) {
        return e.get("member", "private", "token").then(function (e) {
            return {authorized: !!e}
        })
    }, "on-enable": function (e) {
        var t = e.getContext();
        logEvent("EnablePowerUp", {organization: t.organization, member: t.member})
    }, "on-disable": function (e) {
        var t = e.getContext();
        logEvent("DisablePowerUp", {organization: t.organization, member: t.member})
    }, "show-authorization": function (e) {
        return renderAuthPopup(e)
    }
});