import { app } from "./configs/express";
// import dotenv from "dotenv";
// dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

export default app;