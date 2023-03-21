const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid")

router.use(express.json());

// Middleware to update the views count for a video
function updateViews(req, res, next) {
    const videoId = req.params.videoId;
    const videos = readVideoDetails();
    const videoIndex = videos.findIndex((video) => video.id === videoId);

    if (videoIndex === -1) {
        res.status(404).json({ message: "Video not found" });
    } else {
        const video = videos[videoIndex];
        video.views += 1;
        fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
        next();
    }
}

function readVideoDetails() {
    const videoDetailsJSON = fs.readFileSync("./data/video-details.json");
    const parsedVideoDetails = JSON.parse(videoDetailsJSON);
    return parsedVideoDetails;
}

// videos route
router.get("/", (req, res) => {
    res.json(readVideoDetails());
});

// post new video via upload page
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
            views: 0,
            likes: 0,
            duration: "4:01",
            video: "https://project-2-api.herokuapp.com/stream",
            comments: []
        };

    const videos = readVideoDetails();
    videos.push(newVideo);
    fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
    res.status(200).json(newVideo);
    }
});

// video route by video uuid
router.get("/:videoId", updateViews, (req, res) => {
    const videos = readVideoDetails();
    const singleVideo = videos.find((video) => video.id === req.params.videoId);
    res.json(singleVideo);
});

router.put("/:videoId/likes", (req, res) => {
    const videoId = req.params.videoId;
    const videos = readVideoDetails();
    const videoIndex = videos.findIndex((video) => video.id === videoId);

    if (videoIndex === -1) {
        res.status(404).json({ message: "Video not found" });
    } else {
        const video = videos[videoIndex];
        video.likes += 1;
        fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
        res.status(200).json(video);
    }
});

// post comment to video by video uuid
router.post("/:videoId/comments", (req, res) => {
    const videos = readVideoDetails();
    const videoIndex = videos.findIndex((video) => video.id === req.params.videoId);

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
                likes: 0,
                timestamp: Date.now()
            };
            videos[videoIndex].comments.push(newComment);
            fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
            res.status(200).json(newComment);
        }
    }
});

// delete comment from video by comment uuid
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

router.put("/:videoId/comments/:commentId/likes", (req, res) => {
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
            const comment = video.comments[commentIndex];
            comment.likes += 1;
            fs.writeFileSync("./data/video-details.json", JSON.stringify(videos));
            res.status(200).json(comment);
        }
    }
});

module.exports = router;