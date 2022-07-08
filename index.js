const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express=require('express')
const cors=require('cors')
const app=express()
const port=process.env.PORT||5000;
require('dotenv').config()
// user:help
// pass:J1tFW4LUT21p4g2m


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddqvk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
      await client.connect();
      const peopleCollection=client.db('helples').collection('donation');
      const dataCollection=client.db('helples').collection('user')
      const donateCollection=client.db('helples').collection('data')
      // get all data from mongodb
      app.get('/donation',async(req,res)=>{
        const query={};
        const cursor=peopleCollection.find(query)
        const result=await cursor.toArray()
        res.send(result)
      })
     
      app.get('/donation/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const cursor=await peopleCollection.findOne(query)
        res.send(cursor)
      })
     
      // create one data from client
      app.post('/donation',async(req,res)=>{
        const service=req.body;
        const result=await peopleCollection.insertOne(service)
        res.send(result)
      })

      // new data pass new collection
     app.post('/user',async(req,res)=>{
      const query=req.body;
      const result=await dataCollection.insertOne(query)
      res.send(result)
     })
    //  data get from mongodb
    app.get('/user',async(req,res)=>{
      const query={}
      const cursor=dataCollection.find(query)
      const result=await cursor.toArray()
      res.send(result)
    })
    // delete from mongodb and ui
    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result=await dataCollection.deleteOne(query)
      res.send(result)
    })
  //  for donation page
  app.get('/donate',async(req,res)=>{
    const query={}
    const cursor=donateCollection.find(query)
    const result=await cursor.toArray()
    res.send(result)
   })

      // update data
      // app.put('/donation/:id',async(req,res)=>{
      //   const id=req.params.id;
      //   const data=req.body;
      //   console.log(data)
      //   console.log(id)
      //   const filter={_id:ObjectId(id)}
      //   const options = { upsert: true };
      //   const updateDoc = {
      //     $set: {
      //     img:data.img
      //     },
      //   };
      //   const result = await peopleCollection.updateOne(filter, updateDoc, options);
      //   res.send(result)
      // })
      // // delete
      // app.delete('/donation/:id',async(req,res)=>{
      //   const id=req.params.id;
      //   const query={_id:ObjectId(id)}
      //   const result=await peopleCollection.deleteOne(query)
      //   res.send(result)
      // })
   }
   finally{

   }
}
run().catch(console.dir);
 

// middleware
app.use(cors());
app.use(express.json())


// app.get('/donation',async(req,res)=>{
//     res.send('get data from mongodb')
// })

app.get('/',async(req,res)=>{
    res.send('ok,this is connect')
})
app.listen(port,()=>{
    console.log('listening',port)
})