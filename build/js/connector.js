var BRING_ICON = 'https://global-uploads.webflow.com/5fbe6548a005d56f0dd39a2e/5fc24a65f7e1555200865e1b_bring-logo.svg';

var onBtnClick = function (t, opts) {
    console.log('Someone clicked the button');
    let x = t.get('member', 'private', 'auth');
    console.log(x);
};

window.TrelloPowerUp.initialize({
    'card-buttons': function (t, opts) {
        return [{
            // usually you will provide a callback function to be run on button click
            // we recommend that you use a popup on click generally
            icon: BRING_ICON, // don't use a colored icon here
            text: 'zu Bring',
            callback: onBtnClick,
            condition: 'edit'
        }];
    },
    'show-settings': function(t, options){
        // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
        // what should Trello show. We highly recommend the popup in this case as
        // it is the least disruptive, and fits in well with the rest of Trello's UX
        return t.popup({
            title: 'Bring anmelden',
            url: './configure.html',
            height: 184 // we can always resize later
        });
    },
}, {
    appKey: '00c34f6aad85b68994bdc5dbc0c5454a',
    appName: 'bring-powerup'
});