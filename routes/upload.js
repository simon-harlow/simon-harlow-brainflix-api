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


function readVideoDetails() {
    const videoDetailsJSON = fs.readFileSync("./data/video-details.json");
    const parsedVideoDetails = JSON.parse(videoDetailsJSON);
    return parsedVideoDetails;
}

router.post("/", (req, res) => {

    if (!req.body || !req.body.title || !req.body.description) {
        res.status(400).json({ message: "Invalid request body" });
    } else {
        const newVideo = {
            id: uuidv4(),
            title: req.body.title,
            description: req.body.description,
            timestamp: Date.now(),
            // the rest are placeholder values
            channel: "Roisin O'Neill",
            image: "http://localhost:8080/images/imageUpload.jpg",
            views: "1,234,567",
            likes: "87,654",
            duration: "4:01",
            video: "https://project-2-api.herokuapp.com/stream",
            comments: []
        };

    const videos = readVideoDetails();
    videos.push(newVideo);
    fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
    // Respond with the note that was created
    res.status(200).json(newVideo);
    }
});



module.exports = router;