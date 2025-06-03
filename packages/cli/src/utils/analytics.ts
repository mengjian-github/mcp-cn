import inquirer from "inquirer"
import chalk from "chalk"
import {
	getAnalyticsConsent,
	setAnalyticsConsent,
	hasAskedConsent,
	initializeSettings,
} from "../cli-config"
import { BRAND_NAME } from "../constants"

export async function checkAnalyticsConsent(): Promise<void> {
	// Initialize settings and handle potential failures
	const initResult = await initializeSettings()
	if (!initResult.success) {
		// console.warn("[Analytics] Failed to initialize settings:", initResult.error)
		return // Exit early if we can't initialize settings
	}

	const consent = await getAnalyticsConsent()
	// If consent is already true, no need to ask
	if (consent) return

	const askedConsent = await hasAskedConsent()

	/* Only ask if we haven't asked before and consent is false */
	if (!askedConsent) {
		try {
			const { EnableAnalytics } = await inquirer.prompt([
				{
					type: "confirm",
					name: "EnableAnalytics",
					message: `Would you like to help improve ${BRAND_NAME} by sending anonymous usage data?\nFor information on ${BRAND_NAME}'s data policy`,
					default: true,
				},
			])

			const result = await setAnalyticsConsent(EnableAnalytics)
			if (!result.success) {
				console.warn(
					`[${BRAND_NAME}] Failed to save preference:`,
					result.error,
				)
			}
		} catch (error) {
			// Handle potential inquirer errors
			console.warn(
				`[${BRAND_NAME}] Failed to prompt for consent:`,
				error instanceof Error ? error.message : String(error),
			)
		}
	}
}
