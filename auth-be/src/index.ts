import { configDotenv } from "dotenv";
import { app } from "./app";

configDotenv({ path: ".env" });
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
