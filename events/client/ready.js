module.exports = {
  name: 'ready',
  once: true,
  execute: async (client) => {
    console.log(`[INFO] Logged in as : ${client.user.tag}`);
  }
}