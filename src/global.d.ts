/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      MT_BASE_BRANCH: string;
      MT_CURRENT_BRANCH: string;
      MT_MIGRATIONS_DIRECTORIES: string;
      MT_MIGRATION_FILENAME_DELIMITER: string;
    }
  }
}

export {};
