'use strict';
let auth0 = null; // variable hold the Auth0 client object


$(async function () {

    console.log("ok, document ready!!!");

    await configureClient();

    updateUI();

});

/**
 * Initialize the auth0 variable
 * */
async function configureClient() {

    const response = await fetch("/auth_config.json");
    const config = await response.json();

    console.log(config);

    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
    });
}

function login() {
    console.log("start login...")
}

async function updateUI() {

    const isAuthenticated = await auth0.isAuthenticated();
    console.log(isAuthenticated);
        
    $("#btn-logout").prop("disabled", !isAuthenticated);
   
    $("#btn-login").prop("disabled", isAuthenticated);

    let info = isAuthenticated ? "Přihlášen" : "Nepřihlášen"
    $("#info").html("<p>status: "+ info + "</p>");

}


