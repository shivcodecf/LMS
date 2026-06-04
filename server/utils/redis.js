import { createClient } from "redis";

const redisClient = createClient({
  url:"redis://localhost:6379",  
})


redisClient.on("erorr",(err)=>{
    console.error("Redis error",err);
});

export default redisClient;