require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// console.log("process.env.REDIS_URL --> ", process.env.REDIS_URL);
connectDB();

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/properties", require("./routes/property.routes"));
app.use("/api/favorites", require("./routes/favorite.routes"));
app.use("/api/recommendations", require("./routes/recommendation.routes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
