import { GlobalConfig } from '../../../../config/global';
import type { StatusResult } from '../../../../util/git/types';
import type { BranchConfig, BranchUpgradeConfig } from '../../../types';
import * as postUpgradeCommands from './execute-post-upgrade-commands';
import { fs, git, logger, partial } from '~test/util';

vi.mock('../../../../util/fs');

describe('workers/repository/update/branch/execute-post-upgrade-commands', () => {
  describe('postUpgradeCommandsExecutor', () => {
    it('handles an artifact which is a directory', async () => {
      const commands = partial<BranchUpgradeConfig>([
        {
          manager: 'some-manager',
          branchName: 'main',
          postUpgradeTasks: {
            executionMode: 'update',
            commands: ['disallowed_command'],
          },
        },
      ]);
      const config: BranchConfig = {
        manager: 'some-manager',
        updatedPackageFiles: [],
        updatedArtifacts: [
          { type: 'addition', path: 'some-existing-dir', contents: '' },
          { type: 'addition', path: 'artifact', contents: '' },
          {
            type: 'addition',
            path: 'symlink',
            contents: 'dest',
            isSymlink: true,
          },
        ],
        artifactErrors: [],
        upgrades: [],
        branchName: 'main',
        baseBranch: 'base',
      };
      git.getRepoStatus.mockResolvedValueOnce(
        partial<StatusResult>({
          modified: [],
          not_added: [],
          deleted: [],
        }),
      );
      GlobalConfig.set({
        localDir: __dirname,
        allowedCommands: ['some-command'],
      });
      fs.localPathIsFile
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      fs.localPathExists
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const res = await postUpgradeCommands.postUpgradeCommandsExecutor(
        commands,
        config,
      );

      expect(res.updatedArtifacts).toHaveLength(3);
      expect(fs.writeLocalFile).toHaveBeenCalledTimes(1);
    });

    it('executes commands on update package files', async () => {
      const commands = partial<BranchUpgradeConfig>([
        {
          manager: 'some-manager',
          branchName: 'main',
          postUpgradeTasks: {
            executionMode: 'update',
            commands: ['disallowed_command'],
          },
        },
      ]);
      const config: BranchConfig = {
        manager: 'some-manager',
        updatedPackageFiles: [
          { type: 'addition', path: 'some-existing-dir', contents: '' },
          { type: 'addition', path: 'artifact', contents: '' },
        ],
        upgrades: [],
        branchName: 'main',
        baseBranch: 'base',
      };
      git.getRepoStatus.mockResolvedValueOnce(
        partial<StatusResult>({
          modified: [],
          not_added: [],
          deleted: [],
        }),
      );
      GlobalConfig.set({
        localDir: __dirname,
        allowedCommands: ['some-command'],
      });
      fs.localPathIsFile
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      fs.localPathExists
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const res = await postUpgradeCommands.postUpgradeCommandsExecutor(
        commands,
        config,
      );

      expect(res.updatedArtifacts).toHaveLength(0);
      expect(fs.writeLocalFile).toHaveBeenCalledTimes(1);
    });

    it('logs files which do not match fileFilters', async () => {
      const commands = partial<BranchUpgradeConfig>([
        {
          manager: 'some-manager',
          branchName: 'main',
          postUpgradeTasks: {
            executionMode: 'branch',
            commands: ['command'],
            fileFilters: ['*.txt'],
          },
        },
      ]);
      const config: BranchConfig = {
        manager: 'some-manager',
        updatedPackageFiles: [
          { type: 'addition', path: 'some-existing-dir', contents: '' },
          { type: 'addition', path: 'artifact', contents: '' },
        ],
        upgrades: [],
        branchName: 'main',
        baseBranch: 'base',
      };
      git.getRepoStatus.mockResolvedValueOnce(
        partial<StatusResult>({
          modified: ['not-a-txt-file'],
          not_added: [],
          deleted: [],
        }),
      );
      GlobalConfig.set({
        localDir: __dirname,
        allowedCommands: ['some-command'],
      });
      fs.localPathIsFile
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      fs.localPathExists
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const res = await postUpgradeCommands.postUpgradeCommandsExecutor(
        commands,
        config,
      );

      expect(res.updatedArtifacts).toHaveLength(0);
      expect(fs.writeLocalFile).toHaveBeenCalledTimes(1);
      expect(logger.logger.debug).toHaveBeenCalledWith(
        { file: 'not-a-txt-file' },
        'Post-upgrade file did not match any file filters',
      );
    });

    it('handles previously-deleted files which are re-added', async () => {
      const commands = partial<BranchUpgradeConfig>([
        {
          manager: 'some-manager',
          branchName: 'main',
          postUpgradeTasks: {
            executionMode: 'branch',
            commands: ['command'],
            fileFilters: ['*.txt'],
          },
        },
      ]);
      const config: BranchConfig = {
        manager: 'some-manager',
        updatedPackageFiles: [
          { type: 'addition', path: 'unchanged.txt', contents: 'changed' },
          { type: 'deletion', path: 'was-deleted.txt' },
        ],
        upgrades: [],
        branchName: 'main',
        baseBranch: 'base',
      };
      git.getRepoStatus.mockResolvedValueOnce(
        partial<StatusResult>({
          modified: [],
          not_added: [],
          deleted: [],
        }),
      );
      GlobalConfig.set({
        localDir: __dirname,
        allowedCommands: ['some-command'],
      });
      fs.localPathIsFile
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      fs.localPathExists
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const res = await postUpgradeCommands.postUpgradeCommandsExecutor(
        commands,
        config,
      );

      expect(res.updatedArtifacts).toHaveLength(0);
    });
  });
});
