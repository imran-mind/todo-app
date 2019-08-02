const express = require('express');
const app = express();
const PORT = process.env.PORT || 9090
app.use(express.static('public'));
app.listen(PORT, function () {
    console.log('App is running');
});