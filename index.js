#!/usr/bin/env node

const shell = require("shelljs");
const fs = require("fs");
const colors = require("colors");
const path = require("path");
const inquirer = require("inquirer");
const ejs = require("ejs");
const util = require("util");

const questions = [
  {
    name: "name",
    type: "input",
    message: "Insert name of the project?"
  }
];

function loadTemplate(name) {
  let contents = fs.readFileSync(
    path.join(__dirname, "templates", name + ".ejs"),
    "utf-8"
  );
  let locals = Object.create(null);

  function render() {
    console.log(locals);

    return ejs.render(contents, locals, {
      escape: util.inspect
    });
  }

  return {
    locals: locals,
    render: render
  };
}

const run = async () => {
  const answers = await inquirer.prompt(questions);
  console.log(answers);

  const appDirectory = `${process.cwd()}/${answers.name}`;
  // let indexTemplate = loadTemplate("index");

  // Object.keys(answers).forEach(key => {
  //   indexTemplate.locals[key] = answers[key];
  // });

  fs.mkdirSync(appDirectory);
  // fs.writeFileSync(path.join(appDirectory, "index.js"), indexTemplate.render());

  const filesToCopy = [
    "api/controllers/main.controller.js",
    "api/middlewares/auth.js",
    "api/v1/index.js",
    "config/exmpress.js",
    "config/passport.js",
    "config/vars.js",
    "config/winston.js",
    "swagger/swagger.js",
    "swagger/swagger.yaml",
    "test/integration/test.spec.js",
    "test/unit/example.spec.js",
    ".env.example",
    ".gitignore",
    ".pipeline",
    "build.sh",
    "ci-cd-pipeline.md",
    "deployment.example.yml",
    "Dockerfile",
    "index.js",
    "jest-integration-config.json",
    "jest-unit-config.json",
    "manifest.yml",
    "package.json",
    "README.md",
    "run.sh",
    "secrets.example.yml"
  ];

  for (let file of filesToCopy) {
    const filePath = file.split("/");

    let dir = appDirectory;
    while (filePath.length > 1) {
      dir += `/${filePath.shift()}`;
      fs.mkdirSync(dir);
    }

    fs.copyFileSync(
      path.join(__dirname, "templates", file),
      path.join(appDirectory, file)
    );
  }

  console.log(`${answers.name} created!`);
};
run();
