import { RenovateConfig } from '../../../config';
import { addMeta, logger, removeMeta } from '../../../logger';
import { branchExists } from '../../../util/git';
import { processBranch } from '../../branch';
import { BranchConfig, ProcessBranchResult } from '../../common';
import { Limit, incLimitedValue, setMaxLimit } from '../../global/limits';
import { getBranchesRemaining, getPrsRemaining } from './limits';

export type WriteUpdateResult = 'done' | 'automerged';

export async function writeUpdates(
  config: RenovateConfig,
  allBranches: BranchConfig[]
): Promise<WriteUpdateResult> {
  let branches = allBranches;
  logger.debug(
    `Processing ${branches.length} branch${
      branches.length !== 1 ? 'es' : ''
    }: ${branches
      .map((b) => b.branchName)
      .sort()
      .join(', ')}`
  );
  branches = branches.filter((branchConfig) => {
    if (branchConfig.blockedByPin) {
      logger.debug(`Branch ${branchConfig.branchName} is blocked by a Pin PR`);
      return false;
    }
    return true;
  });

  const prsRemaining = await getPrsRemaining(config);
  logger.debug({ prsRemaining }, 'Calculated maximum PRs remaining this run');
  setMaxLimit(Limit.PullRequests, prsRemaining, true);

  const branchesRemaining = getBranchesRemaining(config);
  logger.debug(
    { branchesRemaining },
    'Calculated maximum branches remaining this run'
  );
  setMaxLimit(Limit.Branches, branchesRemaining, true);

  for (const branch of branches) {
    addMeta({ branch: branch.branchName });
    const branchExisted = branchExists(branch.branchName);
    const res = await processBranch(branch);
    branch.res = res;
    if (
      res === ProcessBranchResult.Automerged &&
      branch.automergeType !== 'pr-comment'
    ) {
      // Stop procesing other branches because base branch has been changed
      return 'automerged';
    }
    if (res === ProcessBranchResult.PrCreated) {
      incLimitedValue(Limit.PullRequests);
    }
    if (
      res === ProcessBranchResult.Automerged &&
      branch.automergeType === 'pr-comment' &&
      branch.requiredStatusChecks === null
    ) {
      incLimitedValue(Limit.PullRequests);
    }
    if (!branchExisted && branchExists(branch.branchName)) {
      incLimitedValue(Limit.Branches);
    }
  }
  removeMeta(['branch']);
  return 'done';
}
