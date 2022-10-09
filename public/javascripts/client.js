'use strict';
let auth0 = null; // variable hold the Auth0 client object

/* Single page */
$(async function () {

    console.log("ok, document ready!!!");

    await configureClient();

    let isAuthenticated = await checkIfUserIsAuthenticated();

    updateUI(isAuthenticated);
    
});

/**
 Zkontroluje jestli je uživatel přihlášen
 @param {bool} isAuthenticated 
 */
async function checkIfUserIsAuthenticated() {

    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");

    if (shouldParseResult) {
        // This will indicate that an authentication result is present and needs to be parsed
        console.log("redirect");
        try {

            await auth0.handleRedirectCallback();
            console.log("Logged in!");

        } catch (err) {
            console.log("Error parsing redirect:", err);
        }

        window.history.replaceState({}, document.title, "/");
    }

    return await auth0.isAuthenticated();

}

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

/**
 * Přihlášení uživatele */
async function login() {

    console.log("start login...")
    try {

        const options = {
            redirect_uri: window.location.origin
        };

        await auth0.loginWithRedirect(options);

    } catch (err) {
            console.log("Log in failed", err);
    }

}
/**
 * Odhlášení uživatele */
async function logout() { 

    try {       
        auth0.logout({
            returnTo: window.location.origin
        });
    } catch (err) {
        console.log("Log out failed", err);
    }
}

/**
 *  Vykreslí stránku s informacemi 
 * @param {bool} isAuthenticated true pokud je uživatel přihlášen
 */
async function updateUI(isAuthenticated) {

    $("#btn-logout").prop("disabled", !isAuthenticated);   
    $("#btn-login").prop("disabled", isAuthenticated);

    let info = isAuthenticated ? "Přihlášen" : "Nepřihlášen"
    $("#info").html("<p>status: " + info + "</p>");

    if (isAuthenticated) {
        $("#btn-logout").removeClass("btn-secondary");
        $("#btn-logout").addClass("btn-primary");

        $("#btn-login").removeClass("btn-primary");
        $("#btn-login").addClass("btn-secondary");

        
        const user = await auth0.getUser();

        let data = JSON.stringify(user, null, 2);
        $("#info").append("<pre id='json'>" + data + "</pre>");
        $("#info").append("<button class='btn btn-outline-dark'>Import dat z csv</button>");

    } else {

        $("#btn-login").removeClass("btn-secondary");
        $("#btn-login").addClass("btn-primary");

        $("#btn-logout").removeClass("btn-primary");
        $("#btn-logout").addClass("btn-secondary");
    }

}


