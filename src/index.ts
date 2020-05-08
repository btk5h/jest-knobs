import * as knobs from "@storybook/addon-knobs";
import { ButtonTypeOnClickProp } from "@storybook/addon-knobs/dist/components/types";

type KnobValues = {
  [knobName: string]: any;
};

class KnobMockingError extends Error {
  name = "KnobMockingError";
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

class KnobMocker {
  private knobValues: { [knob: string]: any } = {};
  private knobButtons: { [knob: string]: ButtonTypeOnClickProp } = {};
  private usedKnobs = new Set<string>();

  private checkForUnusedKnobs() {
    const unusedKnobs = Object.keys(this.knobValues).filter(
      knob => !this.usedKnobs.has(knob)
    );

    if (unusedKnobs.length > 0) {
      console.warn(
        `The following knobs were mocked but not used: ${unusedKnobs.join(
          ", "
        )}`
      );
    }
  }

  reset() {
    this.checkForUnusedKnobs();

    this.knobValues = {};
    this.knobButtons = {};
    this.usedKnobs.clear();
  }

  install() {
    jest.setMock("@storybook/addon-knobs", {
      withKnobs: (a: any) => a(),
      text: (...[name, defaultValue]: Parameters<typeof knobs.text>) =>
        this.getKnobValue(name, defaultValue),
      boolean: (...[name, defaultValue]: Parameters<typeof knobs.boolean>) =>
        this.getKnobValue(name, defaultValue),
      number: (...[name, defaultValue]: Parameters<typeof knobs.number>) =>
        this.getKnobValue(name, defaultValue),
      color: (...[name, defaultValue]: Parameters<typeof knobs.color>) =>
        this.getKnobValue(name, defaultValue),
      object: (...[name, defaultValue]: Parameters<typeof knobs.object>) =>
        this.getKnobValue(name, defaultValue),
      select: (...[_name, , _defaultValue]: Parameters<typeof knobs.select>) =>
        this.getKnobValue(_name, _defaultValue),
      radios: (...[name, , defaultValue]: Parameters<typeof knobs.radios>) =>
        this.getKnobValue(name, defaultValue),
      array: (...[name, defaultValue]: Parameters<typeof knobs.array>) =>
        this.getKnobValue(name, defaultValue),
      date: (...[name, defaultValue]: Parameters<typeof knobs.date>) =>
        this.getKnobValue(name, defaultValue),
      button: (...[name, callback]: Parameters<typeof knobs.button>) =>
        this.registerButton(name, callback),
      files: (...[name, , defaultValue]: Parameters<typeof knobs.files>) =>
        this.getKnobValue(name, defaultValue),
      optionsKnob: (
        ...[name, , defaultValue]: Parameters<typeof knobs.optionsKnob>
      ) => this.getKnobValue(name, defaultValue)
    });

    afterEach(() => {
      this.reset();
    });
  }

  private registerButton(name: string, callback: ButtonTypeOnClickProp) {
    this.knobButtons[name] = callback;
  }

  private getKnobValue(name: string, defaultValue: any): any {
    if (this.knobValues.hasOwnProperty(name)) {
      this.usedKnobs.add(name);
      return this.knobValues[name];
    }

    return defaultValue;
  }

  triggerButton(name: string): any {
    if (this.knobButtons[name]) {
      return this.knobButtons[name]({ name, value: undefined as never });
    }

    throw new KnobMockingError(
      `Rendered component does not have a button called "${name}"`
    );
  }

  mockKnobValues(knobValues: KnobValues): this {
    this.knobValues = {
      ...this.knobValues,
      ...knobValues
    };

    return this;
  }
}

const knobMocker = new KnobMocker();

export default knobMocker;

knobMocker.install();
