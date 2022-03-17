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

////////////////////////////////////////////////////////////////////////
/////////////////////////////// REST API ///////////////////////////////

// GET: Songs
app.get("/songs", (req, res) => {
    console.log(req.query.name)
    res.send(songJSON)
});

// GET: Boy groups
app.get("/boy-groups", (req, res) => {
    
    res.send(boyGroupJSON);

});

// GET: Girl groups
app.get("/girl-groups", (req, res) => {
    res.send(girlGroupJSON);
});

// GET: Individual Idols
app.get("/idols", (req, res) => {
    res.send(idolJSON);
});

// Express app Listening to Port
app.listen(port, () => {
    console.log(`App running in ${port}`);
});
