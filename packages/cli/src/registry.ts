import fetch from 'cross-fetch'; /* some runtimes use node <18 causing fetch not defined issue */
import { config as dotenvConfig } from 'dotenv';
import {
  type StdioConnection,
  StdioConnectionSchema,
  type ServerConfig,
  type RegistryServer,
} from './types/registry';
import type { WSConnection } from './types/registry';
import { verbose } from './logger';
import { API_BASE_URL } from './constants';

dotenvConfig();

const getEndpoint = (): string => {
  const endpoint = process.env.REGISTRY_ENDPOINT || API_BASE_URL;
  if (!endpoint) {
    throw new Error('REGISTRY_ENDPOINT environment variable is not set');
  }
  return endpoint;
};

/**
 * Get server details from registry
 * @param packageName The name of the package to resolve
 * @returns Details about the server, including available connection options
 */
export const resolvePackage = async (
  packageName: string,
): Promise<RegistryServer> => {
  const endpoint = getEndpoint();
  verbose(`Resolving package ${packageName} from registry at ${endpoint}`);

  try {
    verbose(`Making GET request to ${endpoint}/servers/get_details?qualifiedName=${packageName}`);
    const response = await fetch(`${endpoint}/servers/get_details?qualifiedName=${packageName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    verbose(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as {
        error?: string;
      };
      const errorMessage = errorData?.error;
      verbose(`Error response: ${errorMessage}`);

      if (response.status === 404) {
        throw new Error(`Server "${packageName}" not found`);
      }

      throw new Error(`Package resolution failed with status ${response.status}: ${errorMessage}`);
    }

    verbose('Successfully received server data from registry');
    const data = (await response.json()) as RegistryServer & { data: { connections: string } };
    verbose(`Server data: ${JSON.stringify(data, null, 2)}`);
    verbose(`Server ${packageName} resolved with ${data.data.connections.length} connection options`);
    // data.data.connections = JSON.parse(data.data.connections || '[]');
    return data;
  } catch (error) {
    verbose(`Package resolution error: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error) {
      throw error; // Pass through our custom errors without wrapping
    }
    throw new Error(`Failed to resolve package: ${error}`);
  }
};

/**
 * Fetches a connection for a specific package from the registry
 * @param packageName The name of the package to connect to
 * @param config Configuration options for the server connection
 * @returns A validated StdioConnection object
 */
export const fetchConnection = async (
  packageName: string,
  config: ServerConfig,
): Promise<StdioConnection> => {
  const endpoint = getEndpoint();
  verbose(`Fetching connection for ${packageName} from registry at ${endpoint}`);
  verbose(`Connection config provided (keys: ${Object.keys(config).join(', ')})`);

  try {
    const requestBody = {
      connectionType: 'stdio',
      config,
    };
    verbose(`Sending connection request for ${packageName}`);

    verbose(`Making POST request to ${endpoint}/servers/${packageName}`);
    const response = await fetch(`${endpoint}/servers/${packageName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    verbose(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      verbose(`Error response: ${errorText}`);
      throw new Error(`Registry request failed with status ${response.status}: ${errorText}`);
    }
    verbose('Successfully received connection data from registry');
    const data = (await response.json()) as {
      success: boolean;
      result?: StdioConnection | WSConnection;
    };
    verbose;
    verbose(`Connection response received (success: ${data.success})`);

    if (!data.success || !data.result) {
      throw new Error('Invalid registry response format');
    }

    return StdioConnectionSchema.parse(data.result);
  } catch (error) {
    verbose(`Connection fetch error: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch server connection: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Fetches saved server configuration and server details using an API key
 * @param serverName The qualified name of the server
 * @param apiKey The user's API key
 * @returns {Promise<{config: ServerConfig, server: RegistryServer}>} The saved configuration and server details
 */
export const fetchConfigWithApiKey = async (
  serverName: string,
  apiKey: string,
): Promise<{ config: ServerConfig; server: RegistryServer }> => {
  const endpoint = getEndpoint();
  verbose(`Fetching configuration for ${serverName} using API key`);

  try {
    verbose(`Making GET request to ${endpoint}/configs/${serverName}`);
    const response = await fetch(`${endpoint}/configs/${serverName}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    verbose(`Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = (await response.clone().json()) as { error?: string };
        errorMessage = errorData?.error || 'Unknown error';
      } catch (e) {
        // If parsing as JSON fails, use text() on the original response
        errorMessage = await response.text();
      }
      verbose(`Error response: ${errorMessage}`);

      if (response.status === 404) {
        throw new Error(`Server "${serverName}" not found`);
      }

      if (response.status === 401) {
        throw new Error(`API key required or invalid`);
      }

      if (response.status === 400) {
        throw new Error(`Invalid server name`);
      }

      if (response.status === 500) {
        throw new Error(`Internal server error: ${errorMessage}`);
      }

      throw new Error(`Configuration fetch failed with status ${response.status}: ${errorMessage}`);
    }

    verbose('Successfully received configuration data');
    const data = (await response.json()) as {
      success: boolean;
      config: ServerConfig;
      server: RegistryServer;
    };

    if (!data.success || !data.config || !data.server) {
      throw new Error('Invalid response format');
    }

    verbose(`Configuration and server details for ${serverName} retrieved successfully`);
    return {
      config: data.config,
      server: data.server,
    };
  } catch (error) {
    verbose(`Configuration fetch error: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error) {
      throw error; // Pass through our custom errors without wrapping
    }
    throw new Error(`Failed to fetch configuration: ${error}`);
  }
};
