const path = require("path");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./script.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "script.bundle.js",
  },
};
