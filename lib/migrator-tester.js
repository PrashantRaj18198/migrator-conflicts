"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigratorTester = void 0;
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var console_1 = require("console");
/**
 * MigratorTester impl
 */
var MigratorTester = /** @class */ (function () {
    /**
     * Construction impl
     * @param {MigratorTesterOptions} opts Options for migrator tester
     */
    function MigratorTester(opts) {
        this.opts = opts;
    }
    /**
     * Parse the migration file version field and add to the list
     * @param {string} filename the migration filename.
     * @param {Array<MigrationFile>} migrationsList
     * the list of migrations where the parsed result should be appended.
     */
    MigratorTester.prototype.addMigrationToMigrationsList = function (filename, migrationsList) {
        var splittedMigrationName = filename.split(this.opts.migrationsDelimiter);
        if (splittedMigrationName.length == 0) {
            console.warn("Length found to be 0 when migration\n        split using ".concat(this.opts.migrationsDelimiter, "\n         for ").concat(this.opts.migrationsDir, "/").concat(filename, ".\n        Perhaps the migration delimiter is wrong.\n        Update using 'MT_MIGRATION_FILENAME_DELIMITER' environment variable"));
            return;
        }
        migrationsList.push({
            filename: filename,
            ts: splittedMigrationName[0],
        });
    };
    /**
     * Get the max version from migrations
     * @param {Array<MigrationFile>} migrationsList list of migrations
     * @return {MigrationFile} the max version migration
     */
    MigratorTester.prototype.maxMigration = function (migrationsList) {
        if (migrationsList.length == 0) {
            return {
                ts: '',
                filename: '',
            };
        }
        var largest = migrationsList[0];
        for (var index = 1; index < migrationsList.length; index++) {
            var compareVal = largest.ts.localeCompare(migrationsList[index].ts);
            if (compareVal == -1) {
                largest = migrationsList[index];
            }
            if (compareVal == 0) {
                throw (0, console_1.error)("Timestamp found to be same\n          for ".concat(largest.filename, " and ").concat(migrationsList[index].filename, ".\n        This should not be the case as timestamp is used as version by migrator.\n        Please update"));
            }
        }
        return largest;
    };
    /**
     * Checkout to base branch and find the latest migration
     * @param {string} branch branch to checkout
     * @return {MigrationFile} latest migration on branch
     */
    MigratorTester.prototype.checkoutAndFindLatestMigration = function (branch) {
        var _this = this;
        var baseCheckoutOutput = (0, child_process_1.execSync)("git checkout ".concat(branch), {
            encoding: 'utf-8',
            cwd: this.opts.migrationsDir,
        });
        console.log(baseCheckoutOutput);
        var files = (0, fs_1.readdirSync)(this.opts.migrationsDir);
        var migrationsList = [];
        files.forEach(function (file) {
            return _this.addMigrationToMigrationsList(file, migrationsList);
        });
        return this.maxMigration(migrationsList);
    };
    /** validate will validate the migration names between base and current branch
     * and throw an error if something is wrong.
     * If no errors are thrown validation is a success
     */
    MigratorTester.prototype.validate = function () {
        var baseLatestMigration = this.checkoutAndFindLatestMigration(this.opts.baseBranch);
        var currLatestMigration = this.checkoutAndFindLatestMigration(this.opts.currBranch);
        var compareVal = baseLatestMigration.ts.localeCompare(currLatestMigration.ts);
        if (compareVal > -1) {
            throw (0, console_1.error)("Base branch \"".concat(this.opts.baseBranch, "\" has migrations,\n           with later or same timestamp as the current branch\n            \"").concat(this.opts.currBranch, "\".\n        Please update the timestamps to a later point"));
        }
    };
    return MigratorTester;
}());
exports.MigratorTester = MigratorTester;
