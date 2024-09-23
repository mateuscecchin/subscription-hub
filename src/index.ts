import { app } from "./configs/express";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
