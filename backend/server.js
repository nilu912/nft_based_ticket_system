const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const { usersRouter } = require("./routes/usersRouter");
const { concertsRouter } = require("./routes/concertsRouter");
const { ticketsRouter } = require("./routes/ticketsRouter");
const { transactionsRouter} = require("./routes/transactionsRouter")

app.use("/api/users", usersRouter);
app.use("/api/events", concertsRouter);
app.use("/api/tickets", ticketsRouter)
app.use("/api/transactions", transactionsRouter)

async function main() {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(process.env.PORT);
  console.log("Listening on port 5000");
}

main();
