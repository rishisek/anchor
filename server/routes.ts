import { Router } from "express";
import proto from "routes/proto";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

routes.use("/proto", proto);

export default routes;
