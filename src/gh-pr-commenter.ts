import * as github from '@actions/github';
import * as core from '@actions/core';
import {GitHub} from '@actions/github/lib/utils';

export type GitHubPRCommenterOptions = {
  message: string;
  githubToken: string;
  prNumber: number;
  mentionAuthor: boolean;
  authorUsername: string;
};

/**
 * GithubPRCommenter implements logic to comment on prs with the passed message
 * Comments are made only when they aren't present in the pr.
 * This makes sure comments are not repeated
 */
export class GitHubPRCommenter {
  private opts: GitHubPRCommenterOptions;
  private octokit: InstanceType<typeof GitHub>;
  /**
   * Constructor impl for class
   * @param {GitHubPRCommenter} opts Options for GithubPRCommenter class
   */
  constructor(opts: GitHubPRCommenterOptions) {
    this.opts = opts;
    this.octokit = github.getOctokit(this.opts.githubToken);
    if (this.opts.mentionAuthor) {
      this.opts.message += `\n${opts.authorUsername}\n`;
    }
  }

  /**
   * Comment on pr if already not commented
   */
  async comment() {
    if (!this.opts.prNumber) {
      core.setFailed('No pull request in input neither in current context.');
      return;
    }
    let page = 1;
    let shouldComment = true;

    while (true) {
      const response = await this.octokit.rest.issues.listComments({
        ...github.context.repo,
        issue_number: this.opts.prNumber,
        page: page,
        per_page: 100,
      });
      if (response.status >= 200 && response.status < 300) {
        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].body == this.opts.message) {
            console.log(
                `Comment already made by action. Skipping re-commenting.
              Please delete the old comment made to re-comment.`,
            );
            shouldComment = false;
            break;
          }
        }
        page++;
      } else {
        break;
      }
    }
    console.log('Creating a new comment on pr.');
    if (shouldComment) {
      await this.octokit.rest.issues.createComment({
        ...github.context.repo,
        issue_number: this.opts.prNumber,
        body: this.opts.message,
      });
      console.log('Created new comment on pr.');
    }
  }
}
