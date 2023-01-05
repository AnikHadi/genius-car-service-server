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

    //service post
    app.post("/serviceAdd", async (req, res) => {
      const serviceInfo = req.body;
      const result = await carServiceCollection.insertOne(serviceInfo);
      res.send(result);
    });

    //Expert details post
    app.post("/expertAdd", async (req, res) => {
      const expertInfo = req.body;
      const result = await carExpertCollection.insertOne(expertInfo);
      console.log(expertInfo);
      res.send(result);
    });

    //update service data
    app.put("/serviceUpdate/:id", async (req, res) => {
      const updateInfo = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: updateInfo,
      };
      const options = { upsert: true };
      const result = await carServiceCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //update expert data
    app.put("/expertUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const updateExpertInfo = req.body;
      const query = { _id: ObjectId(id) };
      const updateExpert = {
        $set: updateExpertInfo,
      };
      const options = { upsert: true };
      const result = await carExpertCollection.updateOne(
        query,
        updateExpert,
        options
      );
      res.send(result);
    });

    //Delete service data
    app.delete("/serviceDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carServiceCollection.deleteOne(query);
      res.send(result);
    });

    // Delete Expert data
    app.delete("/expertDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carExpertCollection.deleteOne(query);
      res.send(result);
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
