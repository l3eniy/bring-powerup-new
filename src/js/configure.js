var usernameInput = document.querySelector('#username-input');
var tokenInput = document.querySelector('#token-input');
var saveButton = document.querySelector('.save-btn');
var removeButton = document.querySelector('.remove-btn');

function saveCredentials() {
    var t = TrelloPowerUp.iframe();
    var command = t.args[0].context.command;

    utils.setAuthToken(t, usernameInput.value, tokenInput.value)
        .then(saveCallback.bind(this, t, command));
}

function saveCallback(t, command) {
    // Called from settings, dismiss popup
    t.closePopup();
}


saveButton.addEventListener('click', saveCredentials);

function removeCredentials() {
    var t = TrelloPowerUp.iframe();
    var command = t.args[0].context.command;

    utils.removeAuthToken(t)
        .then(saveCallback.bind(this, t, command));
}

removeButton.addEventListener('click', removeCredentials);