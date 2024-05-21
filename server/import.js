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
    
    const games = new Set();

    const game_exists_query = `SELECT COUNT(*)
    FROM games
    WHERE name = $1::text`;
    const insert_new = `INSERT INTO games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES ($1::int, $2::varchar, $3::varchar, $4::int, $5::varchar, $6::varchar, $7::numeric, $8::numeric, $9::numeric, $10::numeric, $11::numeric)`;
    const update_existing = `UPDATE games SET
                    platform = concat(platform, ', ', $1::varchar),
                    na_sales = na_sales + $2::numeric,
                    eu_sales = eu_sales + $3::numeric,
                    jp_sales = jp_sales + $4::numeric,
                    other_sales = other_sales + $5::numeric,
                    global_sales = global_sales + $6::numeric
                    WHERE name LIKE $7`;

      try {
        csvData.forEach(async row => {
            function mapItems(x) {
                if (x == "N/A") return null;
                else return x;
            }

            const row1 = row.map((item) => mapItems(item));
            
            //let res = await client.query(game_exists_query, [row1[1]]);
            //exists = res.rows[0]["count"]; // pirmoreiz visaam rindaam exists 0

            if (games.has(row1[1])) {
              games.add(row1[1]);
              client.query(update_existing, [row1[2], row1[6], row1[7], row[8], row1[9], row1[10], row1[1]], (err, res) => {
                if (err) console.log(err.stack);
            })} else {
              games.add(row1[1]);
              client.query(insert_new, row1, (err, res) => {
                if (err) console.log(err.stack);
            })}
        });
      } catch (err) {
        console.log(err);
      }
    }
    );

stream.pipe(csvStream);
