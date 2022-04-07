module.exports = {
    name: "ready",
    once: "true",
    execute(client) {
        // when ready, initiate
        console.log(`[BERRY INIT]: Connected to the Berry Network as: ${client.user.tag}`);
        console.log('[BERRY NOTE]: Welcome, Henrietta Huckleberry.');
    },
};