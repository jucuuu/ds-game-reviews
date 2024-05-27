const { Client } = require("pg");

const client = new Client({
  host: "db",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "dsolgames",
});

client.connect();

// funkcija iztirit single quote searchStringus
function removeMultipleSingleQuotes() {

}

const getGames = async (page, pageSize, sortColumn='rank', asc='true', searchString, selectedGenres, selectedPublishers,
    yearFrom,  yearTo, naSalesFrom, naSalesTo, euSalesFrom, euSalesTo, jpSalesFrom, jpSalesTo,
    otherSalesFrom, otherSalesTo, globalSalesFrom, globalSalesTo, reviewCountFrom, reviewCountTo
) => {
    // somehow dabu negative offsetu => atsakas refreshoties frontends
    let ascSort;
    (asc == 'false' ? ascSort = 'desc' : ascSort = 'asc')

    let genreQuery = '';
    let publisherQuery = '';
    let yearQuery = '';
    let naSalesQuery = '';
    let euSalesQuery = '';
    let jpSalesQuery = '';
    let otherSalesQuery = '';
    let globalSalesQuery = '';
    let reviewCountQuery = '';

    // Ja searchaa single quote
    if (searchString == "'") searchString = "''";

    selectedPublishers = selectedPublishers.split(",");
    selectedGenres = selectedGenres.split(",")

    if (selectedGenres[0]) {
        genreQuery = ' AND genre in (\'' + selectedGenres.join("', '") + '\')';
    }
    if (selectedPublishers[0]) {
        publisherQuery = ' AND publisher in (\'' + selectedPublishers.join("', '") + '\')';
    }

    // !!!!!!!!!! atrod? bet freakojas out kad dabu speli
    if (searchString == "'") searchString="''";

    if (yearTo == -1 && yearFrom != '') yearQuery = ' AND year>=' + yearFrom;
    else if (yearTo == -1 && yearFrom == '') yearQuery = '';
    else if (yearFrom == '' && yearTo != '') yearQuery = ' AND year<=' +  yearTo;
    else if (yearTo != '' && yearFrom != '') yearQuery = ' AND year BETWEEN ' + yearFrom + ' AND ' + yearTo;
    else if (yearTo == '' && yearFrom != '') yearQuery = ' AND year=' + yearFrom;

    if (naSalesFrom != '' && naSalesTo == '') naSalesQuery = ' AND na_sales>=' + naSalesFrom;
    else if (naSalesFrom != '' && naSalesTo != '') naSalesQuery = ' AND na_sales BETWEEN ' + naSalesFrom + ' AND ' + naSalesTo;
    else if (naSalesFrom == '' && naSalesTo != '') naSalesQuery = ' AND na_sales<=' + naSalesTo;

    if (euSalesFrom != '' && euSalesTo == '') euSalesQuery = ' AND eu_sales>=' + euSalesFrom;
    else if (euSalesFrom != '' && euSalesTo != '') euSalesQuery = ' AND eu_sales BETWEEN ' + euSalesFrom + ' AND ' + naSalesTo;
    else if (euSalesFrom == '' && euSalesTo != '') euSalesQuery = ' AND eu_sales<=' + euSalesTo;

    if (jpSalesFrom != '' && jpSalesTo == '') jpSalesQuery = ' AND jp_sales>=' + jpSalesFrom;
    else if (jpSalesFrom != '' && jpSalesTo != '') jpSalesQuery = ' AND jp_sales BETWEEN ' + jpSalesFrom + ' AND ' + jpSalesTo;
    else if (jpSalesFrom == '' && jpSalesTo != '') jpSalesQuery = ' AND jp_sales<=' + jpSalesTo;

    if (otherSalesFrom != '' && otherSalesTo == '') otherSalesQuery = ' AND other_sales>=' + otherSalesFrom;
    else if (otherSalesFrom != '' && otherSalesTo != '') otherSalesQuery = ' AND other_sales BETWEEN ' + otherSalesFrom + ' AND ' + otherSalesTo;
    else if (otherSalesFrom == '' && otherSalesTo != '') otherSalesQuery = ' AND other_sales<=' + otherSalesTo;

    if (globalSalesFrom != '' && globalSalesTo == '') globalSalesQuery = ' AND global_sales>=' + globalSalesFrom;
    else if (globalSalesFrom != '' && globalSalesTo != '') globalSalesQuery = ' AND global_sales BETWEEN ' + globalSalesFrom + ' AND ' + globalSalesTo;
    else if (globalSalesFrom == '' && globalSalesTo != '') globalSalesQuery = ' AND global_sales<=' + globalSalesTo;

    if (reviewCountFrom != '' && reviewCountTo == '') jpSalesQuery = ' AND review_count>=' + reviewCountFrom;
    else if (reviewCountFrom != '' && reviewCountTo != '') jpSalesQuery = ' AND review_count BETWEEN ' + reviewCountFrom + ' AND ' + reviewCountTo;
    else if (reviewCountFrom == '' && reviewCountTo != '') jpSalesQuery = ' AND review_count<=' + reviewCountTo;

    try {
        return await new Promise(function (resolve, reject) { // rank queried based on global sales
            client.query(`select id, RANK () OVER (ORDER BY global_sales DESC) as rank, name, platform, year, genre, publisher,
            na_sales, eu_sales, jp_sales, other_sales, global_sales, COALESCE(p.review_count, 0) as review_count from games
            left join (select app_id, count(*) as review_count from reviews
            group by app_id) as p on p.app_id = games.id
            WHERE (upper(name) like upper('%` + searchString + `%') or upper(platform) like upper('%` + searchString + `%')
            or upper(genre) like upper('%` + searchString + `%') or upper(publisher) like upper('%` + searchString + `%')) ` +
            genreQuery + publisherQuery + yearQuery + naSalesQuery + euSalesQuery + jpSalesQuery + otherSalesQuery +
            globalSalesQuery + reviewCountQuery +
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

// te filtri buus jaapasso
// search
const getGameRowCount = async (searchString='') => {
    if (searchString == "'") searchString = "''";
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

const updateGame = async(id, body) => {
    return new Promise(function (resolve, reject) {
        const { name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales } = body;
        client.query(`
            UPDATE games SET name = $1, platform = $2, year = $3,
            genre = $4, publisher = $5, na_sales = $6, eu_sales = $7,
            jp_sales = $8, other_sales = $9, global_sales = $10 WHERE id = $11 RETURNING *`,
        [name, platform, year, genre, publisher, parseInt(na_sales), parseInt(eu_sales), parseInt(jp_sales),
            parseInt(other_sales), parseInt(na_sales)+parseInt(eu_sales)+parseInt(jp_sales)+parseInt(other_sales), id],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) {
                resolve(res.rows);
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

const updateReview = async(body) => {
    const {id, review_score, review_text, review_votes} = body;
    return new Promise(function (resolve, reject) {
        client.query(`
            UPDATE reviews SET review_score = $1::int, review_text = $2::text, review_votes = $3::bool WHERE id = $4::int RETURNING *`,
        [review_score, review_text, review_votes, id],
        (err, res) => {
            if (err) reject(err);
            if (res && res.rows) resolve(res.rows);
            else reject(new Error("No results"));
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