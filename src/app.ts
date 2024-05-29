import express,{Express, Request, Response} from 'express'
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
//datasource and entities
import { myDataSource } from "./dataSource";
//routes
import router from "./routes/routes";
dotenv.config()
//Connect database with express server
myDataSource
  .initialize()
  .then(async () => {
    console.log("Data source has been initialized!");    
    const app: Express= express();
    const PORT = process.env.PORT || 3000;
    //middlewares
    app.use(cors());
    app.use(bodyParser.json());
    //paths
    app.use(router);
    //inicio del servidor
    app.listen(PORT, () => {
      console.log("The server is listening on the port" + " " + PORT);
    });
  })
  .catch((err) => {
    console.log(
      "Error during data source initialization or server error: ",
      err
    );
  });
