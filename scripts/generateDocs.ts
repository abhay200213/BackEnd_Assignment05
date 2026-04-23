import fs from "fs";
import path from "path";
import { swaggerSpec } from "../config/swagger"; 

const docsDir = path.join(process.cwd(), "docs");
const outputPath = path.join(docsDir, "openapi.json");

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), "utf-8");

console.log("OpenAPI spec generated at docs/openapi.json");