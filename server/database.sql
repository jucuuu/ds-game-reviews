CREATE TABLE games(
    id SERIAL,
    rank INT,
    name VARCHAR(255),
    platform VARCHAR(50),
    year INT,
    genre VARCHAR(50),
    publisher VARCHAR(50),
    na_sales NUMERIC(5,2),
    eu_sales NUMERIC(5,2),
    jp_sales NUMERIC(5,2),
    other_sales NUMERIC(5,2),
    global_sales NUMERIC(5,2)
);

CREATE TABLE reviews(
    id SERIAL,
    app_id INT,
    app_name VARCHAR(255),
    review_text VARCHAR(9000),
    review_score INT,
    review_votes BOOLEAN
);

\COPY games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) FROM '/var/lib/postgresql/pgdata/vgsales.csv' with DELIMITER ',' QUOTE '"' CSV HEADER null as 'N/A';

\COPY reviews(app_id, app_name, review_text, review_score, review_votes) FROM '/var/lib/postgresql/pgdata/dataset.csv' with DELIMITER ',' QUOTE '"' CSV HEADER null as 'N/A';

delete from reviews where app_name like '';