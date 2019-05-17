import operations from './operations';
import { Result } from './operations';

import { ScenarioStep, ScenarioStepResult } from './types';

export async function executeScenario(steps: ScenarioStep[]): Promise<ScenarioStepResult[]> {
  let step: ScenarioStep;
  let results: ScenarioStepResult[] = [];

  for (step of steps) {
    let result = await executeScenarioStep(step);

    results.push(result);
  }

  return results;
}

async function executeScenarioStep(scenarioStep: ScenarioStep): Promise<ScenarioStepResult> {
  const name = scenarioStep.operation;
  const operation = operations[name];
  let stepResult: ScenarioStepResult;

  if (!operation) {

    stepResult = {
      stepName: scenarioStep.name,
      isError: true,
      error: "Operation not defined"
    }

  } else {
    const result: Result = await operation();

    stepResult = {
      stepName: scenarioStep.name,
      isError: result.isError
    }

    if (result.isError) {
      stepResult.error = result.error.message;
    } else {
      stepResult.data = result.data;
      stepResult.status = result.status;
    }
  }

  return stepResult;
}
