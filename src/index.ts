import {GitHubPRCommenter} from './gh-pr-commenter';
import {MigratorTester} from './migrator-tester';
import * as core from '@actions/core';
import * as github from '@actions/github';
import {MIGRATION_FILENAME_DELIMITER} from './config';

type Opts = {
  githubToken: string;
  migrationDirectories: string[];
  baseBranch: string;
  currBranch: string;
  migrationDelimiter: string;
  mentionAuthor: boolean;
};

/**
 * Main function which is invoked
 */
async function main() {
  const githubToken =
    process.env.INPUT_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const octokit = github.getOctokit(githubToken);
  const {data: pr} = await octokit.rest.pulls.get({
    pull_number: github.context.payload.pull_request?.number || 0,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });
  const migrationDirectories = process.env.INPUT_MIGRATIONS_DIRECTORIES?.split(
      '\n',
  ).forEach((val) => val.trim());

  const opts: Opts = {
    githubToken: githubToken,
    baseBranch: pr.base.ref || process.env.INPUT_BASE_BRANCH,
    currBranch: pr.head.ref || process.env.INPUT_CURRENT_BRANCH,
    migrationDirectories:
      core.getMultilineInput('migration_directories') || migrationDirectories,
    migrationDelimiter:
      core.getInput('migration_delimiter') ||
      process.env.INPUT_MIGRATION_FILENAME_DELIMITER ||
      MIGRATION_FILENAME_DELIMITER,
    mentionAuthor: core.getBooleanInput('mention_author'),
  };
  const errorMessages: string[] = [];
  for (const migrationDir of opts.migrationDirectories) {
    const mtInstance = new MigratorTester({
      baseBranch: opts.baseBranch,
      currBranch: opts.currBranch,
      migrationsDir: migrationDir,
      migrationsDelimiter: opts.migrationDelimiter,
    });

    try {
      mtInstance.validate();
    } catch (error) {
      console.log('typeof error', typeof error);
      if (typeof error === 'object') {
        errorMessages.push((error as Error).message);
      }
    }
  }
  const ghPRCommenterInstance = new GitHubPRCommenter({
    mentionAuthor: opts.mentionAuthor,
    message: errorMessages.join('\n'),
    githubToken: githubToken,
    authorUsername: pr.user?.login || '',
    prNumber: github.context.payload.pull_request?.number || 0,
  });

  ghPRCommenterInstance.comment();
}

main();
