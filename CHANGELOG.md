# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Ingest new entities
  - `jenkins_account`
  - `jenkins_build`
  - `jenkins_job`
  - `jenkins_repository`
  - `jenkins_role`
  - `jenkins_user`
- Build new relationships
  - `jenkins_account_has_job`
  - `jenkins_account_has_role`
  - `jenkins_account_has_user`
  - `jenkins_build_has_repository`
  - `jenkins_job_has_build`
  - `jenkins_job_has_job`
  - `jenkins_user_assigned_role`
  - `jenkins_user_has_build`
