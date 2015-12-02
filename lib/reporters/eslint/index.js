"use strict";

var CLIEngine = require("eslint").CLIEngine;

var configPath = null;

exports.setConfigPath = function (newConfigPath) {
  configPath = newConfigPath;
};

exports.process = function (source, options, reportInfo) {
  var results = lintCLI(source, options, reportInfo);
  var report = generateReport(results);
  return report;
};

function generateReport(data) {

  var out = {
    messages : []
  };

  data.results.forEach(function (result) {
    out.messages.push({
      severity : 'error',
      line     : result.line,
      column   : result.column,
      message  : result.message,
      source   : result.source
    });
  });

  return out;
}

function lintCLI (source, config, reportInfo) {
  config = config || {};

  var results = [];
  var data = [];

  // Remove potential Unicode BOM.
  source = source.replace(/^\uFEFF/, "");

  var eslintCLI = new CLIEngine({
    configFile: configPath
  });

  var messages = eslintCLI.executeOnText(source, reportInfo.fileShort);
  results = results.concat(messages);

  return {
    results : results,
    data : data
  };
}
