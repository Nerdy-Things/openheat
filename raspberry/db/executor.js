const mariadb = require('mariadb');
const dbConfig =  {
  host     : '127.0.0.1',
  user     : core.config.MYSQL_USER,
  password : core.config.MYSQL_PASSWORD,
  connectionLimit: 20,
  port: 3306,
  trace: true
}
let mariaPool = mariadb.createPool(dbConfig);

const fs = require('fs');
const { log } = require('console');

const DB_NAME = "nerdy_openheat";
const DB_VERSION = 1;

module.exports = {
  checkDatabase: async () => {
    console.log("checkDatabase");
    let connection;
    try {
      connection = await mariaPool.getConnection();
      console.log("DB Connected.");
      const databases = await connection.query("SHOW DATABASES;");
      let isDBExists = false;
      for (database of databases) {
        if (database["Database"] == DB_NAME) {
          isDBExists = true;
          break;
        }
      }
      if (! isDBExists) {
        console.log("NO DB. Creating");
        const filePath = __dirname + "/../sql/basic_structure.sql";
        const sqlContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        const sqlStatements = sqlContent.split(/;\s*$/m).filter(statement => statement.length > 0);
        for (const statement of sqlStatements) {
          await connection.query(statement);
        }
      }
    } finally {
      if (connection) {
        await connection.release();
      }
      mariaPool.end();
      dbConfig.database = DB_NAME;
      mariaPool = mariadb.createPool(dbConfig);
    }
  },

  query: async (query, array) => {
      let connection;
      try {
        connection = await mariaPool.getConnection();
        return await connection.query(query, array) 
      } finally {
        if (connection) {
          await connection.release();
        }
    };
  },
}
