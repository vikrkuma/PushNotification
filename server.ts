import * as express from 'express';
import * as webPush from 'web-push';
import * as bodyParser from 'body-parser';

const publicVapidKeys =
  'BCX8YyX8ZOlcT2ToVtRxm2Vz6XE_D9tEf6m5-9ulRvYsH80vjNdLcqZ9aB2zV265HDHjR827BYN09gXf2l8MDtM';
const privateVapidKeys = 'LiYpl4HuBp4rHfzgHITEAFlVPy9EWgw4T7eZNsMKAxE';

const app = express();
app.use(bodyParser.json())

webPush.setVapidDetails(
  'mailto:vikrant@acko.com',
  publicVapidKeys,
  privateVapidKeys
);

// Subscribe route.
app.post('/subscribeNotification', (request, response) => {
  const subscription = request.body

  response.status(201).json({});

  const payload = JSON.stringify({ title: 'Push Test'});
  webPush.sendNotification(subscription, payload)
      .catch(error => console.log(error));
});

const PORT = 5000;
app.use(express.static("client"));
app.use("/index.js", express.static("build/index.js"));
app.use("/index.js.map", express.static("build/index.js.map"));
app.use("/index.ts", express.static("index.ts"));
app.use("/sw.js", express.static("build/sw.js"));
app.use("/sw.js.map", express.static("build/sw.js.map"));
app.use("/sw.ts", express.static("build/sw.ts"));
app.listen(PORT, () => console.log('Server started at Port: ' + PORT));
