import { AdoptiumJavaDatasource } from './adoptium-java';
import { ArtifactoryDatasource } from './artifactory';
import { AwsMachineImageDataSource } from './aws-machine-image';
import { BitBucketTagsDatasource } from './bitbucket-tags';
import { CdnJsDatasource } from './cdnjs';
import { ClojureDatasource } from './clojure';
import { ConanDatasource } from './conan';
import { CrateDatasource } from './crate';
import { DartDatasource } from './dart';
import * as docker from './docker';
import { GalaxyDatasource } from './galaxy';
import { GalaxyCollectionDatasource } from './galaxy-collection';
import { GitRefsDatasource } from './git-refs';
import { GitTagsDatasource } from './git-tags';
import * as githubReleases from './github-releases';
import * as githubTags from './github-tags';
import { GitlabPackagesDatasource } from './gitlab-packages';
import { GitlabReleasesDatasource } from './gitlab-releases';
import { GitlabTagsDatasource } from './gitlab-tags';
import { GoDatasource } from './go';
import { GolangVersionDatasource } from './golang-version';
import { GradleVersionDatasource } from './gradle-version';
import { HelmDatasource } from './helm';
import { HexDatasource } from './hex';
import { JenkinsPluginsDatasource } from './jenkins-plugins';
import * as maven from './maven';
import { NodeDatasource } from './node';
import * as npm from './npm';
import * as nuget from './nuget';
import { OrbDatasource } from './orb';
import { PackagistDatasource } from './packagist';
import { PodDatasource } from './pod';
import { PypiDatasource } from './pypi';
import { RepologyDatasource } from './repology';
import { RubyVersionDatasource } from './ruby-version';
import { RubyGemsDatasource } from './rubygems';
import * as sbtPackage from './sbt-package';
import * as sbtPlugin from './sbt-plugin';
import { TerraformModuleDatasource } from './terraform-module';
import { TerraformProviderDatasource } from './terraform-provider';
import type { DatasourceApi } from './types';

const api = new Map<string, DatasourceApi>();
export default api;

api.set(AdoptiumJavaDatasource.id, new AdoptiumJavaDatasource());
api.set(ArtifactoryDatasource.id, new ArtifactoryDatasource());
api.set(AwsMachineImageDataSource.id, new AwsMachineImageDataSource());
api.set(BitBucketTagsDatasource.id, new BitBucketTagsDatasource());
api.set(CdnJsDatasource.id, new CdnJsDatasource());
api.set(ClojureDatasource.id, new ClojureDatasource());
api.set(ConanDatasource.id, new ConanDatasource());
api.set(CrateDatasource.id, new CrateDatasource());
api.set(DartDatasource.id, new DartDatasource());
api.set('docker', docker);
api.set(GalaxyDatasource.id, new GalaxyDatasource());
api.set(GalaxyCollectionDatasource.id, new GalaxyCollectionDatasource());
api.set(GitRefsDatasource.id, new GitRefsDatasource());
api.set(GitTagsDatasource.id, new GitTagsDatasource());
api.set('github-releases', githubReleases);
api.set('github-tags', githubTags);
api.set(GitlabPackagesDatasource.id, new GitlabPackagesDatasource());
api.set(GitlabReleasesDatasource.id, new GitlabReleasesDatasource());
api.set(GitlabTagsDatasource.id, new GitlabTagsDatasource());
api.set(GoDatasource.id, new GoDatasource());
api.set(GolangVersionDatasource.id, new GolangVersionDatasource());
api.set(GradleVersionDatasource.id, new GradleVersionDatasource());
api.set(HelmDatasource.id, new HelmDatasource());
api.set(HexDatasource.id, new HexDatasource());
api.set(JenkinsPluginsDatasource.id, new JenkinsPluginsDatasource());
api.set('maven', maven);
api.set(NodeDatasource.id, new NodeDatasource());
api.set('npm', npm);
api.set('nuget', nuget);
api.set(OrbDatasource.id, new OrbDatasource());
api.set(PackagistDatasource.id, new PackagistDatasource());
api.set(PodDatasource.id, new PodDatasource());
api.set(PypiDatasource.id, new PypiDatasource());
api.set(RepologyDatasource.id, new RepologyDatasource());
api.set(RubyVersionDatasource.id, new RubyVersionDatasource());
api.set(RubyGemsDatasource.id, new RubyGemsDatasource());
api.set('sbt-package', sbtPackage);
api.set('sbt-plugin', sbtPlugin);
api.set(TerraformModuleDatasource.id, new TerraformModuleDatasource());
api.set(TerraformProviderDatasource.id, new TerraformProviderDatasource());
