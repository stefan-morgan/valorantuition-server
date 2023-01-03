import express from "express";
import {
    getMain,
    getAllSeries, getOneSeries,  
    getEvents, getEvent,
    getMatches, getMatch, getRandomMatch,
    getMaps, getMap, getRandomMap,
    getPlayerPerfs, getPlayerPerf, getRandomPlayerPerf, getRandomMapInMatch
    } from './database.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// ONLY IMPORTANT REQUEST NEEDED FOR MY APPLICATION.
app.get("/main", async(req, res) => {
    const data = await getMain();
    res.send(data);
});

// Series
app.get("/series", async (req, res) => {
    const series = await getAllSeries();
    res.send(series);
});

app.get("/series/:id", async (req, res) => {
    const id = req.params.id;
    const series = await getOneSeries(id);
    res.send(series);
});

// Events
app.get("/events", async (req, res) => {
    const events = await getEvents();
    res.send(events);
});

app.get("/events/:id", async (req, res) => {
    const id = req.params.id;
    const event = await getEvent(id);
    res.send(event);
});

// Matchups
app.get("/matches", async (req, res) => {
    const matches = await getMatches();

    setTimeout(() => { // simulate slow API
        res.send(matches);
    }, 2000);

    
});

app.get("/matches/:id", async (req, res) => {
    const id = req.params.id;
    const match = await getMatch(id);
    res.send(match);
});

// Maps
app.get("/maps", async (req, res) => {
    const maps = await getMaps();
    res.send(maps);
});

app.get("/maps/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const map = await getMap(id);
    res.send(map);
});

// Player stat lines
app.get("/player-statline", async (req, res) => {
    const statlines = await getPlayerPerfs();
    res.send(statlines);
});

app.get("/player-statline/:id", async (req, res) => {
    const id = req.params.id;
    const statline = await getPlayerPerf(id);
    res.send(statline);
});

// Random retrievals
app.get("/random/map", async (req, res) => {
    const map = await getRandomMap();
    res.send(map);
});

app.get("/random/match", async (req, res) => {
    const match = await getRandomMatch();
    res.send(match);
});

app.get("/random/player-statline", async (req, res) => {
    const statline = await getRandomPlayerPerf();
    res.send(statline);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});