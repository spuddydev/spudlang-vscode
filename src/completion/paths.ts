import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";

const QUOTED_CTX = /\b(mkdir|file|copy|from|into|in)\s+"([^"\n]*)$/;
const UNQUOTED_CTX = /\b(mkdir|file|copy|from|into|in)\s+(\S*)$/;

export class PathCompletionProvider implements vscode.CompletionItemProvider {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.CompletionItem[] | undefined> {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    let partial: string | undefined;
    const qm = QUOTED_CTX.exec(linePrefix);
    if (qm) {
      partial = qm[2];
    } else {
      const um = UNQUOTED_CTX.exec(linePrefix);
      if (um) partial = um[2];
    }
    if (partial === undefined) return undefined;

    const docDir = path.dirname(document.uri.fsPath);
    const normalised = partial.replace(/\\/g, "/");
    const lastSlash = normalised.lastIndexOf("/");
    const dirPart = lastSlash === -1 ? "" : normalised.slice(0, lastSlash);
    const leaf = lastSlash === -1 ? normalised : normalised.slice(lastSlash + 1);

    const target = dirPart === "" ? docDir : path.resolve(docDir, dirPart);

    let entries;
    try {
      entries = await fs.readdir(target, { withFileTypes: true });
    } catch {
      return undefined;
    }

    const replaceRange = new vscode.Range(
      position.translate(0, -leaf.length),
      position,
    );

    return entries
      .filter((e) => !e.name.startsWith("."))
      .map((e) => {
        const isDir = e.isDirectory();
        const item = new vscode.CompletionItem(
          e.name,
          isDir ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File,
        );
        item.range = replaceRange;
        item.filterText = e.name;
        if (isDir) {
          item.insertText = e.name + "/";
          item.command = {
            command: "editor.action.triggerSuggest",
            title: "Re-trigger",
          };
        }
        return item;
      });
  }
}
