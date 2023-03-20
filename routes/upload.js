const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid")

// makes sure all data parsed is in json format
router.use(express.json());

router.use((_req, _res, next) => {
    console.log("Middleware from uploads router");
    next();
});


function readVideos() {
    const videosJSON = fs.readFileSync("./data/videos.json");
    const parsedVideos = JSON.parse(videosJSON);
    return parsedVideos;
}



module.exports = router;