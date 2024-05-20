const fs = require("fs");
const Pool = require("pg").Pool;
const Client = require("pg").Client;
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("./pgdata/vgsales.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    csvData.shift();
    console.log(4)

    // const pool = new Pool({
    //     host: "db",
    //     user: "postgres",
    //     port: 5432,
    //     password: "password",
    //     database: "dsolgames",
    // });

    // Error: getaddrinfo EAI_AGAIN db (uj)
    const client = new Client({
        host: "db",
        user: "postgres",
        port: 5432,
        password: "password",
        database: "dsolgames",
      });
      
    client.connect();
    
    // Dabu speli, ja eksiste, tad pieskaita klat, ja ne, tad izveido jaunu
    // const game_exists_query = `SELECT * FROM games WHERE name LIKE $2`;
    
    const game_exists_query = `SELECT COUNT(*)
    FROM games
    WHERE name = $1::text`;
    const insert_new = `INSERT INTO games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES ($1::int, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    const update_existing = `UPDATE games SET
                    platform = ISNULL(platform, '') + ', ' + $1
                    na_sales = ISNULL(na_sales, 0) + $2
                    eu_sales = ISNULL(eu_sales, 0) + $3 
                    jp_sales = ISNULL(jp_sales, 0) + $4
                    other_sales = ISNULL(other_sales, 0) + $5
                    global_sales = ISNULL(global_sales, 0) + $6
                    WHERE name LIKE $7`;

    // const query =
    //   `DO $$
    //   IF NOT EXISTS (SELECT * FROM games WHERE name like $2)
    //   BEGIN
    //   INSERT INTO games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    //   END
    //   ELSE
    //   BEGIN
    //   UPDATE games SET platform = ISNULL(platform, '') + ', ' + $3 WHERE name LIKE $2
    //   END
    //   $$`;

      try {
        csvData.forEach(row => {
            var exists = null;

            // row.forEach(item => {
            //     console.log(item);
            //     if (item == "N/A") item = null;
            // })

            function mapItems(x) {
                if (x == "N/A") return null;
                else return x;
            }

            const row1 = row.map((item) => mapItems(item));

            client.query(game_exists_query, [row1[1]], (err, res) => {        
                if (err) console.log(err.stack);
                else exists = res.rows[0];
                console.log(exists); // PAR INT JAPATAISA
            });

            if (parseInt(exists) > 0) {
                client.query(update_existing, [row1[2], row1[6], row1[7], row[18], row1[9], row1[10], row1[1]], (err, res) => {
                    if (err) console.log(err.stack);
                })
            } else {
                client.query(insert_new, row1, (err, res) => {
                    if (err) console.log(err.stack);
                })
            }
        }); // rindas addojas tikai ja runno import.js no exec node sh (tapat addojas atkartoti)
      } catch (err) {
        console.log(err);
      }
    }
    );

stream.pipe(csvStream);
