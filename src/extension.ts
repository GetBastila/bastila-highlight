// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'isomorphic-fetch';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bastila-highlight" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('bastila-highlight.highlightBastila', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
				const document = editor.document;
				const text = document.getText();
				
				const patterns = await fetchPatterns()

				const decorationType = vscode.window.createTextEditorDecorationType({
						backgroundColor: 'rgba(255, 0, 0, 0.3)'
				});

				const ranges: vscode.Range[] = []

				for (let pattern of patterns) {
					let regex = new RegExp(pattern['snippet'], "g");
					let match;
					while (match = regex.exec(text)) {
							let startPos = document.positionAt(match.index);
							let endPos = document.positionAt(match.index + match[0].length);
							ranges.push(new vscode.Range(startPos, endPos));
					}
				}
				
				editor.setDecorations(decorationType, ranges);
		}
	});

	context.subscriptions.push(disposable);
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
							'Authorization': `Api-Key 1KPTAMUj.xHeq2Y1fLSvH7UosH2H8XYtr2pQVDTGr`
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
