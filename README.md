# migrator-conflicts

Check if the migrations in your branch has conflicts with the base branch.

Are you running into issues because of your migration versions are behind the latest migrations when you merge? Depending on what you use for managing your migrations. During the deploy phase it will throw an error like

```console
# below is migration error when goose is being used
# https://github.com/pressly/goose
migrations/main.go: error: Missing migration version 20220702213559_*
```

To get rid of issues like this you need to make sure your migration versions are ahead of the version in the base branch when your raise a PR and change your migration versions (usually timestamps) to a later one to rectify. This action checks all of your migrations in your branch against the base branch when you raise a pr and notifies you by commenting on your PR. This makes sure you never accidently merge PR with conflicting versions.

For viewing the comments on different cases [look at PRs with label **test** on this repo](https://github.com/PrashantRaj18198/migrator-conflict/pulls?q=is%3Apr+is%3Aopen+label%3Atest).

## Usage

```yaml
name: Check for migration conflicts

on:
  pull_request:
    types:
      - "opened"
      - "edited"
      - "synchronize"

jobs:
  migrator-conflicts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # otherwise, you will failed to push refs to dest repo

      - name: Run migrator-conflicts
        uses: PrashantRaj18198/migrator-conflicts@v0
        with:
          github_token: ${{ github.token }} # must have permission to comment on PRs
          # Read more about github token permissions on this blog: https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/

          # List of migration directories to compare for
          migration_directories: |
            example/users/migrations
          mention_author: true # Tag author in comment
```

## Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

|         INPUT         |  TYPE  | REQUIRED |  DEFAULT  |                                                                                                                                                                            DESCRIPTION                                                                                                                                                                             |
|-----------------------|--------|----------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| base_branch           | string | false    |           | Base branch to compare current<br>migrations against                                                                                                                                                                                                                                                                                                               |
| current_branch        | string | false    |           | Current branch to compare against<br>the base branch                                                                                                                                                                                                                                                                                                               |
| github_token          | string | true     |           | Github token, required to comment<br>on pull requests                                                                                                                                                                                                                                                                                                              |
| mention_author        | string | false    | `"false"` | Tag the author in comment<br>if 'mention_author' is marked 'true'<br>                                                                                                                                                                                                                                                                                              |
| migration_delimiter   | string | false    | `"_"`     | Delimiter to use for the<br>files to get the migration<br>version. If your migrations files<br>are named with '_' delimiter,<br>for example 'migrations/20220702213559_initial_migration.sql' here the<br>delimiter is '_'. Delimiter is<br>used to fetch the migration<br>version for a file. In<br>the above example the migration<br>version is 20220702213559. |
| migration_directories | string | true     |           | List of migration directories to<br>compare for conflicts. Each directory<br>in 'current_branch' is compared against<br>the 'base_branch' for migration conflicts.<br>For example, if migration_directories =<br>['users/migrations', 'orders/migrations'], 'users/migrations' of current_branch<br>is compared against 'users/migrations' of<br>base_branch.      |

<!-- AUTO-DOC-INPUT:END -->

## TODOs

- [x] Implement migrator-conflicts with github action
- [ ] Add migrator-tester test
- [ ] Add pr commenter test using fake client
- [ ] Add examples for specific migration tools like goose, sequelize, django-migrations, etc.
