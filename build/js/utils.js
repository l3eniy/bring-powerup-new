function setAuthToken(t, username, password) {
    return t.set('member', 'private', 'auth', {
        username: username,
        password: password
    });
}

function removeAuthToken(t, username, password) {
    return t.remove('member', 'private', 'auth')
}




window.utils = {
    setAuthToken: setAuthToken,
    removeAuthToken: removeAuthToken,
};
