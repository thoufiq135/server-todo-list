let express=require("express")
require('dotenv').config();
let mong=require("mongoose")
url="mongodb+srv://todo:Shaik13579@cluster0.ze5zd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mong.connect(url).then(()=>{
    console.log("connected to mongo server")
}).catch((e)=>{
    console.log("Error",e)
})
let app=express()
const schema= mong.Schema({
    "name":String,
})
const pro=mong.model("task",schema)


const cors = require("cors");
app.use(cors());
app.use(express.json());
let port=process.env.port||3000


 

app.get("/",async(req,res)=>{
    try{
        const data=await pro.find()
       console.log(data)
        res.json(data)
    }catch(e){
        console.log(e)
        res.json(e)
    }
        
    
})
app.post("/", async (req, res) => {
    const clientdata = req.body;
    console.log("client =", clientdata);

    try {

        const insertResult = await pro.insertMany(clientdata); 
        console.log("Inserted:", insertResult);
        

        await pro.deleteMany({"name":{$eq:null}}).then((res)=>{console.log("deleted",res)}).catch((e)=>{console.log(e)})
        const data = await pro.find( {"name":  {$ne:null},});
        const datanull = await pro.find( {"name":{$ne:null,$ne:""}});
        console.log("values=",data);
        console.log("null=",datanull)
      
        
        res.json(data);
    } catch (e) {
     
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

app.put("/:id", async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
       
        const updatedProduct = await pro.updateOne(
            { "name": id },  
            { $set: update }  
        );

        if (updatedProduct.nModified === 0) {
            return res.status(404).json({ message: "Product not found or no changes made" });
        }

        res.status(200).json({ message: "Update successful" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/:id",(req,res)=>{
    const{id}=req.params
    console.log(id)
   pro.deleteMany({"name":id}).catch((e)=>{console.log(e)})
    .then(async()=>{
        await pro.find()
        res.status(200).json("deleted")
    })
    

})
app.listen(port,()=>{
    console.log(`server is working on ${port}....`)
}) 
