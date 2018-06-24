require("./config");

let connection;

if (process.env.NODE_ENV !== "test") {
    connection = process.env.DATABASE_URL
} else {
    connection = `${process.env.DATABASE_URL}_test`
}

module.exports = {
    client: "pg",
    connection,
    migrations: {
        directory: "../migrations",
    },
};
