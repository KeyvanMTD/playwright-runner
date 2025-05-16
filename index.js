const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const script = req.body.script;

  if (!script) {
    return res.status(400).send("Missing script");
  }

  const fs = require("fs");
  const path = "./test.spec.ts";

  fs.writeFileSync(path, script);

  exec(`npx playwright test ${path}`, (error, stdout, stderr) => {
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
