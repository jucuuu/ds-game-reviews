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
        return await new Promise(function (resolve, reject) { // queries rank based on global sales
            client.query(`select id, RANK () OVER (ORDER BY global_sales DESC) as rank, name, platform, year, genre, publisher,
            na_sales, eu_sales, jp_sales, other_sales, global_sales, COALESCE(p.review_count, 0) as review_count from games
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
    }
};

const createGame = async (body) => {
    const { name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales } = body;

    try {
        const result = await client.query(`INSERT INTO games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES (0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, na_sales+eu_sales+jp_sales+other_sales]);
        res.status(200).json({ message: 'Form data inserted successfully' });
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Error inserting form data' });
    }
};

const updateGame = (id, body) => {
    return new Promise(function (resolve, reject) {
        const { rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales } = body;
        client.query(`
            UPDATE games SET
            rank = $1, name = $2, platform = $3, year = $4,
            genre = $5, publisher = $6, na_sales = $7, eu_sales = $8,
            jp_sales = $9, other_sales = $10, global_sales = $11 WHERE id = $12 RETURNING *`,
        [rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, na_sales+eu_sales+jp_sales+other_sales, id],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) {
                resolve(`Game updated: ${JSON.stringify(res.rows[0])}`);
            } else {
                reject(new Error("No results found"));
            }
        });
    });
};

// const deleteGame = (id) => {
//     return new Promise(function (resolve, reject) {
//         client.query(`DELETE FROM games WHERE id = $1`, [id],
//         (err, res) => {
//             if (err) reject(err);
//             resolve(`Game deleted with ID: ${id}`);
//         });
//     });
// };

const getReviews = async (id) => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select * from reviews where app_name like (SELECT name FROM games WHERE id like '${id}')`, (err, res) =>
            {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
};

const createReview = (form) => {
    return new Promise(function (resolve, reject) {
        const { app_id, app_name, review_text, review_score } = form;
        client.query(`INSERT INTO reviews VALUES ($1, $2, $3, $4, 0) RETURNING *`,
        [app_id, app_name, review_text, review_score],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) resolve(res.rows);
            else reject(new Error("No results found"));
        });
    });
};

const updateReview = (id, form) => {
    return new Promise(function (resolve, reject) {
        const { review_text, review_score } = form;
        client.query(`
            UPDATE reviews SET review_text = $1, review_score = $2 WHERE id = $3 RETURNING *`,
        [review_text, review_score, id],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) {
                resolve(`Review updated: ${JSON.stringify(res.rows[0])}`);
            } else {
                reject(new Error("No results found"));
            }
        });
    });
};

const deleteReview = (id) => {
    return new Promise(function (resolve, reject) {
        client.query(`DELETE FROM reviews WHERE id = $1`, [id],
        (err, res) => {
            if (err) reject(err);
            resolve(`Deleted review with ID: ${id}`);
        });
    });
};

module.exports = {
    getGames,
    createGame,
    updateGame,
    getReviews,
    createReview,
    updateReview,
    deleteReview
};