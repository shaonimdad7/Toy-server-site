const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkdhqkk.mongodb.net/?retryWrites=true&w=majority`;

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

        const toysCollection = client.db('toyShop').collection('items')

        // app.get('/items', async (req, res) => {
        //     const cursor = toysCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { name: 1, img: 1, price: 1, rating: 1, available: 1, email: 1, sellerName: 1, why: 1, description: 1, subCategory: 1 }
            };
            const result = await toysCollection.findOne(query, options);
            res.send(result)
        })

        app.get('/items', async (req, res) => {
            const { email } = req.query;
            let query = {};
            if (email) {
                query = { email: email };
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/items', async (req, res) => {
            const newToyItem = req.body;
            console.log(newToyItem);
            const result = await toysCollection.insertOne(newToyItem);
            res.send(result);
        })

        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result);
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
    res.send('The server is runing')
})

app.listen(port, () => {
    console.log(`the server is going on port ${port}`)
})