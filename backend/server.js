const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const assetsRoute = require('./routes/assets');
const risksRoute = require('./routes/risks');
const reportRoute = require('./routes/report');
const auditRoute = require('./routes/audit');

app.use('/assets', assetsRoute);
app.use('/risks', risksRoute);
app.use('/report', reportRoute);
app.use('/audit', auditRoute);

app.get('/', (req, res) => {
  res.send('Server is running on port 5050');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
