const express = require("express");
const spawn = require("child_process").spawn;
const app = express();
const port = 8000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Local data files
const songJSON = require("./asset/songs-data.json");
const boyGroupJSON = require("./asset/boy-group.json");
const girlGroupJSON = require("./asset/girl-group.json");
const idolJSON = require("./asset/idol.json");
const res = require("express/lib/response");
const { query } = require("express");

// Scrape from website: Songs
const fetchSongs = () => {
    const child = spawn("./scrape/env-kpop/bin/python3.8", [
        "./scrape/kpop_scrape_project/kpop_scrape_project/selenium_songs.py",
    ]).on("error", (err) => {
        console.log(
            `Error Creating a child process from Node: ${err.toString()}`
        );
    });

    child.stderr.on("data", (data) => {
        console.log(`Error from Child process: ${data.toString()}`);
    });
};

// Scrape from website: Boy Groups
const fetchBoyGroups = () => {
    const child = spawn("../../env-kpop/bin/scrapy", ["crawl", "boy-group"], {
        cwd: "./scrape/kpop_scrape_project/kpop_scrape_project",
    }).on("error", (d) => {
        console.log(
            `Error Creating a child process from Node: ${err.toString()}`
        );
    });

    child.stdout.on("data", (d) => {
        console.log(`Error from Child process: ${data.toString()}`);
    });
};

// Scrape from website: Girl Groups
const fetchGirlGroups = () => {
    const child = spawn("../../env-kpop/bin/scrapy", ["crawl", "girl-group"], {
        cwd: "./scrape/kpop_scrape_project/kpop_scrape_project",
    }).on("error", (d) => {
        console.log(
            `Error Creating a child process from Node: ${err.toString()}`
        );
    });

    child.stdout.on("data", (d) => {
        console.log(`Error from Child process: ${data.toString()}`);
    });
};

// Scrape from website: Idols
const fetchIdols = () => {
    const child = spawn("../../env-kpop/bin/scrapy", ["crawl", "idol"], {
        cwd: "./scrape/kpop_scrape_project/kpop_scrape_project",
    }).on("error", (d) => {
        console.log(
            `Error Creating a child process from Node: ${err.toString()}`
        );
    });

    child.stdout.on("data", (d) => {
        console.log(`Error from Child process: ${data.toString()}`);
    });
};

// Random function for picking
const getRandom = (arr, n) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

// Function for making Title Case
const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

////////////////////////////////////////////////////////////////////////
/////////////////////////////// REST API ///////////////////////////////

// GET: Individual Idols
app.get("/idols", (req, res) => {
    // Parsing the given parameters
    const queryData = req.query;
    const dataJSON = idolJSON;

    const by = queryData.by ? toTitleCase(queryData.by) : "Stage Name";
    const q = queryData.q ? queryData.q.toLowerCase() : "";
    const offset = queryData.offset ? parseInt(queryData.offset) : 0;
    const limit =
        parseInt(queryData.limit) &&
        parseInt(queryData.limit) <= dataJSON.length
            ? parseInt(queryData.limit)
            : dataJSON.length;

    // 400 Bad Request checking
    if (!(by in dataJSON[0])) {
        res.status(400);
        return res.json({
            error: "Please input correct 'by' value after checking the document :)",
        });
    }
    if (offset < 0 || limit < 0) {
        res.status(400);
        return res.json({
            error: "Negative values aren't accepted for offset and limit :(",
        });
    }

    // Filter the data to send
    const resData = dataJSON.filter((song) => {
        return song[by].toLowerCase().includes(q);
    });

    // Calculate Offset, Limit
    let start = offset < resData.length ? offset : resData.length;
    let end = offset + limit > resData.length ? resData.length : offset + limit;

    // Send the Data
    res.send(resData.slice(start, end));
});

// GET: Random Girl Groups
app.get("/idols/random", (req, res) => {
    const queryData = req.query;
    const count = queryData.count ? parseInt(queryData.count) : 1;

    res.send(getRandom(idolJSON, count));
});

// GET: Birthdays
app.get("/idols/birthday", (req, res) => {
    const queryData = req.query;
    const month = queryData.month;
});

// GET: Boy groups
app.get("/boy-groups", (req, res) => {
    const queryData = req.query;
    const count = queryData.count ? parseInt(queryData.count) : 1;

    res.send(getRandom(boyGroupJSON, count));
});

// GET: Random Boy Groups

// GET: Girl groups
app.get("/girl-groups", (req, res) => {
    res.send(girlGroupJSON);
});

// GET: Random Girl Groups
app.get("/girl-groups/random", (req, res) => {
    const queryData = req.query;
    const count = queryData.count ? parseInt(queryData.count) : 1;

    res.send(getRandom(girlGroupJSON, count));
});

// GET: Songs
app.get("/songs", (req, res) => {
    // Parsing the given parameters
    const queryData = req.query;

    const by = queryData.by ? toTitleCase(queryData.by) : "Song Name";
    const q = queryData.q ? queryData.q.toLowerCase() : "";
    const offset = queryData.offset ? parseInt(queryData.offset) : 0;
    const limit =
        parseInt(queryData.limit) &&
        parseInt(queryData.limit) <= songJSON.length
            ? parseInt(queryData.limit)
            : songJSON.length;

    // 400 Bad Request checking
    if (!(by in songJSON[0])) {
        res.status(400);
        return res.json({
            error: "Please input correct 'by' value after checking the document :)",
        });
    }
    if (offset < 0 || limit < 0) {
        res.status(400);
        return res.json({
            error: "Negative values aren't accepted for offset and limit :(",
        });
    }

    // Filter the data to send
    const resData = songJSON.filter((song) => {
        return song[by].toLowerCase().includes(q);
    });

    // Calculate Offset, Limit
    let start = offset < resData.length ? offset : resData.length;
    let end = offset + limit > resData.length ? resData.length : offset + limit;

    // Send the Data
    res.send(resData.slice(start, end));
});

// GET: Random songs (Single & Multiple)
app.get("/songs/random", (req, res) => {
    const queryData = req.query;
    const count = queryData.count ? parseInt(queryData.count) : 1;

    res.send(getRandom(songJSON, count));
});

// Express app Listening to Port
app.listen(port, () => {
    console.log(`App running in ${port}`);
});
