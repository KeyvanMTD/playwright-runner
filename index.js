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

  const testPath = path.join(__dirname, "test.spec.ts");

  try {
    fs.writeFileSync(testPath, script);
  } catch (err) {
    return res.status(500).json({ error: "Failed to write test file" });
  }

  exec(`npx playwright test ${testPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("Playwright ERROR:", error);
      console.error("stderr:", stderr);
      return res.status(500).json({ error: stderr || error.message });
    }

    res.json({ output: stdout });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`QA Runner Server démarré sur http://localhost:${PORT}`);
});
