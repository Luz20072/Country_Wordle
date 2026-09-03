// ==========================================
// SUPABASE REQUEST
// ==========================================

async function supabaseRequest(endpoint) {

    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization:
                        `Bearer ${SUPABASE_KEY}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}: ${await response.text()}`
        );

    }


    return await response.json();

}