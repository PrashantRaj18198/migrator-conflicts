/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      INPUT_BASE_BRANCH: string;
      INPUT_CURRENT_BRANCH: string;
      INPUT_MIGRATIONS_DIRECTORIES: string;
      INPUT_MIGRATION_FILENAME_DELIMITER: string;
      INPUT_GITHUB_TOKEN: string;
      GITHUB_TOKEN: string;
    }
  }
}

export {};
