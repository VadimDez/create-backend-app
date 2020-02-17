#!/usr/bin/env node

const shell = require("shelljs");
const fs = require("fs");
const colors = require("colors");
const path = require("path");
const inquirer = require("inquirer");


const {
  createFolderStructure,
  loadTemplate
} = require("./utils");

const questions = [{
  name: "name",
  type: "input",
  message: "Insert name of the project?"
},
{
  name: "appId",
  type: "confirm",
  message: "Would you like to use AppID?",
  default: true
}
];

function copyTemplates(appDirectory, answers) {
  const templateFiles = [
    ".env.example",
    [".env.example", ".env"],
    ["config/express.js.ejs", "config/express.js"],
    ["package.json.ejs", "package.json"],
    ["config/vars.js.ejs", "config/vars.js"],
    ["api/routes/v1/index.js.ejs", "api/routes/v1/index.js"],
    ["api/controllers/main.controller.js.ejs", "api/controllers/main.controller.js"],
    ["swagger/swagger.yaml.ejs", "swagger/swagger.yaml"],
    ["tests/integration/test.spec.js.ejs", "tests/integration/test.spec.js"],
    [".gitignore.ejs", ".gitignore"],
  ];

  for (let file of templateFiles) {
    let destination;

    if (Array.isArray(file)) {
      destination = file[1];
      file = file[0];
    }
    let template = loadTemplate(file);

    Object.keys(answers).forEach(key => {
      template.locals[key] = answers[key];
    });

    createFolderStructure(appDirectory, file);

    fs.writeFileSync(
      path.join(appDirectory, destination || file),
      template.render()
    );
  }
}

function simpleCopy(appDirectory, answers) {
  const filesToCopy = [
    "config/winston.js",
    "swagger/swagger.js",
    "tests/unit/example.spec.js",
    ".pipeline",
    "build.sh",
    "cicd-pipeline.md",
    "deployment.example.yml",
    "Dockerfile",
    "index.js",
    "jest-integration-config.json",
    "jest-unit-config.json",
    "manifest.yml",
    "README.md",
    "run.sh",
    "secrets.example.yml"
  ];

  if (answers.appId) {
    filesToCopy.push("config/passport.js");
    filesToCopy.push("api/middlewares/auth.js");
  }

  for (let file of filesToCopy) {
    createFolderStructure(appDirectory, file);

    fs.copyFileSync(
      path.join(__dirname, "templates", file),
      path.join(appDirectory, file)
    );
  }
}

const run = async () => {
  const answers = await inquirer.prompt(questions);

  const appDirectory = `${process.cwd()}/${answers.name}`;
  fs.mkdirSync(appDirectory);

  copyTemplates(appDirectory, answers);
  simpleCopy(appDirectory, answers);

  console.log(`${answers.name} created!`.green);
};
run();