const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid")

// makes sure all data parsed is in json format
router.use(express.json());


router.use((_req, _res, next) => {
    console.log("Middleware from videos router");
    next();
});

// get detailed video data - e.g. per individual video
function readVideoDetails() {
    const videoDetailsJSON = fs.readFileSync("./data/video-details.json");
    const parsedVideoDetails = JSON.parse(videoDetailsJSON);
    return parsedVideoDetails;
}


// tested this on postman = WORKING!
// test on react = working!
router.get("/", (req, res) => {
    res.json(readVideoDetails());
});

// tested this on postman = WORKING!
// test on react = working!
router.get("/:videoId", (req, res) => {
    const videos = readVideoDetails();
    const singleVideo = videos.find((video) => video.id === req.params.videoId);
    res.json(singleVideo);
});

// tested this on postman = WORKING!
// test on react = working!
router.post("/:videoId/comments", (req, res) => {
    const videos = readVideoDetails();
    const videoIndex = videos.findIndex((video) => video.id === req.params.videoId);

    console.log(req.body);

    if (videoIndex === -1) {
        res.status(404).json({ message: "Video not found" });
    } else {
        if (!req.body || !req.body.name || !req.body.comment) {
            console.log(req.body.name, req.body.comment);
            res.status(400).json({ message: "Invalid request body" });
        } else {
            const newComment = {
                name: req.body.name,
                comment: req.body.comment,
                id: uuidv4(),
                timestamp: Date.now()
            };
            videos[videoIndex].comments.push(newComment);
            fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
            res.status(200).json(newComment);
        }
    }
});


router.delete("/:videoId/comments/:commentId", (req, res) => {
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;
    const videos = readVideoDetails();
    const video = videos.find((video) => video.id === videoId);

    if (!video) {
        res.status(404).json({ message: "Video not found" });
    } else {
        const commentIndex = video.comments.findIndex((comment) => comment.id === commentId);

        if (commentIndex === -1) {
            res.status(404).json({ message: "Comment not found" });
        } else {
            const deletedComment = video.comments.splice(commentIndex, 1)[0];
            fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
            res.status(200).json(deletedComment);
        }
    }
});

module.exports = router;