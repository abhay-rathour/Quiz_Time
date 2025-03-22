import express from "express";


// Import Routers

const app = express();

// Middleware
;
app.use(express.json());


// Routes


app.get("/", (req, res) => {
  res.send("The quiz-time server is running !!!");
});

export default app;
