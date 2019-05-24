# api-tester

This project aims to provide a simple but flexible tool for testing REST api's.

It's a React app (using Ionic, Redux and Typescript) which allows the user to select and run "test scenario's".
These "test scenarios" are defined using JSON files, which are stored under the 'public/data' folder.

Right now it's "GUI only", but I'm planning to make a version that can be run as a "CLI" tool (command line).

## Overview

The basic structure of the tool is as follows:

* At the top level there are 'Scenarios'
* A scenario contains one or more 'Steps'
* Each 'Step' executes an 'operation'

Scenarios and Steps are defined in JSON files, and operations are coded in Javascript (Typescript) in `lib\operations.ts`. This allows a lot of flexibility, for instance an operation that does not exist yet in your actual API could be coded as a "stub" (dummy operation) within `lib\operations.ts`; this will work as long as you return the results in the expected 'standard' way (using the "Result" object).

The tool also allows defining "variables", so that the input data can be set flexibly, and the output of one step can be used as input for the next step. A few example JSON files are provided (under public/data) which show how to do this, and how to use the other features of the tool. Use any plain text editor (or your favorite IDE) to modify these files (add or remove scenarios steps. etcetera).

**Note:**

To add a scenario, first edit `public\data\scenarios.json`, then add a separate JSON file for the scenario under
`public\data\scenarios`. The "public" folder also demonstrates the case of a scenario which has an entry in `public\data\scenarios.json` but does not have a JSON file under  `public\data\scenarios` - if you try to run this scenario tou will see an error message (which is expected).

After editing the JSON files you can click the "reload" or "reload all" buttons in the UI to reload the new definitions.

**Note:**

In the UI you will see that a scenario can be "started" any number of times, so you can have more than one 'session' for a single 'scenario'. This allows you to run a scenario two times and then to compare the results. Click the 'close' button to "close" a session and remove it from the list, or click "Scenarios" in the menu to (re)run a scenario (it will be added to the 'sessions' list).

## About

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
See details there.

## Getting started

To install the app, issue the following commands:

```
git clone https://github.com/leob/api-tester
cd api-tester

# Create the .env files - copy the example files and edit them to suit your needs:
cp env.example .env
cp env.development.example .env.development

# In the following step you may alteratively use `npm install`:
yarn
# In the following step you may alteratively use `npm run start`:
yarn start
```

The app opens in the browser (normally at http://localhost:3000)

"Production build": run `yarn build` or `npm run build`.

This builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Roadmap/future plans

The tool can be improved and extended in many ways, some features that come to mind:

* Add a 'branching' fearure: depending on the result of a step (for instance, success or failure) allow selecting the next step to execute
* Make the tool usable as a "CLI" tool (from the command line, instead of only via the GUI)
* Add the ability to enter the values for scenario variables via form fields in the GUI
* Add some 'statistics' to the tool (e.g. record the begin/end time or duration of each step and of the full scenario)
* GUI: add the ability to view the scenario configuration and the 'statistics' (see previous bullet point)
* GUI: add the ability to download the results after running a scenario

