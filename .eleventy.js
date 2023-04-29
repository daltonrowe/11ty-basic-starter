const fs = require('fs')
const path = require('path')
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {

  // Development

  eleventyConfig.setServerOptions({
    liveReload: true,
    domDiff: true,
    port: 5174,
    watch: ['src/**/*.*'],
    encoding: "utf-8",
  });

  eleventyConfig.addWatchTarget("./src/css/");

  // Configuration

  eleventyConfig.on('eleventy.after', async () => {
    let allCssMin = '';

    const cssPath = path.resolve(__dirname, "src/css");
    const cssFiles = fs.readdirSync(cssPath)

    for (let i = 0; i < cssFiles.length; i++) {
      const cssFile = cssFiles[i];
      const cssData = fs.readFileSync(path.join(cssPath, cssFile));
      const cssMin = new CleanCSS().minify(cssData).styles
      allCssMin += cssMin
    }

    const cssOutputPath = path.resolve(__dirname, "build/style.css");
    fs.writeFileSync(cssOutputPath, allCssMin)
  });

  return {
    dir: {
      input: "src/pages",
      output: "build",
      includes: "../partial",
      layouts: "../layouts"
    },
    htmlTemplateEngine: "liquid"
  }
};