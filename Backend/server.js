import { ConnectDB } from "./config/Database.js";
import { env } from "./config/env.js";
import app from "./app.js"

ConnectDB().then(()=>
app.listen(env.PORT,()=>console.log(`Server is live on ${env.PORT}`)))
.catch((err)=>{
    console.error("Startup failed:",err);
    process.exit(1);
});
