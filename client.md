---
layout: content
title: "Mobile & Desktop SIP Clients"
description: "Step-by-step configuration guides for iOS (SessionTalk, Zoiper), Android, macOS (Telephone app), and desktop SIP clients with RemoSIM."
---

# Mobile & Desktop SIP Softphones

In addition to our browser-based [Web Softphone]({{ '/connect' | relative_url }}), you can install dedicated VoIP softphone apps on your smartphone or computer to answer and place calls through your remote SIM cards anywhere in the world.

---

## Account Parameters Checklist

When setting up any softphone application, you will need the credentials configured in your Asterisk / FreePBX extension:

| Parameter | Description | Example Value |
|:---|:---|:---|
| **Display Name** | Your name or caller ID | `John Doe` |
| **Username / Extension** | Asterisk Extension number | `1001` |
| **Password / Secret** | SIP Secret for the extension | `<YOUR_SIP_PASSWORD>` |
| **SIP Server / Domain** | Server hostname and port | `sip.yourdomain.com:5060` |
| **Transport** | Network protocol | `UDP` (or `TLS` if configured) |
| **NAT Keep-Alive** | Keeps cellular firewall port open | `Always Send` / `Enabled` |

---

## 1. Apple iOS (iPhone)

We recommend either **SessionTalk** or **Zoiper Lite** on iOS for reliable push notifications and battery-efficient background operation.

### Option A: SessionTalk SIP Softphone (Recommended)
1. Install [SessionTalk SIP Softphone](https://apps.apple.com/us/app/sessiontalk-sip-softphone/id362501443) from the App Store.
2. Tap **Settings &rarr; Manage Accounts &rarr; Add Account &rarr; Generic SIP**.
3. Configure the following fields:
   - **Account Name**: `RemoSIM`
   - **Display Name**: Your Name
   - **User Name**: Your Extension (e.g. `1001`)
   - **Password**: Your SIP Secret
   - **Domain / Host**: `sip.yourdomain.com:5060`
4. Under **Advanced Settings**:
   - **IP Version**: `IPv4`
   - **UDP Keepalive**: `Enabled`
5. Tap **Save**. The account indicator turns green when registered.

### Option B: Zoiper Lite on iOS
1. Install [Zoiper Lite](https://apps.apple.com/us/app/zoiper-lite-voip-soft-phone/id438949960) from the App Store.
2. Go to **Settings &rarr; Accounts &rarr; + &rarr; Yes &rarr; Manual Configuration &rarr; SIP account**.
3. Enter your account details:
   - **Account name**: `RemoSIM`
   - **Domain**: `sip.yourdomain.com:5060`
   - **User name**: `1001`
   - **Password**: Your SIP Secret
4. Go to **Network Settings** and ensure **Enable IPv6** is set to **NO**.

{% include youtube.html id="tEpUlD9WvE8" %}

---

## 2. Android

### Option A: Zoiper VoIP Client
1. Install **Zoiper IAX SIP VOIP Softphone** from the Google Play Store.
2. Open Zoiper and click **Use free with ads** (or enter your license).
3. In the setup wizard:
   - Enter your `username@sip.yourdomain.com:5060`
   - Enter your SIP password
4. Select **SIP UDP** as the transport provider.

{% include youtube.html id="ESMEm0HODtc" %}

### Option B: Native Android SIP (Samsung/Google where available)
Some Android firmware builds contain a built-in SIP client:
1. Open the stock **Phone** application.
2. Tap the three dots menu &rarr; **Settings &rarr; Calling accounts &rarr; SIP accounts**.
3. Tap **+** to add an account:
   - **Username**: Your Extension
   - **Password**: Your SIP Secret
   - **Server**: `sip.yourdomain.com:5060`
   - Under **Optional settings**, set **Send keep-alive** to `Always send`.

{% include youtube.html id="txPb90s1IJ4" %}

---

## 3. macOS (Apple Mac)

On macOS, the lightweight [Telephone](https://apps.apple.com/us/app/telephone/id406825478?mt=12) app is free and straightforward:

1. Install **Telephone** from the Mac App Store.
2. Open Telephone &rarr; **Preferences &rarr; Accounts &rarr; +**:
   - **Full Name**: Your Name
   - **Domain**: `sip.yourdomain.com:5060`
   - **User Name**: Your Extension
   - **Password**: Your SIP Secret
3. Check **Use this account**. Once registered, the status bar will display **Available**:

<div style="text-align: center; margin: 1.5rem 0;">
  <img src="{{ '/assets/img/client-telephone-2.png' | relative_url }}" alt="Telephone App Connected" style="max-width: 320px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-md);">
  <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
    <em>Telephone App showing "Available" state on macOS.</em>
  </div>
</div>

---

## 4. Windows & Linux Desktop

For Windows or Linux workstations, you can use [Linphone](https://www.linphone.org/) or [Jitsi Desktop](https://desktop.jitsi.org/):

1. Download and run the installer for your operating system.
2. Select **Add a SIP Account**:
   - **SIP ID**: `1001@sip.yourdomain.com`
   - **Password**: Your SIP Secret
   - **Proxy**: `sip.yourdomain.com:5060`
   - **Transport**: `UDP`

<div style="text-align: center; margin: 1.5rem 0;">
  <img src="{{ '/assets/img/JitsiSIP0.png' | relative_url }}" alt="SIP Setup on Desktop" style="max-width: 440px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-md);">
</div>

---

## 5. Verifying Connection: Asterisk Echo Test

After configuring your softphone client, always verify two-way audio by placing an echo test call:

1. Dial **`*43`** on your softphone dialpad.
2. Speak into your headset or microphone.
3. You should hear your own voice echoed back immediately.
   - If you hear the prompt but not your voice, check microphone permissions.
   - If the call drops after 5 to 30 seconds or there is no audio in either direction, verify your RTP port forwarding (UDP ports `10000-20000`) and STUN/TURN configuration.