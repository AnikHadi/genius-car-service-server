const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//Middle ware
app.use(cors());
app.use(express.json());

//mongoDB section

const uri = `mongodb+srv://${process.env.USERNAMEDB}:${process.env.PASSWORD}@cluster0.17kyq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    console.log("MongoDB Connected");

    //service
    const carServiceCollection = client
      .db("genius-car-service")
      .collection("services");

    //get data for service
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = carServiceCollection.find(query);
      const serviceData = await cursor.toArray();
      res.send(serviceData);
    });

    // get data
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await carServiceCollection.findOne(query);
      res.send(service);
    });

    //Expert collection
    const carExpertCollection = client
      .db("genius-car-service")
      .collection("expert");
    //get data  for expert
    app.get("/expert", async (req, res) => {
      const query = {};
      const cursor = carExpertCollection.find(query);
      const expertData = await cursor.toArray();
      res.send(expertData);
    });

    //get data for single expert
    app.get("/expert/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const expert = await carExpertCollection.findOne(query);
      res.send(expert);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

//default
app.get("/", (req, res) => {
  res.send("This is genius car service server.");
});

app.listen(port, () => {
  console.log("Genius car service listening port: ", port);
});

//add
