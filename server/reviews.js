const fs = require("fs");
const Client = require("pg").Client;
const fastcsv = require("fast-csv");

const client = new Client({
  host: "db",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "dsolgames",
});

client.connect();

console.log(0);

const game_query = `SELECT COALESCE(id, -1) as id FROM games WHERE name like $1`;
const insert_query = `INSERT INTO reviews(app_id, app_name, review_text, review_score, review_votes) VALUES ($1, $2, $3, $4, $5)`;

var stream = fs.createReadStream("./pgdata/dataset.csv")
let start = Date.now();
var parser = fastcsv.parseStream(stream, {headers : true}).on("data", async function(data) {
  parser.pause();
  try {
        console.log(data['app_name']);
        let id = -1;
        let res = await client.query(game_query, [data['app_name']]);
        // error handling ja app name nav (lkm strada bez piedzivojumiem)
        if (res.rows[0]) id = res.rows[0]["id"]

        if (id != -1 && data['review_text'] != "N/A") client.query(insert_query, [id, data['app_name'], data['review_text'], data['review_score'], data['review_votes']], (err, res) => {
          if (err) console.log(err.stack);
        })
  } catch (err) {
    console.log(err.stack);
  }
  parser.resume();
}).on("end", function(){
  let timeTaken = Date.now() - start;
  console.log("Total time taken : " + timeTaken + " milliseconds");
});


