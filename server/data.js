const { Client } = require("pg");

const client = new Client({
  host: "db",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "dsolgames",
});

client.connect();

// !!! + jaapasso filtri+sorteri+pagination

// filtri: ranku/year/sales/review count intervaali; genres un publishers (select distinct un iebaazt kkaadaa select menu);
// platformas tapat? (partaisit lai atsevishkja tabula ir?)
const getGames = async (page, pageSize, sortColumn='rank', asc='true', searchString='', selectedGenres) => {
    let ascSort;
    let genreQuery = '';
    selectedGenres = selectedGenres.split(",")
    console.log(!selectedGenres[0])
    if (selectedGenres[0]) {
        genreQuery = ' AND genre in (\'' + selectedGenres.join("', '") + '\')';
        console.log(genreQuery)
    }
    (asc == 'false' ? ascSort = 'desc' : ascSort = 'asc')
    try {
        return await new Promise(function (resolve, reject) { // rank queried based on global sales
            client.query(`select id, RANK () OVER (ORDER BY global_sales DESC) as rank, name, platform, year, genre, publisher,
            na_sales, eu_sales, jp_sales, other_sales, global_sales, COALESCE(p.review_count, 0) as review_count from games
            left join (select app_id, count(*) as review_count from reviews
            group by app_id) as p on p.app_id = games.id
            WHERE (upper(name) like upper('%` + searchString + `%') or upper(platform) like upper('%` + searchString + `%')
            or upper(genre) like upper('%` + searchString + `%') or upper(publisher) like upper('%` + searchString + `%')) ` +
            genreQuery +
            ` order by ` + sortColumn + ` ` + ascSort +
            ` limit $1 offset $2`, [pageSize, (page-1)*pageSize], (err, res) => {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
};

// specific game data
const getGame = async(id) => {
    try {
        return await new Promise(function (resolve, reject) { // rank queried based on global sales
            client.query(`select id, (select rank from (select id, RANK () OVER (ORDER BY global_sales DESC) rank from games) where id=$1),
            name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales from games
            where id = $1`, [id], (err, res) => {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
}

// distinct genres
const getGenres = async () => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select distinct genre from games
            order by genre asc`, (err, res) => {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
}

// distinct publishers
const getPublishers = async() => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select distinct publisher from games
            order by publisher asc`, (err, res) => {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
}

// te filtri buus jaapasso
// search
const getGameRowCount = async (searchString='') => {
    try {
        return await new Promise(function (resolve, reject) { // rank queried based on global sales
            client.query(`SELECT COUNT(*) FROM (
            select id, RANK () OVER (ORDER BY global_sales DESC) as rank, name, platform, year, genre, publisher,
            na_sales, eu_sales, jp_sales, other_sales, global_sales, COALESCE(p.review_count, 0) as review_count from games
            left join (select app_name, count(*) as review_count from reviews
            group by app_name) as p on p.app_name = games.name
            WHERE upper(name) like upper('%` + searchString + `%') or upper(platform) like upper('%` + searchString + `%')
            or upper(genre) like upper('%` + searchString + `%') or upper(publisher) like upper('%` + searchString + `%')
            order by rank asc) g`, (err, res) => {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results found"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
}

const createGame = async (body) => {
    const { name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales } = body;
    
    // backend validaacija datiem
    if (name.length < 3 || platform.length < 3 || publisher.length < 3 || genre.length < 3 || year < 0 || na_sales < 0 || eu_sales < 0 || jp_sales < 0 || other_sales < 0) {
        console.log("Error"); // te normali jaizdara
        return;
    }

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
                reject(new Error("No results"));
            }
        });
    });
};

const deleteGame = (id) => {
    return new Promise(function (resolve, reject) {
        client.query(`DELETE FROM reviews WHERE app_id = $1`, [id],
        (err, res) => {
            if (err) reject(err);
            resolve(`Reviews deleted of game with app_id: ${id}`);
        });
        client.query(`DELETE FROM games WHERE id = $1`, [id],
        (err, res) => {
            if (err) reject(err);
            resolve(`Game deleted with ID: ${id}`);
        });
    });
};

// REVIEWS
// + add pagination
const getReviews = async (id, page=1, pageSize=10) => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select * from reviews where app_id=$1
            order by id desc
            limit $2 offset $3`, [id, pageSize, pageSize*(page-1)], (err, res) =>
            {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
};

const totalReviewRows = async(id) => {
    try {
        return await new Promise(function (resolve, reject) {
            client.query(`select count(*) count from reviews where app_id=$1`, [id], (err, res) =>
            {
                if (err) reject(err);
                if (res && res.rows) resolve(res.rows);
                else reject(new Error("No results"));
            });
        });
    } catch (err1) {
        console.log(err1);
    }
}

const createReview = (gameId, body) => {
    return new Promise(function (resolve, reject) {
        const { review_score, review_text, review_votes } = body;
        client.query(`INSERT INTO reviews(app_id, review_score, review_text, review_votes) VALUES ($1, $2, $3, $4) RETURNING *`,
        [gameId, review_score, review_text, review_votes],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) resolve(res.rows);
            else reject(new Error("No results"));
        });
    });
};

const updateReview = (id, review_score, review_text, review_votes) => {
    return new Promise(function (resolve, reject) {
        client.query(`
            UPDATE reviews SET review_text = $1, review_score = $2, review_voted = $3 WHERE id = $3 RETURNING *`,
        [review_text, review_score, review_votes, id],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) {
                resolve(`Review updated: ${JSON.stringify(res.rows[0])}`);
            } else {
                reject(new Error("No results"));
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
    deleteGame,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getGameRowCount,
    getGenres,
    getPublishers,
    getGame,
    totalReviewRows
};