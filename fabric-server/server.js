var express = require("express");
var dotenv = require("dotenv");
var morgan = require("morgan");
var error = require("./middleware/errorMiddleware.js");
var userRoutes = require("./routes/userRoutes.js");
var transactionRoutes = require("./routes/transactionRoutes.js");
var cors = require("cors");
var hfc = require("fabric-ca-client");

require("./config.js");

dotenv.config();
const app = express();

app.options("*", cors());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//support parsing of application/json type post data
app.use(express.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/api/users", userRoutes);
app.use("/api", transactionRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use(error.notFound);
app.use(error.errorHandler);

//const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || hfc.getConfigSetting("host");
const PORT = process.env.PORT || hfc.getConfigSetting("port");

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
