// ---
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

const game_query = `SELECT id FROM games WHERE name like $1`;
const insert_query = `INSERT INTO reviews VALUES ($1, $2, $3, $4, $5)`;
let line_count = 0;

let stream = fs.createReadStream("./pgdata/dataset.csv");
let csvStream = fastcsv
  .parseStream(stream, {headers: true, quote: '"', strictColumnHandling: true})
  .on("data", async function(data) {
    csvStream.pause();
    try {
      line_count+=1;
      //console.log(data['app_name']);
      // let res = await client.query(game_query, [data['app_name']]);
      // console.log(res)

      client.query(game_query, [data['app_name']], (err, res) => {
        if (err) console.log(err.stack);
      })

      console.log(line_count);
      console.log(data['review_text'].slice(0, 20))
      
      //return;
      
      // if (game_id) {
      //   client.query(insert_query, data, (err, res) => {
      //     if (err) console.log(err.stack);
      //   })
      // }
    } catch (err) {
      console.log(data);
    }
    csvStream.resume();
  }).on("error", function () {
    console.log('err')
  }).on("data-invalid", function(){
    console.log("error");
  }).on("end", function() {
    console.log('done');
  });

stream.pipe(csvStream);
