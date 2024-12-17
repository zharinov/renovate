import { emptyParser } from './base/empty-parser';
import type { InferParserResult } from './base/types';
import { AbortOnErrorField } from './options/abortOnError';
import { AdditionalBranchPrefixField } from './options/additionalBranchPrefix';
import { AllowCustomCrateRegistriesField } from './options/allowCustomCrateRegistries';
import { AllowPluginsField } from './options/allowPlugins';
import { AllowPostUpgradeCommandTemplatingField } from './options/allowPostUpgradeCommandTemplating';
import { AllowScriptsField } from './options/allowScripts';
import { AllowedVersionsField } from './options/allowedVersions';
import { AssignAutomergeField } from './options/assignAutomerge';
import { AssigneesFromCodeOwnersField } from './options/assigneesFromCodeOwners';
import { AssigneesSampleSizeField } from './options/assigneesSampleSize';
import { AuthTypeField } from './options/authType';
import { AutoApproveField } from './options/autoApprove';
import { AutoReplaceGlobalMatchField } from './options/autoReplaceGlobalMatch';
import { AutoReplaceStringTemplateField } from './options/autoReplaceStringTemplate';
import { AutodiscoverField } from './options/autodiscover';
import { AutodiscoverRepoOrderField } from './options/autodiscoverRepoOrder';
import { AutodiscoverRepoSortField } from './options/autodiscoverRepoSort';
import { AutomergeField } from './options/automerge';
import { AutomergeCommentField } from './options/automergeComment';
import { AutomergeStrategyField } from './options/automergeStrategy';
import { AutomergeTypeField } from './options/automergeType';
import { AzureWorkItemIdField } from './options/azureWorkItemId';
import { BaseDirField } from './options/baseDir';
import { BbAutoResolvePrTasksField } from './options/bbAutoResolvePrTasks';
import { BbUseDefaultReviewersField } from './options/bbUseDefaultReviewers';
import { BbUseDevelopmentBranchField } from './options/bbUseDevelopmentBranch';
import { BinarySourceField } from './options/binarySource';
import { BranchConcurrentLimitField } from './options/branchConcurrentLimit';
import { BranchNameField } from './options/branchName';
import { BranchNameStrictField } from './options/branchNameStrict';
import { BranchPrefixField } from './options/branchPrefix';
import { BranchPrefixOldField } from './options/branchPrefixOld';
import { BranchTopicField } from './options/branchTopic';
import { BumpVersionField } from './options/bumpVersion';
import { CacheDirField } from './options/cacheDir';
import { CacheHardTtlMinutesField } from './options/cacheHardTtlMinutes';
import { CachePrivatePackagesField } from './options/cachePrivatePackages';
import { ChangelogUrlField } from './options/changelogUrl';
import { CloneSubmodulesField } from './options/cloneSubmodules';
import { CommitBodyField } from './options/commitBody';
import { CommitBodyTableField } from './options/commitBodyTable';
import { CommitMessageField } from './options/commitMessage';
import { CommitMessageActionField } from './options/commitMessageAction';
import { CommitMessageExtraField } from './options/commitMessageExtra';
import { CommitMessageLowerCaseField } from './options/commitMessageLowerCase';
import { CommitMessagePrefixField } from './options/commitMessagePrefix';
import { CommitMessageSuffixField } from './options/commitMessageSuffix';
import { CommitMessageTopicField } from './options/commitMessageTopic';
import { ConcurrentRequestLimitField } from './options/concurrentRequestLimit';
import { ConfidentialField } from './options/confidential';
import { ConfigMigrationField } from './options/configMigration';
import { ConfigWarningReuseIssueField } from './options/configWarningReuseIssue';
import { ConstraintsFilteringField } from './options/constraintsFiltering';
import { ContainerbaseDirField } from './options/containerbaseDir';
import { CurrentValueTemplateField } from './options/currentValueTemplate';
import { CustomTypeField } from './options/customType';
import { DatasourceTemplateField } from './options/datasourceTemplate';
import { DefaultRegistryUrlTemplateField } from './options/defaultRegistryUrlTemplate';
import { DeleteConfigFileField } from './options/deleteConfigFile';
import { DepNameTemplateField } from './options/depNameTemplate';
import { DepTypeTemplateField } from './options/depTypeTemplate';
import { DependencyDashboardField } from './options/dependencyDashboard';
import { DependencyDashboardApprovalField } from './options/dependencyDashboardApproval';
import { DependencyDashboardAutocloseField } from './options/dependencyDashboardAutoclose';
import { DependencyDashboardFooterField } from './options/dependencyDashboardFooter';
import { DependencyDashboardHeaderField } from './options/dependencyDashboardHeader';
import { DependencyDashboardOSVVulnerabilitySummaryField } from './options/dependencyDashboardOSVVulnerabilitySummary';
import { DependencyDashboardTitleField } from './options/dependencyDashboardTitle';
import { DetectGlobalManagerConfigField } from './options/detectGlobalManagerConfig';
import { DetectHostRulesFromEnvField } from './options/detectHostRulesFromEnv';
import { DnsCacheField } from './options/dnsCache';
import { DockerChildPrefixField } from './options/dockerChildPrefix';
import { DockerCliOptionsField } from './options/dockerCliOptions';
import { DockerMaxPagesField } from './options/dockerMaxPages';
import { DockerSidecarImageField } from './options/dockerSidecarImage';
import { DockerUserField } from './options/dockerUser';
import { DraftPRField } from './options/draftPR';
import { DryRunField } from './options/dryRun';
import { EnableHttp2Field } from './options/enableHttp2';
import { EnabledField } from './options/enabled';
import { EncryptedWarningField } from './options/encryptedWarning';
import { EndpointField } from './options/endpoint';
import { ExecutionModeField } from './options/executionMode';
import { ExecutionTimeoutField } from './options/executionTimeout';
import { ExpandCodeOwnersGroupsField } from './options/expandCodeOwnersGroups';
import { ExposeAllEnvField } from './options/exposeAllEnv';
import { ExtractVersionField } from './options/extractVersion';
import { ExtractVersionTemplateField } from './options/extractVersionTemplate';
import { FetchChangeLogsField } from './options/fetchChangeLogs';
import { FilterUnavailableUsersField } from './options/filterUnavailableUsers';
import { FollowTagField } from './options/followTag';
import { ForceCliField } from './options/forceCli';
import { ForkCreationField } from './options/forkCreation';
import { ForkModeDisallowMaintainerEditsField } from './options/forkModeDisallowMaintainerEdits';
import { ForkOrgField } from './options/forkOrg';
import { ForkProcessingField } from './options/forkProcessing';
import { ForkTokenField } from './options/forkToken';
import { FormatField } from './options/format';
import { GitAuthorField } from './options/gitAuthor';
import { GitLabIgnoreApprovalsField } from './options/gitLabIgnoreApprovals';
import { GitPrivateKeyField } from './options/gitPrivateKey';
import { GitTimeoutField } from './options/gitTimeout';
import { GitUrlField } from './options/gitUrl';
import { GithubTokenWarnField } from './options/githubTokenWarn';
import { GroupNameField } from './options/groupName';
import { GroupSlugField } from './options/groupSlug';
import { HashedBranchLengthField } from './options/hashedBranchLength';
import { HostTypeField } from './options/hostType';
import { HttpCacheTtlDaysField } from './options/httpCacheTtlDays';
import { HttpsCertificateField } from './options/httpsCertificate';
import { HttpsCertificateAuthorityField } from './options/httpsCertificateAuthority';
import { HttpsPrivateKeyField } from './options/httpsPrivateKey';
import { IgnoreDeprecatedField } from './options/ignoreDeprecated';
import { IgnorePluginsField } from './options/ignorePlugins';
import { IgnorePrAuthorField } from './options/ignorePrAuthor';
import { IgnoreScriptsField } from './options/ignoreScripts';
import { IgnoreTestsField } from './options/ignoreTests';
import { IgnoreUnstableField } from './options/ignoreUnstable';
import { IncludeMirrorsField } from './options/includeMirrors';
import { InheritConfigField } from './options/inheritConfig';
import { InheritConfigFileNameField } from './options/inheritConfigFileName';
import { InheritConfigRepoNameField } from './options/inheritConfigRepoName';
import { InheritConfigStrictField } from './options/inheritConfigStrict';
import { InsecureRegistryField } from './options/insecureRegistry';
import { InternalChecksAsSuccessField } from './options/internalChecksAsSuccess';
import { InternalChecksFilterField } from './options/internalChecksFilter';
import { KeepAliveField } from './options/keepAlive';
import { KeepUpdatedLabelField } from './options/keepUpdatedLabel';
import { LogContextField } from './options/logContext';
import { MatchCurrentAgeField } from './options/matchCurrentAge';
import { MatchCurrentValueField } from './options/matchCurrentValue';
import { MatchCurrentVersionField } from './options/matchCurrentVersion';
import { MatchHostField } from './options/matchHost';
import { MatchMessageField } from './options/matchMessage';
import { MatchNewValueField } from './options/matchNewValue';
import { MatchStringsStrategyField } from './options/matchStringsStrategy';
import { MaxRequestsPerSecondField } from './options/maxRequestsPerSecond';
import { MaxRetryAfterField } from './options/maxRetryAfter';
import { MergeConfidenceEndpointField } from './options/mergeConfidenceEndpoint';
import { MilestoneField } from './options/milestone';
import { MinimumReleaseAgeField } from './options/minimumReleaseAge';
import { ModeField } from './options/mode';
import { NewLogLevelField } from './options/newLogLevel';
import { NpmTokenField } from './options/npmToken';
import { NpmrcField } from './options/npmrc';
import { NpmrcMergeField } from './options/npmrcMerge';
import { OnboardingField } from './options/onboarding';
import { OnboardingBranchField } from './options/onboardingBranch';
import { OnboardingCommitMessageField } from './options/onboardingCommitMessage';
import { OnboardingConfigFileNameField } from './options/onboardingConfigFileName';
import { OnboardingNoDepsField } from './options/onboardingNoDeps';
import { OnboardingPrTitleField } from './options/onboardingPrTitle';
import { OnboardingRebaseCheckboxField } from './options/onboardingRebaseCheckbox';
import { OptimizeForDisabledField } from './options/optimizeForDisabled';
import { OsvVulnerabilityAlertsField } from './options/osvVulnerabilityAlerts';
import { OverrideDatasourceField } from './options/overrideDatasource';
import { OverrideDepNameField } from './options/overrideDepName';
import { OverridePackageNameField } from './options/overridePackageName';
import { PackageNameTemplateField } from './options/packageNameTemplate';
import { PasswordField } from './options/password';
import { PersistRepoDataField } from './options/persistRepoData';
import { PinDigestsField } from './options/pinDigests';
import { PlatformField } from './options/platform';
import { PlatformAutomergeField } from './options/platformAutomerge';
import { PlatformCommitField } from './options/platformCommit';
import { PrBodyTemplateField } from './options/prBodyTemplate';
import { PrCommitsPerRunLimitField } from './options/prCommitsPerRunLimit';
import { PrConcurrentLimitField } from './options/prConcurrentLimit';
import { PrCreationField } from './options/prCreation';
import { PrFooterField } from './options/prFooter';
import { PrHeaderField } from './options/prHeader';
import { PrHourlyLimitField } from './options/prHourlyLimit';
import { PrNotPendingHoursField } from './options/prNotPendingHours';
import { PrPriorityField } from './options/prPriority';
import { PrTitleField } from './options/prTitle';
import { PrTitleStrictField } from './options/prTitleStrict';
import { PresetCachePersistenceField } from './options/presetCachePersistence';
import { PrintConfigField } from './options/printConfig';
import { PrivateKeyField } from './options/privateKey';
import { PrivateKeyOldField } from './options/privateKeyOld';
import { PrivateKeyPathField } from './options/privateKeyPath';
import { PrivateKeyPathOldField } from './options/privateKeyPathOld';
import { PruneBranchAfterAutomergeField } from './options/pruneBranchAfterAutomerge';
import { PruneStaleBranchesField } from './options/pruneStaleBranches';
import { RangeStrategyField } from './options/rangeStrategy';
import { ReadOnlyField } from './options/readOnly';
import { RebaseLabelField } from './options/rebaseLabel';
import { RebaseWhenField } from './options/rebaseWhen';
import { RecreateWhenField } from './options/recreateWhen';
import { RedisPrefixField } from './options/redisPrefix';
import { RedisUrlField } from './options/redisUrl';
import { RegistryUrlTemplateField } from './options/registryUrlTemplate';
import { ReplacementNameField } from './options/replacementName';
import { ReplacementNameTemplateField } from './options/replacementNameTemplate';
import { ReplacementVersionField } from './options/replacementVersion';
import { ReportPathField } from './options/reportPath';
import { ReportTypeField } from './options/reportType';
import { RepositoryCacheField } from './options/repositoryCache';
import { RepositoryCacheTypeField } from './options/repositoryCacheType';
import { RequireConfigField } from './options/requireConfig';
import { RespectLatestField } from './options/respectLatest';
import { ReviewersFromCodeOwnersField } from './options/reviewersFromCodeOwners';
import { ReviewersSampleSizeField } from './options/reviewersSampleSize';
import { RollbackPrsField } from './options/rollbackPrs';
import { S3EndpointField } from './options/s3Endpoint';
import { S3PathStyleField } from './options/s3PathStyle';
import { SemanticCommitScopeField } from './options/semanticCommitScope';
import { SemanticCommitTypeField } from './options/semanticCommitType';
import { SemanticCommitsField } from './options/semanticCommits';
import { SeparateMajorMinorField } from './options/separateMajorMinor';
import { SeparateMinorPatchField } from './options/separateMinorPatch';
import { SeparateMultipleMajorField } from './options/separateMultipleMajor';
import { SeparateMultipleMinorField } from './options/separateMultipleMinor';
import { SkipInstallsField } from './options/skipInstalls';
import { SourceDirectoryField } from './options/sourceDirectory';
import { SourceUrlField } from './options/sourceUrl';
import { StopUpdatingLabelField } from './options/stopUpdatingLabel';
import { TimeoutField } from './options/timeout';
import { TimezoneField } from './options/timezone';
import { TokenField } from './options/token';
import { UnicodeEmojiField } from './options/unicodeEmoji';
import { UpdateInternalDepsField } from './options/updateInternalDeps';
import { UpdateLockFilesField } from './options/updateLockFiles';
import { UpdateNotScheduledField } from './options/updateNotScheduled';
import { UpdatePinnedDependenciesField } from './options/updatePinnedDependencies';
import { UseBaseBranchConfigField } from './options/useBaseBranchConfig';
import { UseCloudMetadataServicesField } from './options/useCloudMetadataServices';
import { UserAgentField } from './options/userAgent';
import { UsernameField } from './options/username';
import { VersionCompatibilityField } from './options/versionCompatibility';
import { VersioningField } from './options/versioning';
import { VersioningTemplateField } from './options/versioningTemplate';
import { VulnerabilityFixStrategyField } from './options/vulnerabilityFixStrategy';
import { WriteDiscoveredReposField } from './options/writeDiscoveredRepos';

