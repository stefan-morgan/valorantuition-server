import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Collection of connections to the database
// Rather than opening and closing connections repeatedly, which is great for when you want to scale your application
const pool = mysql.createPool({
    host    : process.env.MYSQL_HOST,
    user    : process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// Main process.
export async function getMain() {
    // Retrieve a random match
    const match = await getRandomMatch();
    // get the event details.
    const event = await getEvent(match.event_id);
    // get the series details.
    const series = await getOneSeries(event.series_id);
    // select the maps from map table with the matching match id.
    const map = await getRandomMapInMatch(match.match_id);
    // Returns 5 players and their details.
    const team = Math.random() < 0.5 ? await getTeamFromMap(map.map_id, 1) : await getTeamFromMap(map.map_id, 2);

    const wrongMaps = getWrongMaps(map.map_name);

    const data = {
        series: series,
        event: event,
        match: match,
        mapObj: map,
        team: team,
        wrongMaps: wrongMaps
    }
    return data;
}


function getWrongMaps(correctMap) {
    
    const maps = ["Ascent", "Bind", "Breeze", "Fracture", "Haven", "Icebox", "Pearl"];
    const wrongMaps = maps.filter(map => map !== correctMap);
    const randomMaps = [];

    while (randomMaps.length < 3) {
        const index = Math.floor(Math.random() * wrongMaps.length);
        randomMaps.push(wrongMaps.splice(index, 1)[0]);
    }
    // console.log("Correct map", correctMap);
    // console.log("Wrong maps", randomMaps);
    return randomMaps;
}


// SERIES
export async function getAllSeries() {
    const [rows] = await pool.query("SELECT * FROM series");
    return rows;
}
export async function getOneSeries(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM series
    WHERE series_id = ?
    `, [id]); // prepared statement syntax (send query and values separately)
    return rows[0];
}
// EVENTS
export async function getEvents() {
    const [rows] = await pool.query("SELECT * FROM event");
    return rows;
}
export async function getEvent(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM event
    WHERE event_id = ?
    `, [id]);
    return rows[0];
}
// MATCHES
export async function getMatches() {
    const [rows] = await pool.query("SELECT * FROM matchup");
    return rows;
}
export async function getMatch(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM matchup
    WHERE match_id = ?
    `, [id]);
    return rows[0];
}
export async function getRandomMatch() {
    const [rows] = await pool.query("SELECT * FROM matchup ORDER BY RAND() LIMIT 1");
    return rows[0];
}
// MAPS
export async function getMaps() {
    const [rows] = await pool.query("SELECT * FROM gamemap");
    return rows;
}
export async function getMap(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM gamemap
    WHERE map_id = ?
    `, [id]);
    
    return rows[0];
}
export async function getRandomMap() {
    const [rows] = await pool.query("SELECT * FROM gamemap ORDER BY RAND() LIMIT 1");
    return rows[0];
}
export async function getRandomMapInMatch(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM gamemap
    where match_id = ?
    ORDER BY RAND() LIMIT 1
    `, [id]);

    return rows[0];
}
// PLAYER STAT LINES
export async function getPlayerPerfs() {
    const [rows] = await pool.query("SELECT * FROM player_perf");
    return rows;
}
export async function getPlayerPerf(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM player_perf
    WHERE player_performance_id = ?
    `, [id]);
    return rows[0];
}
export async function getRandomPlayerPerf() {
    const [rows] = await pool.query("SELECT * FROM player_perf ORDER BY RAND() LIMIT 1");
    return rows[0];
}

//Returns 5 players and their details given a map id and team number (1 or 2)
export async function getTeamFromMap(map_id, team) {
    const [rows] = await pool.query(`
    SELECT *
    FROM player_perf
    WHERE map_id = ? AND player_team_num = ?
    `, [map_id, team]);
    return rows;
}