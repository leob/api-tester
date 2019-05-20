import operations from './operations';
import { Result } from './operations';

import { Scenario, ScenarioStep, ScenarioStepResult } from './types';

export async function executeScenario(scenario: Scenario): Promise<ScenarioStepResult[]> {
  let step: ScenarioStep;
  let results: ScenarioStepResult[] = [];

  for (step of scenario.steps) {
    let result = await executeScenarioStep(step);

    results.push(result);
  }

  return results;
}

async function executeScenarioStep(scenarioStep: ScenarioStep): Promise<ScenarioStepResult> {
  const name = scenarioStep.operation || scenarioStep.name;
  const operation = operations[name];
  let stepResult: ScenarioStepResult;

  if (!operation) {

    stepResult = {
      stepName: scenarioStep.name,
      isError: true,
      message: "Operation not defined"
    }

  } else {
    const result: Result = await operation();

    stepResult = {
      stepName: scenarioStep.name,
      isError: result.isError
    }

    if (result.isError) {
      stepResult.message = result.message;
    } else {
      stepResult.data = result.data;
      stepResult.status = result.status;
    }
  }

  return stepResult;
}
