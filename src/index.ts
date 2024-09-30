import { app } from "./configs/express";

const port = 4000;

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
