const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const videoRoutes = require("./routes/videos")
const uploadRoutes = require("./routes/upload")

app.use(cors());

app.use(express.static('public'))

app.use((req, res, next) => {
    console.log(`Request for path ${req.path} at ${new Date()}`);
    next();
});

app.use("/video", videoRoutes);

app.use("/upload", uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});