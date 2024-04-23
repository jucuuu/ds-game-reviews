const { Client } = require("pg");

const client = new Client({
  host: "db",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "dsolgames",
});

client.connect();

const getGames = async () => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales, COALESCE(p.review_count, 0) as review_count from games
            left join (select app_name, count(*) as review_count from reviews
            group by app_name) as p on p.app_name = games.name`, (err, res) =>
            {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
        throw new Error("Internal server error");
    }
};

const createGame = async() => {

};

const deleteGame = async() => {

};

const updateGame = async() => {

};

const getReviews = async (name) => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select * from reviews where app_name like '${name}'`, (err, res) =>
            {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
        throw new Error("Internal server error");
    }
};

const createReview = async() => {

};

const updateReview = async() => {

};

const deleteReview = async() => {

};

module.exports = {
    getGames,
    createGame,
    updateGame,
    deleteGame,
    getReviews,
    createReview,
    updateReview,
    deleteReview
};