"use strict";
var Promise = TrelloPowerUp.Promise, t = TrelloPowerUp.iframe(), apiKey = t.arg("apiKey"),
    trelloAuthUrl = "https://trello.com/1/authorize?expiration=never&name=bring-powerup&scope=read&key=" + apiKey + "&callback_method=fragment&return_url=" + window.location.origin + "%2Fauth-success.html",
    tokenLooksValid = function (e) {
        return /^[0-9a-f]{64}$/.test(e)
    };
document.getElementById("auth-btn").addEventListener("click", function () {
    t.authorize(trelloAuthUrl, {height: 680, width: 580, validToken: tokenLooksValid}).then(function (e) {
        return t.set("member", "private", "token", e)
    }).then(function () {
        return t.closePopup()
    })
});