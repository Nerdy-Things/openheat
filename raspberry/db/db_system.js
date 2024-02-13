const exucutor = require("./executor.js");

module.exports = {
    getConfig: async () => {
      return (await exucutor.query( "SELECT * FROM system_info where id = 1 " , []))[0];
    },
}