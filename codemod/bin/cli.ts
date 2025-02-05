/**
 * Based on the package `next-codemod` from Vercel, this script is used to run codemods on the project.
 * crs-codemod optional-name-of-transform optional/path/to/src [...options]
 *
 * @see {@link https://github.com/vercel/next.js/blob/dc9f30c/packages/next-codemod/bin/cli.ts}
 */
import execa from "execa";
import globby from "globby";
import inquirer from "inquirer";
import isGitClean from "is-git-clean";
import meow from "meow";
import path from "path";
import { yellow } from "picocolors";

export const jscodeshiftExecutable = require.resolve(".bin/jscodeshift");
export const transformerDirectory = path.join(__dirname, "../", "transforms");

export function checkGitStatus(force: boolean) {
  let clean = false;
  let errorMessage = "Unable to determine if git directory is clean";
  try {
    clean = isGitClean.sync(process.cwd());
    errorMessage = "Git directory is not clean";
  } catch (err) {
    if (err && err.stderr && err.stderr.includes("Not a git repository")) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else {
      console.log("Thank you for using crs-codemod!");
      console.log(
        yellow(
          "\nBut before we continue, please stash or commit your git changes."
        )
      );
      console.log(
        "\nYou may use the --force flag to override this safety check."
      );
      process.exit(1);
    }
  }
}

export async function runTransform({ files, flags, transformer }) {
  const transformerPath = path.join(transformerDirectory, `${transformer}.js`);

  let args = [];

  const { dry, print, runInBand } = flags;

  if (dry) {
    args.push("--dry");
  }
  if (print) {
    args.push("--print");
  }
  if (runInBand) {
    args.push("--run-in-band");
  }

  args.push("--verbose=2");

  args.push("--ignore-pattern=**/node_modules/**");
  args.push("--ignore-pattern=**/.next/**");

  args.push("--extensions=tsx,ts,jsx,js");

  args = args.concat(["--transform", transformerPath]);

  if (flags.jscodeshift) {
    args = args.concat(flags.jscodeshift);
  }

  args = args.concat(files);

  console.log(`Executing command: jscodeshift ${args.join(" ")}`);

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: "inherit",
    stripFinalNewline: false,
  });

  if (result.failed) {
    throw new Error(`jscodeshift exited with code ${result.exitCode}`);
  }
}

const TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: "v5: Remove or replace deprecated props",
    value: "v5",
  },
];

function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) =>
    file.includes("*")
  );
  return shouldExpandFiles
    ? globby.sync(filesBeforeExpansion)
    : filesBeforeExpansion;
}

export function run() {
  const cli = meow({
    description: "Codemods for updating chakra-react-select in applications.",
    help: `
    Usage
      $ npx crs-codemod <transform> <path> <...options>
        transform    One of the choices from https://github.com/vercel/next.js/tree/canary/packages/next-codemod
        path         Files or directory to transform. Can be a glob like pages/**.js
    Options
      --force            Bypass Git safety checks and forcibly run codemods
      --dry              Dry run (no changes are made to files)
      --print            Print transformed files to your terminal
      --jscodeshift  (Advanced) Pass options directly to jscodeshift
    `,
    flags: {
      boolean: ["force", "dry", "print", "help"],
      string: ["_"],
      alias: {
        h: "help",
      },
    },
  } as meow.Options<meow.AnyFlags>);

  if (!cli.flags.dry) {
    checkGitStatus(!!cli.flags.force);
  }

  if (
    cli.input[0] &&
    !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.value === cli.input[0])
  ) {
    console.error("Invalid transform choice, pick one of:");
    console.error(
      TRANSFORMER_INQUIRER_CHOICES.map((x) => `- ${x.value}`).join("\n")
    );
    process.exit(1);
  }

  inquirer
    .prompt([
      {
        type: "input",
        name: "files",
        message: "On which files or directory should the codemods be applied?",
        when: !cli.input[1],
        default: ".",
        filter: (files) => files.trim(),
      },
      {
        type: "list",
        name: "transformer",
        message: "Which transform would you like to apply?",
        when: !cli.input[0],
        pageSize: TRANSFORMER_INQUIRER_CHOICES.length,
        choices: TRANSFORMER_INQUIRER_CHOICES,
      },
    ])
    .then((answers) => {
      const { files, transformer } = answers;

      const filesBeforeExpansion = cli.input[1] || files;
      const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);

      const selectedTransformer = cli.input[0] || transformer;

      if (!filesExpanded.length) {
        console.log(
          `No files found matching ${filesBeforeExpansion.join(" ")}`
        );
        return null;
      }

      return runTransform({
        files: filesExpanded,
        flags: cli.flags,
        transformer: selectedTransformer,
      });
    });
}
