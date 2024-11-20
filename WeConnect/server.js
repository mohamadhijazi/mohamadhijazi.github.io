const path = require('path')
const express = require('express');

const app = express();
/*app.get('/', (req, res) => {
    res.send('Successful response.');
  });*/

const publicDirPath = path.join(__dirname, '../')

app.use(express.static(publicDirPath, {extensions: ['html']}))
app.get('/', (req, res) => {
  res.send(publicDirPath);
});
app.get('/WeConnect', (req, res) => {
  res.send(publicDirPath);
});
  
app.listen(3000, () => console.log('Example app is listening on port 3000.'));