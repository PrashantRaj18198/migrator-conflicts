# migrator-conflicts

Check if the migrations in your branch has conflicts with the base branch

## Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

|         INPUT         |  TYPE  | REQUIRED |  DEFAULT  |                                                                                                                                                                            DESCRIPTION                                                                                                                                                                             |
|-----------------------|--------|----------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| base_branch           | string | false    |           | Base branch to compare current<br>migrations against                                                                                                                                                                                                                                                                                                               |
| current_branch        | string | false    |           | Current branch to compare against<br>the base branch                                                                                                                                                                                                                                                                                                               |
| github_token          | string | false    |           | Github token, required to comment<br>on pull requests                                                                                                                                                                                                                                                                                                              |
| mention_author        | string | false    | `"false"` | Tag the author in comment<br>if 'mention_author' is marked 'true'<br>                                                                                                                                                                                                                                                                                              |
| migration_delimiter   | string | false    | `"_"`     | Delimiter to use for the<br>files to get the migration<br>version. If your migrations files<br>are named with '_' delimiter,<br>for example 'migrations/20220702213559_initial_migration.sql' here the<br>delimiter is '_'. Delimiter is<br>used to fetch the migration<br>version for a file. In<br>the above example the migration<br>version is 20220702213559. |
| migration_directories | string | true     |           | List of migration directories to<br>compare for conflicts. Each directory<br>in 'current_branch' is compared against<br>the 'base_branch' for migration conflicts.<br>For example, if migration_directories =<br>['users/migrations', 'orders/migrations'], 'users/migrations' of current_branch<br>is compared against 'users/migrations' of<br>base_branch.      |

<!-- AUTO-DOC-INPUT:END -->
