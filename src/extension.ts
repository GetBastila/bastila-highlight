// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'isomorphic-fetch';

export function activate(context: vscode.ExtensionContext) {
  let decorationType: vscode.TextEditorDecorationType;

  // Function to handle the highlighting logic
  async function highlightPatterns(editor: vscode.TextEditor | undefined) {
    if (editor) {
      const document = editor.document;
      const text = document.getText();

      const patterns = await fetchPatterns()

      if (decorationType) {
        decorationType.dispose();
      }

      decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 59, 0, 0.4)'
      });

      const ranges: vscode.DecorationOptions[] = []

      for (let pattern of patterns) {
        let regex = new RegExp(pattern['snippet'], "g");
        let match;
        while (match = regex.exec(text)) {
          let startPos = document.positionAt(match.index);
          let endPos = document.positionAt(match.index + match[0].length);
          let range = new vscode.Range(startPos, endPos);

          ranges.push({
            range: range,
            hoverMessage: 'This is a deprecated pattern defined in Bastila. ' + pattern['fix_recommendation']
          });
        }
      }

      editor.setDecorations(decorationType, ranges);
    }
  }

  // Call the function on extension activation
  highlightPatterns(vscode.window.activeTextEditor);

  // Listen for when a text document is opened or changed, or when the active text editor is changed
  vscode.workspace.onDidOpenTextDocument((document) => {
    highlightPatterns(vscode.window.activeTextEditor);
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    highlightPatterns(vscode.window.activeTextEditor);
  });

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    highlightPatterns(editor);
  });
}

async function fetchPatterns(): Promise<any[]> {
	const endpoint = `https://bastila.dev/api/check/standard-changes/`;

	const config = vscode.workspace.getConfiguration('bastila');
	const apiKey = config.get<string>('BASTILA_KEY');

	try {
			const response = await fetch(endpoint, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json',
							'Authorization': `Api-Key ${apiKey}`
					}
			});

			if (!response.ok) {
					throw new Error('Network response was not ok');
			}

			const data: any = await response.json();
			return data['results'];

	} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
			return [];
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
