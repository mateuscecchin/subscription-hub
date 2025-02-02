import { app } from "./configs/express";
import { routes } from "./routes/index";
// import dotenv from "dotenv";
// dotenv.config();
app.use(routes);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

export default app;