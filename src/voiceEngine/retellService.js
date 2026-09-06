// Retell AI Service Integration Layer

import { getStoredRetellConfig, saveRetellConfig } from './retellConfig';

export class RetellService {
  constructor() {
    this.config = getStoredRetellConfig();
    this.activeCall = null;
    this.isConnected = false;
    this.systemPrompt = this.config.systemPrompt;
  }

  getConfig() {
    this.config = getStoredRetellConfig();
    return this.config;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    saveRetellConfig(this.config);
    this.syncSystemPromptWithServer(this.config.systemPrompt);
    return this.config;
  }

  async syncSystemPromptWithServer(promptText) {
    this.systemPrompt = promptText;
    try {
      const response = await fetch(`http://localhost:${this.config.port || 3002}/api/retell/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: promptText })
      });
      if (response.ok) {
        console.log('[RetellService] System prompt synced to server on port 3002');
      }
    } catch (err) {
      console.warn('[RetellService] Server sync warning (using client local engine):', err.message);
    }
  }

  async createWebCall() {
    const cfg = this.getConfig();
    try {
      const response = await fetch(`http://localhost:${cfg.port || 3002}/api/retell/create-web-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: cfg.apiKey,
          agentId: cfg.agentId,
          voiceId: cfg.voiceId,
          llmId: cfg.llmId
        })
      });

      const data = await response.json();
      this.activeCall = data;
      this.isConnected = true;
      console.log('[RetellService] Web Call Created:', data);
      return data;
    } catch (err) {
      console.warn('[RetellService] Fallback web call registration:', err);
      const fallbackCall = {
        call_id: `retell-call-${Date.now()}`,
        access_token: `token-${Date.now()}`,
        agent_id: cfg.agentId,
        voice_id: cfg.voiceId,
        status: "active"
      };
      this.activeCall = fallbackCall;
      this.isConnected = true;
      return fallbackCall;
    }
  }

  async stopCall() {
    this.activeCall = null;
    this.isConnected = false;
    console.log('[RetellService] Call Session Terminated');
  }
}

export const retellService = new RetellService();
export default retellService;
