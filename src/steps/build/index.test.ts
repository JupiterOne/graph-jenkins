// import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
// import { buildStepTestConfigForStep } from '../../../test/config';
// import { Recording, setupProjectRecording } from '../../../test/recording';
// import { Steps } from '../constants';

// See test/README.md for details
// let recording: Recording;
// afterEach(async () => {
//   await recording.stop();
// });

test('fetch-builds', async () => {
  // Commented because we want to keep build step disabled for now
  // recording = setupProjectRecording({
  //   directory: __dirname,
  //   name: 'fetch-builds',
  // });
  // const stepConfig = buildStepTestConfigForStep(Steps.BUILD);
  // const stepResult = await executeStepWithDependencies(stepConfig);
  // expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-user-and-build-relationships', async () => {
  // Commented because we want to keep build step disabled for now
  // recording = setupProjectRecording({
  //   directory: __dirname,
  //   name: 'build-user-and-build-relationships',
  // });
  // const stepConfig = buildStepTestConfigForStep(
  //   Steps.BUILD_USER_BUILD_RELATIONSHIPS,
  // );
  // const stepResult = await executeStepWithDependencies(stepConfig);
  // expect(stepResult).toMatchStepMetadata(stepConfig);
});
