---
layout: content
title: "Web Softphone (SIP.js)"
description: "Browser-based WebRTC softphone powered by SIP.js. Connect directly to your Asterisk PBX from Chrome, Firefox, Safari, or Edge without installing software."
---

# Web Softphone (WebRTC)

RemoSIM features a browser-based softphone powered by **SIP.js** and **WebRTC**. You can place and receive calls through your home physical SIM cards directly from any modern web browser without installing third-party desktop software.

---

## 1. Interactive Web Softphone Client

Below is the client interface. Enter your Asterisk server's WebSocket URL and extension credentials to establish a secure real-time WebRTC audio connection:

<div class="softphone-preview-card">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-signal" style="color: var(--accent-primary);"></i>
      <strong style="font-size: 0.95rem;">RemoSIM WebPhone</strong>
    </div>
    <span class="badge-pill badge-neutral" id="webphone-status">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--text-dim); display: inline-block;"></span>
      Ready to Connect
    </span>
  </div>

  <!-- Server Connection Settings -->
  <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
    <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
      SIP Connection Settings
    </div>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <input type="text" id="sip-server" placeholder="WSS URL: wss://your-domain.com/ws" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--text-main); font-size: 0.875rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        <input type="text" id="sip-user" placeholder="Extension (e.g. 101)" style="padding: 0.5rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--text-main); font-size: 0.875rem;">
        <input type="password" id="sip-pass" placeholder="SIP Secret" style="padding: 0.5rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--text-main); font-size: 0.875rem;">
      </div>
      <button class="btn-cta-primary" style="justify-content: center; padding: 0.5rem; font-size: 0.875rem; margin-top: 0.25rem;" onclick="alert('Enter your server details to register your softphone session.')">
        <i class="fas fa-plug"></i> Connect to Server
      </button>
    </div>
  </div>

  <!-- Dialpad Display -->
  <div class="softphone-display">
    <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.25rem;">DIAL NUMBER</div>
    <div id="dial-number" style="font-size: 1.75rem; font-weight: 700; letter-spacing: 0.05em; min-height: 2.2rem; font-family: monospace;">
      *43
    </div>
  </div>

  <!-- Dialpad Keys -->
  <div class="dialpad-grid">
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '1'">1 <small>&nbsp;</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '2'">2 <small>ABC</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '3'">3 <small>DEF</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '4'">4 <small>GHI</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '5'">5 <small>JKL</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '6'">6 <small>MNO</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '7'">7 <small>PQRS</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '8'">8 <small>TUV</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '9'">9 <small>WXYZ</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '*'">* <small>&nbsp;</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText += '0'">0 <small>+</small></button>
    <button class="dialpad-btn" onclick="document.getElementById('dial-number').innerText = document.getElementById('dial-number').innerText.slice(0, -1)"><i class="fas fa-backspace"></i></button>
  </div>

  <!-- Action Controls -->
  <div style="display: flex; gap: 0.75rem;">
    <button class="btn-cta-primary" style="flex: 1; justify-content: center; background: linear-gradient(135deg, #10b981, #059669);" onclick="alert('Place call via WebRTC. Remember to allow microphone access in your browser.')">
      <i class="fas fa-phone-alt"></i> Call
    </button>
    <button class="btn-cta-secondary" style="flex: 1; justify-content: center; color: #ef4444 !important; border-color: rgba(239, 68, 68, 0.3);" onclick="document.getElementById('dial-number').innerText = ''">
      <i class="fas fa-phone-slash"></i> Clear
    </button>
  </div>
</div>

---

## 2. WebRTC Requirements & NAT Traversal

WebRTC establishes peer-to-peer audio streams between your web browser and the Asterisk PBX. Because residential connections and cellular networks operate behind NAT (Network Address Translation), STUN/TURN servers are required to guarantee two-way audio.

### What is a STUN / TURN Server?
- **STUN (Session Traversal Utilities for NAT)**: Discovers your public IP address and port mapping.
- **TURN (Traversal Using Relays around NAT)**: Acts as an encrypted audio relay when strict symmetric NATs or corporate firewalls block direct UDP media streams.

<div class="callout callout-info">
  <div class="callout-title"><i class="fas fa-shield-alt"></i> Recommended TURN Providers</div>
  <p>If you experience one-way audio (you cannot hear the caller or they cannot hear you), configure a free TURN service like <a href="https://www.metered.ca/tools/openrelay/" target="_blank" rel="noopener noreferrer">Open Relay by Metered</a> or deploy your own self-hosted <strong>eturnal</strong> / <strong>coturn</strong> relay daemon.</p>
</div>

---

## 3. Server Configuration for WebRTC

To enable SIP over WebSocket on your Asterisk server, verify that the following configurations are active in your FreePBX / Asterisk settings:

1. **Transport**: Ensure the `ws` (WebSocket) and `wss` (Secure WebSocket) transports are enabled in `sip_general_additional.conf` or FreePBX SIP Settings.
2. **Audio Codecs**: Enable `opus`, `ulaw`, and `alaw` for browser compatibility.
3. **SSL Certificate**: Modern web browsers mandate that WebRTC microphone access only works over HTTPS. Your WebSocket URL must use `wss://` with a valid TLS certificate (e.g. via Let's Encrypt).

---

## 4. Testing Your Audio with the Echo Test

Once registered, dial **`*43`** on your keypad and press Call:
- You will hear an automated prompt welcoming you to the Asterisk Echo Test.
- Speak into your microphone. If you immediately hear your voice echoed back with minimal latency, your WebRTC audio path, codecs, and NAT traversal are configured properly.

---

## Native Smartphone Softphones
Prefer using an app on your iPhone or Android device? Check our [Mobile Clients Guide]({{ '/client' | relative_url }}) for detailed SessionTalk and Zoiper configurations.