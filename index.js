const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors())
app.use(express.json())



// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgjyfgp.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffee')

        //GET
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            console.log(cursor);
            res.send(result)
        })

        //GET Single Data
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        //POST
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })

        //PUT
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const newCoffee = {
                $set: {
                    name: req.body.name,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    taste: req.body.taste,
                    category: req.body.category,
                    photo: req.body.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, newCoffee, options)
            res.send(result)
        })


        //DELETE 
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('SERVER API IS Running...')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})