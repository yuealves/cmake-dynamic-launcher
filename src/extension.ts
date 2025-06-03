// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

/**
 * Get the executable path for a given target
 * @param workspaceFolder Workspace folder path
 * @param targetName Target name to find
 * @returns Full path to the executable
 */
function getExecutablePath(workspaceFolder: string, targetName: string): string {
	// Common build directories
	const buildDirs = ['build', 'out/build', 'cmake-build-debug', 'cmake-build-release'];
	
	for (const buildDir of buildDirs) {
		const basePath = path.join(workspaceFolder, buildDir);
		
		// Add .exe extension on Windows
		const execPath = path.join(
			basePath,
			targetName + (os.platform() === 'win32' ? '.exe' : '')
		);
		
		if (fs.existsSync(execPath)) {
			return execPath;
		}
	}
	
	throw new Error(`Could not find executable for target: ${targetName}`);
}

/**
 * Run an executable in the terminal with platform-specific commands
 * @param terminal VS Code terminal
 * @param execPath Path to the executable
 * @param targetName Name of the target
 */
function runExecutable(terminal: vscode.Terminal, execPath: string, targetName: string) {
	const quotedPath = process.platform === 'win32' ? `"${execPath}"` : `"${path.dirname(execPath)}"`;
	
	// Change to executable directory
	terminal.sendText(`cd ${quotedPath}`);
	
	// Run the executable with platform-specific syntax
	if (process.platform === 'win32') {
		terminal.sendText(`.\\${targetName}.exe`);
	} else {
		terminal.sendText(`./${targetName}`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Register the command that will dynamically set and run CMake targets
	context.subscriptions.push(
		vscode.commands.registerCommand('cmake-dynamic-launcher.setAndRunCurrentFileAsTarget', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showWarningMessage('No active editor found.');
				return;
			}

			const filePath = editor.document.fileName;
			const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);

			if (!workspaceFolder) {
				vscode.window.showWarningMessage('File is not in a workspace folder. Cannot determine CMake target.');
				return;
			}

			// Get path relative to workspace root
			const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);

			// Extract directory name and file name without extension
			// Example: list/876.cc -> list_876
			const dirName = path.basename(path.dirname(filePath));
			const fileNameNoExt = path.basename(filePath, path.extname(filePath));

			// Combine into target name
			// Note: You may need to adjust this based on your CMakeLists.txt naming convention
			const targetName = `${dirName}_${fileNameNoExt}`;

			vscode.window.showInformationMessage(`Attempting to set and run CMake target: ${targetName}`);

			try {
				// Build the specified target
				await vscode.commands.executeCommand('cmake.buildWithTarget', targetName);
				vscode.window.showInformationMessage(`Built target: ${targetName}`);
				
				// Get executable path
				const executablePath = getExecutablePath(workspaceFolder.uri.fsPath, targetName);
				
				// Create new terminal and run the program
				const terminal = vscode.window.createTerminal(`Run ${targetName}`);
				terminal.show();
				
				// Run the executable with platform-specific commands
				runExecutable(terminal, executablePath, targetName);

			} catch (error) {
				const errorMessage = (error instanceof Error) ? error.message : String(error);
				vscode.window.showErrorMessage(`Failed to set or run CMake target: ${errorMessage}`);
				console.error(error);
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
