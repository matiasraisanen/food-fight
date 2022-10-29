import * as fs from "fs";
import * as path from "path";

export interface ICdkOutputs {
  [stack: string]: {
    [output: string]: string;
  };
}

export function readCdkOutput(): ICdkOutputs | undefined {
  const outputPath = path.join(__dirname, `../../outputs/cfnOutputs.json`);

  if (!fs.existsSync(outputPath)) {
    return undefined;
  }

  const output = fs.readFileSync(outputPath, "utf-8");
  const parsedOutput = JSON.parse(output);
  return parsedOutput;
}

export function getOutputValue(outputs: ICdkOutputs, stack: string, output: string): string {
  const stackOutputs = outputs[stack];
  const matcher = new RegExp(`^${output}.*`);

  const matchedKey = Object.keys(stackOutputs).filter((key) => matcher.test(key));
  if (matchedKey.length > 1) {
    throw new Error(`Multiple matches in the CDK output for the key ${output}!`);
  }

  if (matchedKey.length === 0) {
    throw new Error(`No matches in the CDK output for the key ${output}!`);
  }

  return stackOutputs[matchedKey[0]];
}
