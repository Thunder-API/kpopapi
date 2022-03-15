const express = require("express");
const app = express();
const port = 8000;

// let {PythonShell} = require('python-shell')
// let songs_options = {
//     mode: 'text',
//     pythonPath: './scrape/env-kpop/bin/python3',
//     pythonOptions: ['-u'],
//     scriptPath: './scrape/kpop_scrape_project/kpop_scrape_project',
// }
// PythonShell.run('selenium_songs.py', options, (err, results) => {
//     if (err) throw err;
//     console.log(res)
// })

// GET: Songs
app.get("/songs", (req, res) => {
    let spawn = require("child_process").spawn;
    let child = spawn("./scrape/env-kpop/bin/python3.8", [
        "./scrape/kpop_scrape_project/kpop_scrape_project/selenium_songs.py",
    ]);
    res.send("Hello!");
});

// GET: Boy groups
app.get("/boy-groups", (req, res) => {
    let spawn = require("child_process").spawn;

    let child = spawn(
        "../../env-kpop/bin/scrapy",
        ["crawl", "boy-group", ],
        {
            cwd: "./scrape/kpop_scrape_project/kpop_scrape_project",
        }
    ).on('error', (d) => {
        console.log(d.toString());
    })

    child.stdout.on("data", (d) => {
        console.log(d.toString())
    })

    res.send("DAATTAAA");
});

// GET: Girl groups

// GET: Random

// GET: `

app.listen(port, () => {
    console.log(`App running in ${port}`);
});
