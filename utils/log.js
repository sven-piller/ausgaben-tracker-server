"use strict";
var chalk = require('chalk');
var Promise = require('any-promise');
var os = require('os');
var pkg = require('./../package.json');

function log(message) {
    console.error(message);
}
exports.log = log;
function formatLine(color, type, line, prefix) {
    return chalk.bgBlack.white(pkg.shortname) + " " + color(type) + " " + (prefix ? chalk.magenta(prefix + " ") : '') + line;
}
function logInfo(message, prefix) {
    var output = message.split(/\r?\n/g).map(function (line) {
        return formatLine(chalk.bgBlack.cyan, 'INFO', line, prefix);
    }).join('\n');
    log(output);
}
exports.logInfo = logInfo;
function logWarning(message, prefix) {
    var output = message.split(/\r?\n/g).map(function (line) {
        return formatLine(chalk.bgYellow.black, 'WARN', line, prefix);
    }).join('\n');
    log(output);
}
exports.logWarning = logWarning;
function logError(message, prefix) {
    var output = message.split(/\r?\n/g).map(function (line) {
        return formatLine(chalk.bgBlack.red, 'ERR!', line, prefix);
    }).join('\n');
    log(output);
}
exports.logError = logError;
function handle(promise, options) {
    return Promise.resolve(promise).catch(function (err) { return handleError(err, options); });
}
exports.handle = handle;
function handleError(error, options) {
    var cause = error;
    logError(error.message, 'message');
    while (cause = cause.cause) {
        logError(cause.message, 'caused by');
    }
    if (options.verbose && error.stack) {
        log('');
        logError(error.stack, 'stack');
    }
    log('');
    logError(process.cwd(), 'cwd');
    logError(os.type() + " " + os.release(), 'system');
    logError(process.argv.map(JSON.stringify).join(' '), 'command');
    logError(process.version, 'node -v');
    logError(pkg.version, "pkg -v");
    if (error.code) {
        logError(error.code, 'code');
    }
    process.exit(1);
}
exports.handleError = handleError;
