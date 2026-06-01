import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import express from "express";
import { serve } from "inngest/express";


import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { functions, inngest } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat",chatRoutes);

app.get("/health",(req,res) => {
  req.auth;
  res.status(200).json({msg: "api is up and running" });
});


app.get("/", (req, res) => {
  res.status(200).json({ msg: "success from backend" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("Server is running on port:", ENV.PORT)
    );
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();

// import express from "express";

// import cors from "cors";
// import { serve } from "inngest/express";


// import { connectDB } from "./lib/db.js";
// import { ENV } from "./lib/env.js";
// const app = express();


// // middleware
// app.use(express.json());
// app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));

// app.use("/api/inngest", serve({client:inngest,functions}));

// app.get("/",(req,res) => {
//     res.status(200).json({msg:"success from backend"})
// });

// // app.listen(ENV.PORT,() => {
// //     console.log("server is running on port:",ENV.PORT);
// //     connectDB();
// // });

// const startServer = async () => {
//     try{
//         await connectDB();
//         app.listen(ENV.PORT, () => console.log("Server is running on port:",ENV.PORT));
//     }catch(error){
//         console.error("Error starting the server",error);
//     }
// };

// startServer();