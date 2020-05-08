# jest-knobs

## Usage

First, install `jest-knobs` with npm:

```sh
npm i -D jest-knobs
``` 

In order to install the mocks, import `jest-knobs` into your Jest setup file or include `jest-knobs` itself as a setup
file in your [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array)

```js
module.exports = {
  setupFilesAfterEnv: ["jest-knobs"]
};
```

In your tests, you can import `jest-knobs` and call `mockKnobValues` to change the knob values for a single test.

```js 
import knobs from "jest-knobs";

knobs.mockKnobValues({
  "knob name": "value"
});

// render the story after mocking the knob values
render(someStoryWithKnobs())
```
