import express from "express";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
const app = express();

console.log();

console.log(ENV.PORT);
console.log(ENV.DB_URL);

app.get("/",(req,res) => {
    res.status(200).json({msg:"success from backend"})
});

// app.listen(ENV.PORT,() => {
//     console.log("server is running on port:",ENV.PORT);
//     connectDB();
// });

const startServer = async () => {
    try{
        await connectDB();
        app.listen(ENV.PORT, () => console.log("Server is running on port:",ENV.PORT));
    }catch(error){
        console.error("Error starting the server",error);
    }
};

startServer();