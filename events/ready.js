module.exports = {
    name: "ready",
    once: "true",
    execute(client) {
        console.log('Welcome, Henrietta Huckleberry.');
        console.log(`Connected to the Berry Network as: ${client.user.tag}`);
    },
};