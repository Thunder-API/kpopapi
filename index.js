const express = require("express");
const spawn = require("child_process").spawn;
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require("node-schedule");
const path = require("path");
const fs = require("fs");

app.use(bodyParser.json());
app.use(cors());

// Local data files
let boyGroupJSON = JSON.parse(fs.readFileSync("./asset/boy-group.json"));
let girlGroupJSON = JSON.parse(fs.readFileSync("./asset/girl-group.json"));
let idolJSON = JSON.parse(fs.readFileSync("./asset/idol.json"));
let songJSON = JSON.parse(fs.readFileSync("./asset/songs-data.json"));

// Scrape from website: Songs
const scrapeSongs = () => {
    const pythonEnv = path.join(__dirname, "/scrape/env-kpop/bin/python");
    const songSeleniumFilePath = path.join(
        __dirname,
        "/scrape/kpop_scrape_project/kpop_scrape_project/selenium_songs.py"
    );
    const currentPath = path.join(__dirname, "/scrape/kpop_scrape_project/kpop_scrape_project");

    const child = spawn(pythonEnv, [songSeleniumFilePath], {
        cwd: currentPath
    });

    child.stdout.on("data", (data) => {
        console.log(`Data from child: ${data}`);
    });

    child.stderr.on("data", (data) => {
        console.log(`Error from child: ${data}`);
    });

    child.on("error", (err) => {
        console.log(`Error spawning child: ${err}`);
    });
};

// Scrape from website: Boy Groups
const scrapeData = (crawlerName) => {
    const pythonEnv = path.join(__dirname, "/scrape/env-kpop/bin/python");
    const scrapyPath = path.join(__dirname, "/scrape/env-kpop/bin/scrapy");
    const projectPath = path.join(__dirname, "/scrape/kpop_scrape_project");

    const child = spawn(pythonEnv, [scrapyPath, "crawl", crawlerName], {
        cwd: projectPath,
    });

    console.log(process.cwd());

    child.stdout.on("data", (data) => {
        console.log(`Data from child: ${data}`);
    });

    child.stderr.on("data", (data) => {
        console.log(`Error from child: ${data}`);
    });

    child.on("error", (err) => {
        console.log(`Error spawning child: ${err}`);
    });
};

/**
 * Util Function to get a random number from 0 to n
 * @param {*} arr
 * @param {*} n
 * @returns number
 */
const getRandom = (arr, n) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

/**
 *  Util function to convert a string to Title Case
 * @param {
 *
 * } phrase
 * @returns string
 */
const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Util function to create a response object
 * @param {*} param0
 * @returns
 */
const createResObjFormat = ({
    statusResult = "success",
    statusMessage = "Data fetched successfully",
    data = [],
} = {}) => {
    return {
        status: statusResult,
        message: statusMessage,
        data: data,
        count: data.length,
    };
};

// Schedule Job for fetching data
// TODO Async Await on scrapeData. Currently, fetching JSON is faster than scraping so some gets not updated in one run.
const scheduledJob = schedule.scheduleJob("0 50 * * * *", () => {
    scrapeData("boy-group");
    scrapeData("girl-group");
    scrapeData("idol");
    scrapeSongs();

    boyGroupJSON = JSON.parse(fs.readFileSync("./asset/boy-group.json"));
    girlGroupJSON = JSON.parse(fs.readFileSync("./asset/girl-group.json"));
    idolJSON = JSON.parse(fs.readFileSync("./asset/idol.json"));
    songJSON = JSON.parse(fs.readFileSync("./asset/songs-data.json"));
});


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

    // 400 Bad Request Checking
    if (!q) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage: "Parameter 'q' is a required. :)",
            })
        );
    }

    // 400 Bad Request checking
    if (!(by in dataJSON[0])) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    'Invalid value of "by". Please check "by" after checking the document :)',
            })
        );
    }
    if (offset < 0 || limit < 0) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    "Negative values aren't accepted for offset and limit :(",
            })
        );
    }

    // Filter the data to send
    const resData = dataJSON.filter((song) => {
        return song[by].toLowerCase().includes(q);
    });
    1;
    // Calculate Offset, Limit
    let start = offset < resData.length ? offset : resData.length;
    let end = offset + limit > resData.length ? resData.length : offset + limit;

    // Send the Data
    res.status(200).json(
        createResObjFormat({ data: resData.slice(start, end) })
    );
});

// GET: Random Girl Groups
app.get("/idols/random", (req, res) => {
    const queryData = req.query;
    res.status(200).json(createResObjFormat({ data: getRandom(idolJSON, 1) }));
});

