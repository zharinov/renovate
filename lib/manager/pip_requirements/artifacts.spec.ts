import _fs from 'fs-extra';
import { setAdminConfig } from '../../config/admin';
import type { UpdateArtifactsConfig } from '../types';
import { updateArtifacts } from './artifacts';

const fs: jest.Mocked<typeof _fs> = _fs as any;

jest.mock('fs-extra');
jest.mock('child_process');
jest.mock('../../util/exec');

const config: UpdateArtifactsConfig = {};

const newPackageFileContent = `atomicwrites==1.4.0 \
--hash=sha256:03472c30eb2c5d1ba9227e4c2ca66ab8287fbfbbda3888aa93dc2e28fc6811b4 \
--hash=sha256:75a9445bac02d8d058d5e1fe689654ba5a6556a1dfd8ce6ec55a0ed79866cfa6`;

describe('manager/pip_requirements/artifacts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    setAdminConfig({ localDir: '' });
  });
  it('returns null if no updatedDeps were provided', async () => {
    expect(
      await updateArtifacts({
        packageFileName: 'requirements.txt',
        updatedDeps: [],
        newPackageFileContent,
        config,
      })
    ).toBeNull();
  });
  it('returns null if no hashes', async () => {
    fs.readFile.mockResolvedValueOnce('eventlet==0.30.2\npbr>=1.9\n' as any);
    expect(
      await updateArtifacts({
        packageFileName: 'requirements.txt',
        updatedDeps: [{ depName: 'eventlet' }],
        newPackageFileContent,
        config,
      })
    ).toBeNull();
  });
  it('returns null if unchanged', async () => {
    fs.readFile.mockResolvedValueOnce(newPackageFileContent as any);
    expect(
      await updateArtifacts({
        packageFileName: 'requirements.txt',
        updatedDeps: [{ depName: 'atomicwrites' }],
        newPackageFileContent,
        config,
      })
    ).toBeNull();
  });
  it('returns updated file', async () => {
    fs.readFile.mockResolvedValueOnce('new content' as any);
    expect(
      await updateArtifacts({
        packageFileName: 'requirements.txt',
        updatedDeps: [{ depName: 'atomicwrites' }],
        newPackageFileContent,
        config,
      })
    ).toHaveLength(1);
  });
  it('catches and returns errors', async () => {
    fs.readFile.mockResolvedValueOnce('new content' as any);
    expect(
      await updateArtifacts({
        packageFileName: null,
        updatedDeps: [{ depName: 'atomicwrites' }],
        newPackageFileContent,
        config,
      })
    ).toHaveLength(1);
  });
});
