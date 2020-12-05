require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const database = require("./database");
const fileUpload = require("express-fileupload");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const complaintsRouter = require("./routes/complaints");
const invoicesRouter = require("./routes/invoices");
const statsRouter = require("./routes/stats");
const filesRouter = require("./routes/files");
const othersRouter = require("./routes/others");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/complaints", complaintsRouter);
app.use("/invoices", invoicesRouter);
app.use("/stats", statsRouter);
app.use("/files", filesRouter);
app.use("/others", othersRouter);

module.exports = app;