export const parser = emptyParser()
  .pipe(AbortOnErrorField)
  .pipe(AdditionalBranchPrefixField)
  .pipe(AllowCustomCrateRegistriesField)
  .pipe(AllowPluginsField)
  .pipe(AllowPostUpgradeCommandTemplatingField)
  .pipe(AllowScriptsField)
  .pipe(AllowedVersionsField)
  .pipe(AssignAutomergeField)
  .pipe(AssigneesFromCodeOwnersField)
  .pipe(AssigneesSampleSizeField)
  .pipe(AuthTypeField)
  .pipe(AutoApproveField)
  .pipe(AutoReplaceGlobalMatchField)
  .pipe(AutoReplaceStringTemplateField)
  .pipe(AutodiscoverField)
  .pipe(AutodiscoverRepoOrderField)
  .pipe(AutodiscoverRepoSortField)
  .pipe(AutomergeField)
  .pipe(AutomergeCommentField)
  .pipe(AutomergeStrategyField)
  .pipe(AutomergeTypeField)
  .pipe(AzureWorkItemIdField)
  .pipe(BaseDirField)
  .pipe(BbAutoResolvePrTasksField)
  .pipe(BbUseDefaultReviewersField)
  .pipe(BbUseDevelopmentBranchField)
  .pipe(BinarySourceField)
  .pipe(BranchConcurrentLimitField)
  .pipe(BranchNameField)
  .pipe(BranchNameStrictField)
  .pipe(BranchPrefixField)
  .pipe(BranchPrefixOldField)
  .pipe(BranchTopicField)
  .pipe(BumpVersionField)
  .pipe(CacheDirField)
  .pipe(CacheHardTtlMinutesField)
  .pipe(CachePrivatePackagesField)
  .pipe(ChangelogUrlField)
  .pipe(CloneSubmodulesField)
  .pipe(CommitBodyField)
  .pipe(CommitBodyTableField)
  .pipe(CommitMessageField)
  .pipe(CommitMessageActionField)
  .pipe(CommitMessageExtraField)
  .pipe(CommitMessageLowerCaseField)
  .pipe(CommitMessagePrefixField)
  .pipe(CommitMessageSuffixField)
  .pipe(CommitMessageTopicField)
  .pipe(ConcurrentRequestLimitField)
  .pipe(ConfidentialField)
  .pipe(ConfigMigrationField)
  .pipe(ConfigWarningReuseIssueField)
  .pipe(ConstraintsFilteringField)
  .pipe(ContainerbaseDirField)
  .pipe(CurrentValueTemplateField)
  .pipe(CustomTypeField)
  .pipe(DatasourceTemplateField)
  .pipe(DefaultRegistryUrlTemplateField)
  .pipe(DeleteConfigFileField)
  .pipe(DepNameTemplateField)
  .pipe(DepTypeTemplateField)
  .pipe(DependencyDashboardField)
  .pipe(DependencyDashboardApprovalField)
  .pipe(DependencyDashboardAutocloseField)
  .pipe(DependencyDashboardFooterField)
  .pipe(DependencyDashboardHeaderField)
  .pipe(DependencyDashboardOSVVulnerabilitySummaryField)
  .pipe(DependencyDashboardTitleField)
  .pipe(DetectGlobalManagerConfigField)
  .pipe(DetectHostRulesFromEnvField)
  .pipe(DnsCacheField)
  .pipe(DockerChildPrefixField)
  .pipe(DockerCliOptionsField)
  .pipe(DockerMaxPagesField)
  .pipe(DockerSidecarImageField)
  .pipe(DockerUserField)
  .pipe(DraftPRField)
  .pipe(DryRunField)
  .pipe(EnableHttp2Field)
  .pipe(EnabledField)
  .pipe(EncryptedWarningField)
  .pipe(EndpointField)
  .pipe(ExecutionModeField)
  .pipe(ExecutionTimeoutField)
  .pipe(ExpandCodeOwnersGroupsField)
  .pipe(ExposeAllEnvField)
  .pipe(ExtractVersionField)
  .pipe(ExtractVersionTemplateField)
  .pipe(FetchChangeLogsField)
  .pipe(FilterUnavailableUsersField)
  .pipe(FollowTagField)
  .pipe(ForceCliField)
  .pipe(ForkCreationField)
  .pipe(ForkModeDisallowMaintainerEditsField)
  .pipe(ForkOrgField)
  .pipe(ForkProcessingField)
  .pipe(ForkTokenField)
  .pipe(FormatField)
  .pipe(GitAuthorField)
  .pipe(GitLabIgnoreApprovalsField)
  .pipe(GitPrivateKeyField)
  .pipe(GitTimeoutField)
  .pipe(GitUrlField)
  .pipe(GithubTokenWarnField)
  .pipe(GroupNameField)
  .pipe(GroupSlugField)
  .pipe(HashedBranchLengthField)
  .pipe(HostTypeField)
  .pipe(HttpCacheTtlDaysField)
  .pipe(HttpsCertificateField)
  .pipe(HttpsCertificateAuthorityField)
  .pipe(HttpsPrivateKeyField)
  .pipe(IgnoreDeprecatedField)
  .pipe(IgnorePluginsField)
  .pipe(IgnorePrAuthorField)
  .pipe(IgnoreScriptsField)
  .pipe(IgnoreTestsField)
  .pipe(IgnoreUnstableField)
  .pipe(IncludeMirrorsField)
  .pipe(InheritConfigField)
  .pipe(InheritConfigFileNameField)
  .pipe(InheritConfigRepoNameField)
  .pipe(InheritConfigStrictField)
  .pipe(InsecureRegistryField)
  .pipe(InternalChecksAsSuccessField)
  .pipe(InternalChecksFilterField)
  .pipe(KeepAliveField)
  .pipe(KeepUpdatedLabelField)
  .pipe(LogContextField)
  .pipe(MatchCurrentAgeField)
  .pipe(MatchCurrentValueField)
  .pipe(MatchCurrentVersionField)
  .pipe(MatchHostField)
  .pipe(MatchMessageField)
  .pipe(MatchNewValueField)
  .pipe(MatchStringsStrategyField)
  .pipe(MaxRequestsPerSecondField)
  .pipe(MaxRetryAfterField)
  .pipe(MergeConfidenceEndpointField)
  .pipe(MilestoneField)
  .pipe(MinimumReleaseAgeField)
  .pipe(ModeField)
  .pipe(NewLogLevelField)
  .pipe(NpmTokenField)
  .pipe(NpmrcField)
  .pipe(NpmrcMergeField)
  .pipe(OnboardingField)
  .pipe(OnboardingBranchField)
  .pipe(OnboardingCommitMessageField)
  .pipe(OnboardingConfigFileNameField)
  .pipe(OnboardingNoDepsField)
  .pipe(OnboardingPrTitleField)
  .pipe(OnboardingRebaseCheckboxField)
  .pipe(OptimizeForDisabledField)
  .pipe(OsvVulnerabilityAlertsField)
  .pipe(OverrideDatasourceField)
  .pipe(OverrideDepNameField)
  .pipe(OverridePackageNameField)
  .pipe(PackageNameTemplateField)
  .pipe(PasswordField)
  .pipe(PersistRepoDataField)
  .pipe(PinDigestsField)
  .pipe(PlatformField)
  .pipe(PlatformAutomergeField)
  .pipe(PlatformCommitField)
  .pipe(PrBodyTemplateField)
  .pipe(PrCommitsPerRunLimitField)
  .pipe(PrConcurrentLimitField)
  .pipe(PrCreationField)
  .pipe(PrFooterField)
  .pipe(PrHeaderField)
  .pipe(PrHourlyLimitField)
  .pipe(PrNotPendingHoursField)
  .pipe(PrPriorityField)
  .pipe(PrTitleField)
  .pipe(PrTitleStrictField)
  .pipe(PresetCachePersistenceField)
  .pipe(PrintConfigField)
  .pipe(PrivateKeyField)
  .pipe(PrivateKeyOldField)
  .pipe(PrivateKeyPathField)
  .pipe(PrivateKeyPathOldField)
  .pipe(PruneBranchAfterAutomergeField)
  .pipe(PruneStaleBranchesField)
  .pipe(RangeStrategyField)
  .pipe(ReadOnlyField)
  .pipe(RebaseLabelField)
  .pipe(RebaseWhenField)
  .pipe(RecreateWhenField)
  .pipe(RedisPrefixField)
  .pipe(RedisUrlField)
  .pipe(RegistryUrlTemplateField)
  .pipe(ReplacementNameField)
  .pipe(ReplacementNameTemplateField)
  .pipe(ReplacementVersionField)
  .pipe(ReportPathField)
  .pipe(ReportTypeField)
  .pipe(RepositoryCacheField)
  .pipe(RepositoryCacheTypeField)
  .pipe(RequireConfigField)
  .pipe(RespectLatestField)
  .pipe(ReviewersFromCodeOwnersField)
  .pipe(ReviewersSampleSizeField)
  .pipe(RollbackPrsField)
  .pipe(S3EndpointField)
  .pipe(S3PathStyleField)
  .pipe(SemanticCommitScopeField)
  .pipe(SemanticCommitTypeField)
  .pipe(SemanticCommitsField)
  .pipe(SeparateMajorMinorField)
  .pipe(SeparateMinorPatchField)
  .pipe(SeparateMultipleMajorField)
  .pipe(SeparateMultipleMinorField)
  .pipe(SkipInstallsField)
  .pipe(SourceDirectoryField)
  .pipe(SourceUrlField)
  .pipe(StopUpdatingLabelField)
  .pipe(TimeoutField)
  .pipe(TimezoneField)
  .pipe(TokenField)
  .pipe(UnicodeEmojiField)
  .pipe(UpdateInternalDepsField)
  .pipe(UpdateLockFilesField)
  .pipe(UpdateNotScheduledField)
  .pipe(UpdatePinnedDependenciesField)
  .pipe(UseBaseBranchConfigField)
  .pipe(UseCloudMetadataServicesField)
  .pipe(UserAgentField)
  .pipe(UsernameField)
  .pipe(VersionCompatibilityField)
  .pipe(VersioningField)
  .pipe(VersioningTemplateField)
  .pipe(VulnerabilityFixStrategyField)
  .pipe(WriteDiscoveredReposField);

export type ParserResultType = InferParserResult<typeof parser>;
