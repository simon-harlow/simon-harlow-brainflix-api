const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const videoRoutes = require("./routes/videos")

app.use(cors());

app.use(express.static('public'))

app.use((req, res, next) => {
    console.log(`[${req.method}] Request for path "${req.path}" at ${new Date().toLocaleString('en-US')}`);
    next();
});

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});