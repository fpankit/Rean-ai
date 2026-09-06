import AgoraRTC from "agora-rtc-sdk-ng";
import { getStoredAgoraConfig } from "./agoraConfig";

class AgoraService {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.remoteAudioTrack = null;
    this.isConnected = false;
    this.onVolumeIndicator = null;
    this.onUserPublished = null;
  }

  async initClient() {
    if (!this.client) {
      this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      this.setupEventListeners();
    }
    return this.client;
  }

  setupEventListeners() {
    if (!this.client) return;

    this.client.on("user-published", async (user, mediaType) => {
      await this.client.subscribe(user, mediaType);
      console.log("Subscribed to Agora remote user:", user.uid);
      if (mediaType === "audio") {
        this.remoteAudioTrack = user.audioTrack;
        this.remoteAudioTrack.play();
        if (this.onUserPublished) this.onUserPublished(user);
      }
    });

    this.client.on("user-unpublished", (user) => {
      console.log("Remote user unpublished:", user.uid);
    });

    AgoraRTC.enableAudioVolumeIndicator();
    this.client.on("volume-indicator", (volumes) => {
      if (this.onVolumeIndicator) {
        this.onVolumeIndicator(volumes);
      }
    });
  }

  async joinChannel(channelNameOverride = null) {
    const config = getStoredAgoraConfig();
    if (!config.appId) {
      console.log("No Agora App ID provided. Using simulation voice engine.");
      this.isConnected = true;
      return { isSimulation: true };
    }

    try {
      await this.initClient();
      const channel = channelNameOverride || config.channelName || "echosphere-support";
      const uid = await this.client.join(
        config.appId,
        channel,
        config.token || null,
        null
      );

      // Create microphone audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "speech_standard",
        AEC: true, // Acoustic Echo Cancellation
        ANS: true, // Active Noise Suppression
        AGC: true  // Automatic Gain Control
      });

      await this.client.publish([this.localAudioTrack]);
      this.isConnected = true;
      console.log("Successfully joined Agora RTC channel:", channel, "UID:", uid);
      return { isSimulation: false, uid, channel };
    } catch (err) {
      console.warn("Agora RTC Join error, falling back to Voice Engine Simulation:", err);
      this.isConnected = true;
      return { isSimulation: true, error: err.message };
    }
  }

  async leaveChannel() {
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }
    if (this.client && this.isConnected) {
      try {
        await this.client.leave();
      } catch (e) {
        console.warn("Error leaving Agora channel:", e);
      }
    }
    this.isConnected = false;
  }

  setMute(isMuted) {
    if (this.localAudioTrack) {
      this.localAudioTrack.setMuted(isMuted);
    }
  }
}

export const agoraService = new AgoraService();
export default agoraService;
