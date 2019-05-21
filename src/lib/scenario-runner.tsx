import config from '../config';
import operations from './operations';
import { Result } from './operations';

import { Scenario, ScenarioStep, ScenarioStepResult } from './types';

const URL = config.API_URL;

export async function executeScenario(scenario: Scenario): Promise<ScenarioStepResult[]> {
  let step: ScenarioStep;
  let results: ScenarioStepResult[] = [];

  initScenario(scenario);

  for (step of scenario.steps) {
    let result = await executeScenarioStep(scenario, step);

    results.push(result);
  }

  return results;
}

function initScenario(scenario: Scenario) {
  const config = scenario.configuration || {};

  if (!config.url) {
    config.url = URL;
  }

  scenario.configuration = config;
}

function getStep(scenario: Scenario, step: ScenarioStep): ScenarioStep {
  // TODO
  return step;
}

async function executeScenarioStep(scenario: Scenario, scenarioStep: ScenarioStep): Promise<ScenarioStepResult> {
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
    const result: Result = await operation(scenario, getStep(scenario, scenarioStep));

    stepResult = {
      stepName: scenarioStep.name,
      input: scenarioStep.data,
      output: result.data,
      status: result.status,
      isError: result.isError,
      message: result.message
    };
  }

  return stepResult;
}
