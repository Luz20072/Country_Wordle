// ==========================================
// SUPABASE CLIENT
// ==========================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// AKTUELLE SESSION
// ==========================================

async function getCurrentSession() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Fehler beim Laden der Session:",
            error
        );

        return null;

    }


    return data.session;

}


// ==========================================
// AKTUELLER BENUTZER
// ==========================================

async function getCurrentUser() {

    const session =
        await getCurrentSession();


    return session
        ? session.user
        : null;

}


// ==========================================
// REGISTRIEREN
// ==========================================

async function registerUser(
    username,
    email,
    password
) {

    const {
        data,
        error
    } = await supabaseClient.auth.signUp({

        email,
        password,

        options: {

            data: {
                username
            }

        }

    });


    if (error) {

        throw error;

    }


    return data;

}


// ==========================================
// EINLOGGEN
// ==========================================

async function loginUser(
    email,
    password
) {

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({

        email,
        password

    });


    if (error) {

        throw error;

    }


    return data;

}


// ==========================================
// AUSLOGGEN
// ==========================================

async function logoutUser() {

    const {
        error
    } = await supabaseClient.auth.signOut();


    if (error) {

        throw error;

    }

}


/// ==========================================
// SUPABASE REQUEST
// ==========================================

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const headers = {

        apikey:
            SUPABASE_KEY,

        "Content-Type":
            "application/json",

        ...options.headers

    };


    /*
     * Standardmäßig öffentliche Requests
     * mit dem Publishable Key ausführen.
     */

    if (
        options.authenticated === true
    ) {

        const session =
            await getCurrentSession();


        if (
            session &&
            session.access_token
        ) {

            headers.Authorization =
                `Bearer ${session.access_token}`;

        }

        else {

            headers.Authorization =
                `Bearer ${SUPABASE_KEY}`;

        }

    }

    else {

        headers.Authorization =
            `Bearer ${SUPABASE_KEY}`;

    }


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {

                method:
                    options.method || "GET",

                headers,

                body:
                    options.body

            }
        );


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}: ${await response.text()}`
        );

    }


    const text =
        await response.text();


    if (!text) {

        return null;

    }


    return JSON.parse(text);

}