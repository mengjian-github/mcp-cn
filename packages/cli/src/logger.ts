import chalk from "chalk"

let isVerbose = false

export function setVerbose(value: boolean): void {
	isVerbose = value
}

export function verbose(message: string): void {
	if (isVerbose) {
		console.log(chalk.gray(`[verbose] ${message}`))
	}
}

export const debug = (message: string) => {
	console.debug(chalk.gray(message))
}

export const info = (message: string) => {
	console.info(chalk.blue(message))
}

export const success = (message: string) => {
	console.log(chalk.green(message))
}

export const warn = (message: string) => {
	console.warn(chalk.yellow(message))
}

export const error = (message: string) => {
	console.error(chalk.red(message))
}

const logger = {
	debug: (message: string) => {
		console.debug(chalk.gray(message))
	},
	info: (message: string) => {
		console.info(chalk.blue(message))
	},
	success: (message: string) => {
		console.log(chalk.green(message))
	},
	warn: (message: string) => {
		console.warn(chalk.yellow(message))
	},
	error: (message: string) => {
		console.error(chalk.red(message))
	},
}

export default logger
