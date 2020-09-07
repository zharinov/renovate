import moment from 'moment';
import { RenovateConfig } from '../../../config';
import { logger } from '../../../logger';
import { platform } from '../../../platform';
import { PrState } from '../../../types';

export async function getPrHourlyRemaining(
  config: RenovateConfig
): Promise<number> {
  if (config.prHourlyLimit) {
    logger.debug('Calculating hourly PRs remaining');
    try {
      const prList = await platform.getPrList();
      const currentHourStart = moment({
        hour: moment().hour(),
      });
      logger.debug(`currentHourStart=${String(currentHourStart)}`);
      const soFarThisHour = prList.filter(
        (pr) =>
          pr.branchName !== config.onboardingBranch &&
          moment(pr.createdAt).isAfter(currentHourStart)
      );
      const prsRemaining = Math.max(
        0,
        config.prHourlyLimit - soFarThisHour.length
      );
      logger.debug(`PR hourly limit remaining: ${prsRemaining}`);
      return prsRemaining;
    } catch (err) {
      logger.error('Error checking PRs created per hour');
      return config.prHourlyLimit;
    }
  }
  return 99;
}

export async function getConcurrentPrsRemaining(
  config: RenovateConfig
): Promise<number> {
  if (config.prConcurrentLimit) {
    logger.debug(`Calculating prConcurrentLimit (${config.prConcurrentLimit})`);
    try {
      const prList = await platform.getPrList();
      const openPrs = prList.filter(
        (pr) =>
          pr.state === PrState.Open && pr.branchName !== config.onboardingBranch
      );
      logger.debug(`${openPrs.length} PRs are currently open`);
      const concurrentRemaining = Math.max(
        0,
        config.prConcurrentLimit - openPrs.length
      );
      logger.debug(`PR concurrent limit remaining: ${concurrentRemaining}`);
      return concurrentRemaining;
    } catch (err) {
      logger.error('Error checking concurrent PRs');
      return config.prConcurrentLimit;
    }
  }
  return 99;
}

export async function getPrsRemaining(config: RenovateConfig): Promise<number> {
  const hourlyRemaining = await getPrHourlyRemaining(config);
  const concurrentRemaining = await getConcurrentPrsRemaining(config);
  return hourlyRemaining < concurrentRemaining
    ? hourlyRemaining
    : concurrentRemaining;
}
