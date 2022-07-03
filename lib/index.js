"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var gh_pr_commenter_1 = require("./gh-pr-commenter");
var migrator_tester_1 = require("./migrator-tester");
var core = require("@actions/core");
var github = require("@actions/github");
var config_1 = require("./config");
/**
 * Main function which is invoked
 */
function main() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var githubToken, octokit, pr, migrationDirectories, opts, errorMessages, _i, _e, migrationDir, mtInstance, ghPRCommenterInstance;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    githubToken = process.env.INPUT_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
                    octokit = github.getOctokit(githubToken);
                    return [4 /*yield*/, octokit.rest.pulls.get({
                            pull_number: ((_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number) || 0,
                            owner: github.context.repo.owner,
                            repo: github.context.repo.repo,
                        })];
                case 1:
                    pr = (_f.sent()).data;
                    migrationDirectories = (_b = process.env.INPUT_MIGRATIONS_DIRECTORIES) === null || _b === void 0 ? void 0 : _b.split('\n').forEach(function (val) { return val.trim(); });
                    opts = {
                        githubToken: githubToken,
                        baseBranch: pr.base.ref || process.env.INPUT_BASE_BRANCH,
                        currBranch: pr.head.ref || process.env.INPUT_CURRENT_BRANCH,
                        migrationDirectories: core.getMultilineInput('migration_directories') || migrationDirectories,
                        migrationDelimiter: core.getInput('migration_delimiter') ||
                            process.env.INPUT_MIGRATION_FILENAME_DELIMITER ||
                            config_1.MIGRATION_FILENAME_DELIMITER,
                        mentionAuthor: core.getBooleanInput('mention_author'),
                    };
                    errorMessages = [];
                    for (_i = 0, _e = opts.migrationDirectories; _i < _e.length; _i++) {
                        migrationDir = _e[_i];
                        mtInstance = new migrator_tester_1.MigratorTester({
                            baseBranch: opts.baseBranch,
                            currBranch: opts.currBranch,
                            migrationsDir: migrationDir,
                            migrationsDelimiter: opts.migrationDelimiter,
                        });
                        try {
                            mtInstance.validate();
                        }
                        catch (error) {
                            if (typeof error === 'string') {
                                errorMessages.push(error);
                            }
                        }
                    }
                    ghPRCommenterInstance = new gh_pr_commenter_1.GitHubPRCommenter({
                        mentionAuthor: opts.mentionAuthor,
                        message: errorMessages.join('\n'),
                        githubToken: githubToken,
                        authorUsername: ((_c = pr.user) === null || _c === void 0 ? void 0 : _c.login) || '',
                        prNumber: ((_d = github.context.payload.pull_request) === null || _d === void 0 ? void 0 : _d.number) || 0,
                    });
                    ghPRCommenterInstance.comment();
                    return [2 /*return*/];
            }
        });
    });
}
main();
