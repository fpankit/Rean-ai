// Agora Config helper with user-provided production credentials

const DEFAULT_AGORA_CONFIG = {
  appId: "f75346fd21704ef29d2e18019e084aca",
  token: "007eJxTYNDoL6sy3txt8m/x6i8WXPEHzedLc/+Rq13BdHOywfZN67YqMKSZmxqbmKWlGBmaG5ikphlZphilGloYGFqmGliYJCYnsh+enNUQyMiwS9KfhZEBAkF8foai1MQ83cRM3eSMxLy81BwGBgCVtSKs",
  channelName: "rean-ai-channel",
  appCertificate: "d2d44503ab08499eaa1248352c4d4c48",
  agentId: "rean-ai-agent-01",
  mode: "rtc",
  useSimulation: false
};

export const getStoredAgoraConfig = () => {
  const stored = localStorage.getItem("echosphere_agora_config");
  if (!stored) {
    localStorage.setItem("echosphere_agora_config", JSON.stringify(DEFAULT_AGORA_CONFIG));
    return DEFAULT_AGORA_CONFIG;
  }
  try {
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_AGORA_CONFIG, ...parsed };
  } catch {
    return DEFAULT_AGORA_CONFIG;
  }
};

export const saveAgoraConfig = (config) => {
  localStorage.setItem("echosphere_agora_config", JSON.stringify(config));
};
