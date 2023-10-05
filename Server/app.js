if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();  
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000; // nanti jalan di port 80(port http)
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(router);

// error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
