import {readdirSync} from 'fs';
import {execSync} from 'child_process';

type MigrationFile = {
  ts: string;
  filename: string;
};

type MigratorTesterOptions = {
  baseBranch: string;
  currBranch: string;
  migrationsDir: string;
  migrationsDelimiter: string;
};

/**
 * MigratorTester impl
 */
export class MigratorTester {
  private opts: MigratorTesterOptions;

  /**
   * Construction impl
   * @param {MigratorTesterOptions} opts Options for migrator tester
   */
  constructor(opts: MigratorTesterOptions) {
    this.opts = opts;
  }

  /**
   * Parse the migration file version field and add to the list
   * @param {string} filename the migration filename.
   * @param {Array<MigrationFile>} migrationsList
   * the list of migrations where the parsed result should be appended.
   */
  private addMigrationToMigrationsList(
      filename: string,
      migrationsList: Array<MigrationFile>,
  ) {
    const splittedMigrationName = filename.split(this.opts.migrationsDelimiter);
    if (splittedMigrationName.length == 0) {
      console.warn(
          `
Length found to be 0 when migration split using ${this.opts.migrationsDelimiter}
for ${this.opts.migrationsDir}/${filename}.
Perhaps the migration delimiter is wrong.
Update using 'MT_MIGRATION_FILENAME_DELIMITER' environment variable`,
      );
      return;
    }
    migrationsList.push({
      filename: filename,
      ts: splittedMigrationName[0],
    });
  }

  /**
   * Get the max version from migrations
   * @param {Array<MigrationFile>} migrationsList list of migrations
   * @return {MigrationFile} the max version migration
   */
  private maxMigration(migrationsList: Array<MigrationFile>): MigrationFile {
    if (migrationsList.length == 0) {
      return {
        ts: '',
        filename: '',
      };
    }
    let largest = migrationsList[0];
    for (let index = 1; index < migrationsList.length; index++) {
      const compareVal = largest.ts.localeCompare(migrationsList[index].ts);
      if (compareVal == -1) {
        largest = migrationsList[index];
      }
      if (compareVal == 0) {
        throw new Error(
            `Version found to be same
for ${largest.filename} and ${migrationsList[index].filename}.
This should not be the case as version is used as version by migrator.
Please update`.replace(/\n/g, ' '),
        );
      }
    }
    return largest;
  }

  /**
   * Checkout to base branch and find the latest migration
   * @param {string} branch branch to checkout
   * @return {MigrationFile} latest migration on branch
   */
  private checkoutAndFindLatestMigration(branch: string): MigrationFile {
    const baseCheckoutOutput = execSync(`git checkout ${branch}`, {
      encoding: 'utf-8',
      cwd: this.opts.migrationsDir,
    });
    console.log(baseCheckoutOutput);
    const files = readdirSync(this.opts.migrationsDir);
    const migrationsList: Array<MigrationFile> = [];
    files.forEach((file) =>
      this.addMigrationToMigrationsList(file, migrationsList),
    );
    return this.maxMigration(migrationsList);
  }

  /** validate will validate the migration names between base and current branch
   * and throw an error if something is wrong.
   * If no errors are thrown validation is a success
   */
  validate() {
    const baseLatestMigration = this.checkoutAndFindLatestMigration(
        this.opts.baseBranch,
    );
    const currLatestMigration = this.checkoutAndFindLatestMigration(
        this.opts.currBranch,
    );

    const compareVal = baseLatestMigration.ts.localeCompare(
        currLatestMigration.ts,
    );

    if (compareVal > -1) {
      throw new Error(
          `Base branch "${this.opts.baseBranch}" 
has latest migration with (version: ${baseLatestMigration.ts} 
file: ${baseLatestMigration.filename}). Current branch "${this.opts.currBranch}"
is behind with migration version (version: ${currLatestMigration.ts} 
file: ${currLatestMigration.filename}).
Please update the version to a later point`.replace(/\n/g, ' '),
      );
    }
  }
}
