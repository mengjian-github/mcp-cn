import { trackEvent } from '@/utils';
import { ClientType, PlatformType } from '../interfaces';
export interface InstallationTrackParams {
  relation?: 'npm' | 'json';
  client?: ClientType;
  platform?: PlatformType;
  click_name: 'copy' | 'connect' | 'switch_client' | 'switch_platform' | 'switch_relation';
}

export const trackInstallation = (params: InstallationTrackParams) => {
  trackEvent('mcp_installation_click', { ...params });
};
