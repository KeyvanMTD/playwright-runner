const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const script = req.body.script;

  if (!script) {
    return res.status(400).json({ error: "Missing script" });
  }

  // ➤ Écriture du script dans un fichier
  const testPath = path.join(__dirname, "test.spec.ts");
  fs.writeFileSync(testPath, script);

  // ➤ Exécution de Playwright en forçant le config + chemin projet
  const command = `npx playwright test ${testPath} --config=${path.join(__dirname, "playwright.config.mjs")} --project=default`;

  exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || "Unknown error" });
    }
    res.json({ output: stdout });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`QA Runner Server démarré sur http://localhost:${PORT}`);
});
