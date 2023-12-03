const mysql = require("mysql");
function handleDisconnect() {
  connection = mysql.createConnection({
    host: "be6vnsardwnhrd2kvuon-mysql.services.clever-cloud.com",
    user: "us5h2edrx3zrgjdf",
    password: "oeOBpFoM6PJsH5ZR34xH",
    database: "be6vnsardwnhrd2kvuon",
    port: "3306",
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log("DB CONNECTED");
  });

  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
module.exports = { connection };

