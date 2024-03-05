require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser')
// set the view engine to ejs
let path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient("mongodb+srv://abc:jean0855!@cluster0.snv9zih.mongodb.net/", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getIcecreamData() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const result = await client.db("icecream-shop").collection("icecream-collection").find().toArray();

    console.log("mongo call await inside function: ", result);

    return result; 
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  catch(err) {
    console.log("getIcecreamData() error:", err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

// read from mongo
app.get('/', async (req, res) => {

    let result = await getIcecreamData().catch(console.error); 

    console.log("getIcecreamData() result:", result);

    res.render('index', {
      pageTitle: "Icecream shop",
      icecreamData: result 
  
    }); 
});
  

// create to mongo
  app.post('(/addIcecream)', async (req, res) => {
  
    try {
      // console.log("req.body: ", req.body) 
      client.connect; 
      const collection = client.db("icecream-shop").collection("icecream-collection");
      
      //draws from body parser
      console.log(req.body);
      
      await collection.insertOne(req.body);
      //await collection.insertOne({IcecreamName: req.body.IcecreamName});
        
      res.redirect('/');
    }
    catch(err){
      console.log(err)
    }
    finally{
     // client.close()
    }
  
  })
  
  
  app.post('/updateDrink/:id', async (req, res) => {
  
    try {
      console.log("req.parms.id: ", req.params.id) 
      
      client.connect; 
      const collection = client.db("chillAppz").collection("drinkz");
      let result = await collection.findOneAndUpdate( 
        {"_id": ObjectId(req.params.id)}, { $set: {"size": "REALLY BIG DRINK" } }
      )
      .then(result => {
        console.log(result); 
        res.redirect('/');
      })
      .catch(error => console.error(error))
    }
    finally{
      //client.close()
    }
  
  })
  
  app.post('/deleteDrink/:id', async (req, res) => {
  
    try {
      console.log("req.parms.id: ", req.params.id) 
      
      client.connect; 
      const collection = client.db("chillAppz").collection("drinkz");
      let result = await collection.findOneAndDelete( 
        {
          "_id": ObjectId(req.params.id)
        }
      )
      .then(result => {
        console.log(result); 
        res.redirect('/');
      })
      .catch(error => console.error(error))
    }
    finally{
      //client.close()
    }
  
  })



app.get('/read', async (req,res) => {

  let myResultServer = await run(); 

  console.log("myResultServer:", myResultServer);

  res.render('index', {
    myTypeClient: myTypeServer,
    myResultClient: myResultServer

  });


}); 

app.get('/name', (req,res) => {

  console.log("in get to slash name:", req.query.ejsFormName); 
  myTypeServer = req.query.ejsFormName; 

  res.render('index', {
    myTypeClient: myTypeServer,
    myResultClient: "myResultServer"

  });

  
})



app.get('/send', function (req, res) {
  
    res.send('Hello World from Express <br><a href="/">home</a>')
})

app.listen(port, () => {
console.log(`quebec listening on port ${port}`)
})