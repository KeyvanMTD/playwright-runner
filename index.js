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

  // ➤ Chemin absolu requis par Render
  const testPath = path.join(__dirname, "test.spec.js");

  // ➤ Écrit le script dans un fichier JS
  fs.writeFileSync(testPath, script);

  // ➤ Exécution du test avec Playwright (JS)
  exec(`npx playwright test ${testPath} --project=default`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`QA Runner Server démarré sur http://localhost:${PORT}`);
});
