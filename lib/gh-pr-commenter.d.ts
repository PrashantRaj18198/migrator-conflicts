export declare type GitHubPRCommenterOptions = {
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
export declare class GitHubPRCommenter {
    private opts;
    private octokit;
    /**
     * Constructor impl for class
     * @param {GitHubPRCommenter} opts Options for GithubPRCommenter class
     */
    constructor(opts: GitHubPRCommenterOptions);
    /**
     * Comment on pr if already not commented
     */
    comment(): Promise<void>;
}
