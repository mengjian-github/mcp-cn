import type { ConnectionDetails } from "../types/registry"
import inquirer from "inquirer"
import chalk from "chalk"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js"
import ora from "ora"
import { verbose } from "../logger"

const execAsync = promisify(exec)

export async function checkUVInstalled(): Promise<boolean> {
	try {
		await execAsync("uvx --version")
		return true
	} catch (error) {
		return false
	}
}

export async function promptForUVInstall(): Promise<boolean> {
	const { shouldInstall } = await inquirer.prompt<{ shouldInstall: boolean }>([
		{
			type: "confirm",
			name: "shouldInstall",
			message:
				"UV package manager is required for Python MCP servers. Would you like to install it?",
			default: true,
		},
	])

	if (!shouldInstall) {
		console.warn(
			chalk.yellow(
				"UV installation was declined. You can install it manually from https://astral.sh/uv",
			),
		)
		return false
	}

	const spinner = ora("Installing UV package manager...").start()
	try {
		if (process.platform === "win32") {
			await execAsync(
				'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
			)
		} else {
			try {
				await execAsync("curl -LsSf https://astral.sh/uv/install.sh | sh")
			} catch {
				await execAsync("wget -qO- https://astral.sh/uv/install.sh | sh")
			}
		}

		spinner.succeed("✓ UV installed successfully")
		return true
	} catch (error) {
		spinner.fail(
			"Failed to install UV. You can install it manually from https://astral.sh/uv",
		)
		return false
	}
}

export function isUVRequired(connection: ConnectionDetails): boolean {
	// Check for stdio connection with uvx in stdioFunction
	if (
		connection.type === "stdio" &&
		connection.config?.command?.includes("uvx")
	) {
		return true
	}

	return false
}

export async function checkBunInstalled(): Promise<boolean> {
	try {
		await execAsync("bun --version")
		return true
	} catch (error) {
		return false
	}
}

export async function promptForBunInstall(): Promise<boolean> {
	const { shouldInstall } = await inquirer.prompt<{ shouldInstall: boolean }>([
		{
			type: "confirm",
			name: "shouldInstall",
			message:
				"Bun is required for this operation. Would you like to install it?",
			default: true,
		},
	])

	if (!shouldInstall) {
		console.warn(
			chalk.yellow(
				"Bun installation was declined. You can install it manually from https://bun.sh",
			),
		)
		return false
	}

	try {
		console.log("Installing Bun...")
		if (process.platform === "win32") {
			// Windows installation
			await execAsync('powershell -c "irm bun.sh/install.ps1|iex"')
		} else {
			try {
				console.log("Attempting to install Bun via Homebrew...")
				await execAsync("brew install oven-sh/bun/bun")
			} catch (brewError) {
				console.log(
					"Homebrew installation failed, trying direct installation...",
				)
				// Fall back to curl method if Homebrew fails
				await execAsync("curl -fsSL https://bun.sh/install | bash")
			}
		}
		console.log(chalk.green("Bun installed successfully!"))
		return true
	} catch (error) {
		console.error(
			chalk.red("Failed to install Bun:"),
			error instanceof Error ? error.message : String(error),
		)
		console.log("Please install Bun manually from https://bun.sh")
		return false
	}
}

export function isBunRequired(connection: ConnectionDetails): boolean {
	// Check for stdio connection with uvx in stdioFunction
	if (
		connection.type === "stdio" &&
		connection.config?.command?.includes("bunx")
	) {
		return true
	}

	return false
}

export function getRuntimeEnvironment(
	baseEnv: Record<string, string> = {},
): Record<string, string> {
	const defaultEnv = getDefaultEnvironment()

	return {
		...defaultEnv,
		...baseEnv,
	}
}

/**
 * Ensures UV is installed if required by the connection
 * @param connection The connection details to check
 * @returns Promise<void>
 */
export async function ensureUVInstalled(
	connection: ConnectionDetails,
): Promise<void> {
	if (isUVRequired(connection)) {
		verbose("UV installation check required")
		const uvInstalled = await checkUVInstalled()
		if (!uvInstalled) {
			const installed = await promptForUVInstall()
			if (!installed) {
				console.warn(
					chalk.yellow("UV is not installed. The server might fail to launch."),
				)
			}
		}
	}
}

/**
 * Ensures Bun is installed if required by the connection
 * @param connection The connection details to check
 * @returns Promise<void>
 */
export async function ensureBunInstalled(
	connection: ConnectionDetails,
): Promise<void> {
	if (isBunRequired(connection)) {
		verbose("Bun installation check required")
		const bunInstalled = await checkBunInstalled()
		if (!bunInstalled) {
			const installed = await promptForBunInstall()
			if (!installed) {
				console.warn(
					chalk.yellow(
						"Bun is not installed. The server might fail to launch.",
					),
				)
			}
		}
	}
}

/**
 * Checks if the server is a remote server and displays a security notice if needed
 * @param server The server information containing connection details
 * @returns boolean indicating if the server is remote
 */
export function checkAndNotifyRemoteServer(server: {
	connections: ConnectionDetails[]
	remote?: boolean
}): boolean {
	const remote =
		server.connections.some(
			(conn) => conn.type === "ws" && "deploymentUrl" in conn,
		) && server.remote !== false

	if (remote) {
		verbose("Remote server detected, showing security notice")
	}

	return remote
}
