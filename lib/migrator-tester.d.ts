declare type MigratorTesterOptions = {
    baseBranch: string;
    currBranch: string;
    migrationsDir: string;
    migrationsDelimiter: string;
};
/**
 * MigratorTester impl
 */
export declare class MigratorTester {
    private opts;
    /**
     * Construction impl
     * @param {MigratorTesterOptions} opts Options for migrator tester
     */
    constructor(opts: MigratorTesterOptions);
    /**
     * Parse the migration file version field and add to the list
     * @param {string} filename the migration filename.
     * @param {Array<MigrationFile>} migrationsList
     * the list of migrations where the parsed result should be appended.
     */
    private addMigrationToMigrationsList;
    /**
     * Get the max version from migrations
     * @param {Array<MigrationFile>} migrationsList list of migrations
     * @return {MigrationFile} the max version migration
     */
    private maxMigration;
    /**
     * Checkout to base branch and find the latest migration
     * @param {string} branch branch to checkout
     * @return {MigrationFile} latest migration on branch
     */
    private checkoutAndFindLatestMigration;
    /** validate will validate the migration names between base and current branch
     * and throw an error if something is wrong.
     * If no errors are thrown validation is a success
     */
    validate(): void;
}
export {};
