module.exports = {
    name: "ready",
    once: "true",
    execute(client) {
        // when ready, initiate
        console.log('Welcome, Henrietta Huckleberry.');
        console.log(`[BERRY INIT]: Connected to the Berry Network as: ${client.user.tag}`);
    },
};