// GET: Boy groups
app.get("/boy-groups", (req, res) => {
    // Parsing the given parameters
    const queryData = req.query;
    const dataJSON = boyGroupJSON;

    const by = queryData.by ? toTitleCase(queryData.by) : "Group Name";
    const q = queryData.q ? queryData.q.toLowerCase() : "";
    const offset = queryData.offset ? parseInt(queryData.offset) : 0;
    const limit =
        parseInt(queryData.limit) &&
        parseInt(queryData.limit) <= dataJSON.length
            ? parseInt(queryData.limit)
            : dataJSON.length;

    // 400 Bad Request Checking
    if (!q) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage: "Parameter 'q' is a required. :)",
            })
        );
    }

    // 400 Bad Request checking
    if (!(by in dataJSON[0])) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    'Invalid value of "by". Please check "by" after checking the document :)',
            })
        );
    }
    if (offset < 0 || limit < 0) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    "Negative values aren't accepted for offset and limit :(",
            })
        );
    }

    // Filter the data to send
    const resData = dataJSON.filter((obj) => {
        return obj[by].toLowerCase().includes(q);
    });

    // Calculate Offset, Limit
    let start = offset < resData.length ? offset : resData.length;
    let end = offset + limit > resData.length ? resData.length : offset + limit;

    // Send the Data
    res.status(200).json(
        createResObjFormat({ data: resData.slice(start, end) })
    );
});

// GET: Random Boy Groups
app.get("/boy-groups/random", (req, res) => {
    const queryData = req.query;

    // Send the Data
    res.status(200).json(
        createResObjFormat({ data: getRandom(boyGroupJSON, 1) })
    );
});

// GET: Girl groups
app.get("/girl-groups", (req, res) => {
    // Parsing the given parameters
    const queryData = req.query;
    const dataJSON = girlGroupJSON;

    const by = queryData.by ? toTitleCase(queryData.by) : "Group Name";
    const q = queryData.q ? queryData.q.toLowerCase() : "";
    const offset = queryData.offset ? parseInt(queryData.offset) : 0;
    const limit =
        parseInt(queryData.limit) &&
        parseInt(queryData.limit) <= dataJSON.length
            ? parseInt(queryData.limit)
            : dataJSON.length;

    // 400 Bad Request Checking
    if (!q) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage: "Parameter 'q' is a required. :)",
            })
        );
    }

    // 400 Bad Request checking
    if (!(by in dataJSON[0])) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    'Invalid value of "by". Please check "by" after checking the document :)',
            })
        );
    }
    if (offset < 0 || limit < 0) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    "Negative values aren't accepted for offset and limit :(",
            })
        );
    }
    // Filter the data to send
    const resData = dataJSON.filter((obj) => {
        return obj[by].toLowerCase().includes(q);
    });

    // Calculate Offset, Limit
    let start = offset < resData.length ? offset : resData.length;
    let end = offset + limit > resData.length ? resData.length : offset + limit;

    // Send the Data
    res.status(200).json(
        createResObjFormat({ data: resData.slice(start, end) })
    );
});

// GET: Random Girl Groups
app.get("/girl-groups/random", (req, res) => {
    const queryData = req.query;

    // Send the Data
    res.status(200).json(
        createResObjFormat({ data: getRandom(girlGroupJSON, 1) })
    );
});

// GET: Songs
app.get("/songs", (req, res) => {
    // Parsing the given parameters
    const queryData = req.query;
    const dataJSON = songJSON;

    const by = queryData.by ? toTitleCase(queryData.by) : "Song Name";
    const q = queryData.q ? queryData.q.toLowerCase() : "";
    const offset = queryData.offset ? parseInt(queryData.offset) : 0;
    const limit =
        parseInt(queryData.limit) &&
        parseInt(queryData.limit) <= songJSON.length
            ? parseInt(queryData.limit)
            : songJSON.length;

    // 400 Bad Request Checking
    if (!q) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage: "Parameter 'q' is a required. :)",
            })
        );
    }

    // 400 Bad Request checking
    if (!(by in dataJSON[0])) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    'Invalid value of "by". Please check "by" after checking the document :)',
            })
        );
    }
    if (offset < 0 || limit < 0) {
        res.status(400).json(
            createResObjFormat({
                statusResult: "error",
                statusMessage:
                    "Negative values aren't accepted for offset and limit :(",
            })
        );
    }
    // Filter the data to send
    const resData = songJSON.filter((song) => {
        return song[by].toLowerCase().includes(q);
    });

    // Calculate Offset, Limit
    let start = offset < resData.length ? offset : resData.length;
    let end = offset + limit > resData.length ? resData.length : offset + limit;

    // Send the Data
    res.status(200).json(
        createResObjFormat({ data: resData.slice(start, end) })
    );
});

// GET: Random songs (Single & Multiple)
app.get("/songs/random", (req, res) => {
    // Send the Data
    res.status(200).json(createResObjFormat({ data: getRandom(songJSON, 1) }));
});

// Express app Listening to Port
app.listen(port, () => {
    console.log(`App running in ${port}`);
});
