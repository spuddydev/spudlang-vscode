import * as vscode from "vscode";
import { PathCompletionProvider } from "./completion/paths";
import { VariableCompletionProvider } from "./completion/variables";

export function activate(context: vscode.ExtensionContext): void {
  const selector: vscode.DocumentSelector = { language: "spudlang", scheme: "file" };

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      selector,
      new PathCompletionProvider(),
      "/",
      ".",
    ),
    vscode.languages.registerCompletionItemProvider(
      selector,
      new VariableCompletionProvider(),
      "{",
    ),
  );
}

export function deactivate(): void {}
