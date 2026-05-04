import * as vscode from "vscode";

const DECL_RE = /\b(?:ask|let)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
const AS_RE = /\bas\s+([A-Za-z_][A-Za-z0-9_]*)/g;

interface VarDecl {
  name: string;
  kind: "ask" | "let" | "as";
  line: number;
  detail: string;
}

function collectVariables(document: vscode.TextDocument): VarDecl[] {
  const found = new Map<string, VarDecl>();
  for (let i = 0; i < document.lineCount; i++) {
    const lineText = document.lineAt(i).text;
    const code = lineText.replace(/#.*$/, "");

    DECL_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = DECL_RE.exec(code)) !== null) {
      const kind = code.slice(m.index, m.index + 3) === "ask" ? "ask" : "let";
      if (!found.has(m[1])) {
        found.set(m[1], { name: m[1], kind, line: i, detail: lineText.trim() });
      }
    }

    AS_RE.lastIndex = 0;
    while ((m = AS_RE.exec(code)) !== null) {
      if (!found.has(m[1])) {
        found.set(m[1], { name: m[1], kind: "as", line: i, detail: lineText.trim() });
      }
    }
  }
  return [...found.values()];
}

const KIND_ICON: Record<VarDecl["kind"], vscode.CompletionItemKind> = {
  ask: vscode.CompletionItemKind.Variable,
  let: vscode.CompletionItemKind.Constant,
  as: vscode.CompletionItemKind.Variable,
};

const KIND_LABEL: Record<VarDecl["kind"], string> = {
  ask: "ask",
  let: "let",
  as: "as binding",
};

export class VariableCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
  ): vscode.CompletionItem[] {
    return collectVariables(document).map((v) => {
      const item = new vscode.CompletionItem(v.name, KIND_ICON[v.kind]);
      item.detail = `(${KIND_LABEL[v.kind]}) ${v.name}`;
      item.documentation = new vscode.MarkdownString().appendCodeblock(v.detail, "spudlang");
      return item;
    });
  }
}
