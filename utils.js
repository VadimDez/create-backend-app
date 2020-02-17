const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const util = require("util");

function createFolderStructure(dir, file) {
  const filePath = file.split("/");
  while (filePath.length > 1) {
    dir += `/${filePath.shift()}`;
    fs.existsSync(dir) || fs.mkdirSync(dir);
  }
}

function loadTemplate(name) {
  let contents = fs.readFileSync(
    path.join(__dirname, "templates", name),
    "utf-8"
  );
  let locals = Object.create(null);

  function render() {
    return ejs.render(contents, locals, {
      escape: util.inspect
    });
  }

  return {
    locals: locals,
    render: render
  };
}

module.exports = {
  createFolderStructure,
  loadTemplate
};