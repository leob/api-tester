import config from '../config';

import operations from './operations';
import { Result } from './operations';

import util from './util';

import { Scenario, ScenarioStep, ScenarioStepResult } from './types';

const URL = config.API_URL;

export async function executeScenario(scenario: Scenario): Promise<ScenarioStepResult[]> {
  let step: ScenarioStep;
  let results: ScenarioStepResult[] = [];

  scenario = initScenario(scenario);

  let cancelledRun = false;

  for (step of scenario.steps) {
    let result: ScenarioStepResult;

    if (cancelledRun) {
      // run has been cancelled, fill the remaining step results with an "empty" dummy result
      result = {stepName: step.name, isError: false};

    } else {
      result = await executeScenarioStep(scenario, step);

      if (result.isError && scenario.configuration.stopOnError) {
        cancelledRun = true;
      }
    }

    results.push(result);
  }

  return results;
}

function initScenario(scenario: Scenario): Scenario {
  const config = scenario.configuration || {};
  scenario.configuration = config;

  if (!config.apiUrl) {
    config.apiUrl = URL;
  }

  scenario = initVars(scenario);

  return scenario;
}

function initVars(scenario: Scenario): Scenario {
  const vars = scenario.configuration.vars;

  if (!vars) {
    return scenario;
  }

  for (let name in vars) {
    vars[name] = initVar(vars[name]);
  }

  return scenario;
}

function initVar(v: any): any {

  if (v.func) {
    const funcName = v.func;

    if (util[funcName]) {
      const fn = util[funcName];

      try {
        // Overwrite the variable's value with the function's return value
        v = fn();

      } catch (e) {
        const error: Error = e;
        v.func = "EROR executing func '" + funcName + "': " + error.message;
      }

    } else {
      v.func = "UNKNOWN func '" + funcName + "'";
    }
  }

  // TODO other cases
// console.log('INITVAR V = ', v);

  return v;
}

function initStep(scenario: Scenario, step: ScenarioStep): ScenarioStep {

  if (step.data && scenario.configuration.vars) {
    replaceDataVariables(step.data, scenario.configuration.vars);
  }

  return step;
}

function replaceDataVariables(data: any, vars: any) {
  for (let name in data) {
    if (Object.prototype.toString.call(data[name]) === '[object Object]') {   // plain object: {}
      replaceDataVariables(data[name], vars);
    } else if (Object.prototype.toString.call(data[name]) === '[object String]') {
      data[name] = replaceDataVariable(data[name], vars);
    }
  }
}

function replaceDataVariable(v: string, vars: any): any {
  let counter = 0;

  while (v.match(/\$\{.*\}/)) {

    // we ue a counter for safety (to guard against an inifite loop)
    if (counter++ > 10) {   // something must be wrong
      break;
    }

    v = v.replace(/^(.*)(\$\{)(.*)(\})(.*)$/, function(match: string, ...groups: any[]): string {

      // skip groups 1 and 3
      const begin = groups[0];
      let variable = groups[2];
      const end = groups[4];

      if (vars[variable]) {
        variable = vars[variable];
      }

      return begin + variable + end;
    });
  }

  return v;
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
    const result: Result = await operation(scenario, initStep(scenario, scenarioStep));

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
