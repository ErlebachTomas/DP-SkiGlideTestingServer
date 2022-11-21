'use strict';
let auth0 = null; // variable hold the Auth0 client object

/* Single page */
$(async function () {

    await configureClient();

    let isAuthenticated = await checkIfUserIsAuthenticated();

    updateUI(isAuthenticated);

    $("#ApiCall").click(async function () {
        // api call 
        console.log($("#ApiPath").val());
        let data = await callApi($("#ApiPath").val());
        console.log(data);
        $("#ApiResponse").text(JSON.stringify(data, null, 2));
    });


    $("#uploadDataForm").submit(function (e) {
        e.preventDefault(); //prevent Default functionality
        upload();
    });
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

    //console.log(config);

    auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience
    });
}

/**
 * Přihlášení uživatele */
async function login() {

    //console.log("start login...")
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

        $("#api").removeClass("hidden");
        $("#file").removeClass("hidden");

        const user = await auth0.getUser();

        let data = JSON.stringify(user, null, 2);
        $("#info").append("<pre id='json'>" + data + "</pre>");

    } else {
        $("#api").addClass("hidden");
        $("#file").addClass("hidden");

        $("#btn-login").removeClass("btn-secondary");
        $("#btn-login").addClass("btn-primary");

        $("#btn-logout").removeClass("btn-primary");
        $("#btn-logout").addClass("btn-secondary");
    }

}

/**
 * Test API
 * @param {string} path
 * @return {json} data
 */
async function callApi(path) {
    // undone throw err a osetřit v UI
    try {
        const token = await auth0.getTokenSilently();
        //console.log(token);
        let response = await fetch(path, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let responseData = await response.json();
        return responseData;

    } catch (err) {
        console.error("api call failed", err);

        let msg = {
            "api call failed": err.toString()
        };
        return msg;

    }
}

/**
 * Převede sešity z Excelu na pole Json objektů a vypíše obsah na stránku
 * @param {any} file soubor
 */
function XLSXToJson(file) {

    var reader = new FileReader();

    reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        let objects = [];
        workbook.SheetNames.forEach(function (sheetName) {

            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            var json_object = JSON.stringify(XL_row_object);

            objects.push(json_object);
        });
        
        objects.forEach(function (item) {
            // undone hromadné zpracování z více listů
            $("#preview").html(item);
            console.log(item);

        });        

    };
    reader.onerror = function (ex) {
        console.log(ex);

    };

    reader.readAsBinaryString(file);

};

/**
 * Zpracuje soubor vložený na stránku
 * */
function processFile() {

    let file = $("#inputFile")[0].files[0]


    switch (chectFileType(file.name)) {
        case "xlsx":
            XLSXToJson(file);
            $("#btn-post").prop("disabled", false);
        default:
            $("#preview").html("zatím nepodporováno");
            break;
           
    }

}

/**
 * Vrátí koncovku souboru
 * @param String filename název souboru 
 */
function chectFileType(filename) {
    return filename.split('.').pop();
}

/**
 * Odešle data na server
 * @param Json data
 */
async function postDataToServer(url,data) {

    try {
        const token = await auth0.getTokenSilently();
        fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            console.log("Complete! response:", res);
           // $("#preview").html(res);
        });


    } catch (err) {
        console.error("api call failed", err);
    }

}

async function upload() {

    var data = {
        user: await auth0.getUser(),
        airTemperature: $("#airTemperature").val(),
        snowTemperature: $("#snowTemperature").val(),
        snowType: $("#snowType").find(":selected").val(),
        testType: $("#testType").find(":selected").val(),
        skiRide: $("#preview").html(),
        note: $("#note").val(),
        datetime: $("#date").val()
    };
    console.log(data);
    postDataToServer("/api/uploadData", data)
    
} 



