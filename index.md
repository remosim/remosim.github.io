---
layout: home
title: "Home"
description: "Open-source remote physical SIM management platform. Keep your SIM cards safely at home, receive SMS & 2FA on Telegram, and make VoIP calls anywhere in the world with zero roaming fees."
---

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-content">
    <div class="hero-badge">
      <i class="fas fa-satellite-dish"></i> Open Source · Self-Hosted Privacy
    </div>
    <h1 class="hero-title">
      Leave your physical SIMs at home. <span class="gradient-text">Roam free anywhere in the world.</span>
    </h1>
    <p class="hero-desc">
      Say goodbye to expensive international roaming surcharges. RemoSIM connects your physical SIM cards to a <strong>Raspberry Pi</strong> using <strong>Huawei USB dongles</strong> and <strong>Asterisk PBX</strong>—delivering your SMS/2FA codes instantly to Telegram and streaming phone calls directly to your browser softphone or smartphone.
    </p>
    <div class="hero-actions">
      <a href="{{ '/hardware' | relative_url }}" class="btn-cta-primary">
        <i class="fas fa-microchip"></i> Hardware Guide
      </a>
      <a href="{{ '/software' | relative_url }}" class="btn-cta-secondary">
        <i class="fas fa-terminal"></i> Server Setup Guide
      </a>
      <a href="{{ '/connect' | relative_url }}" class="btn-cta-secondary">
        <i class="fas fa-phone-alt"></i> Web Softphone
      </a>
    </div>
  </div>
</section>

<!-- Architecture Flow Banner -->
<section class="flow-banner">
  <h2 class="flow-title">RemoSIM Architecture Flow</h2>
  <div class="flow-steps">
    <div class="flow-step-box">
      <div class="flow-step-icon"><i class="fas fa-broadcast-tower"></i></div>
      <div class="flow-step-label">Cellular Network</div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">GSM / 3G / 4G</small>
    </div>
    <div class="flow-arrow"><i class="fas fa-arrow-right"></i></div>
    <div class="flow-step-box">
      <div class="flow-step-icon"><i class="fas fa-sim-card"></i></div>
      <div class="flow-step-label">Huawei Dongles</div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Voice & AT Ports</small>
    </div>
    <div class="flow-arrow"><i class="fas fa-arrow-right"></i></div>
    <div class="flow-step-box">
      <div class="flow-step-icon"><i class="fas fa-server"></i></div>
      <div class="flow-step-label">Raspberry Pi Server</div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Asterisk + chan_dongle</small>
    </div>
    <div class="flow-arrow"><i class="fas fa-arrow-right"></i></div>
    <div class="flow-step-box">
      <div class="flow-step-icon"><i class="fab fa-telegram-plane"></i></div>
      <div class="flow-step-label">Telegram Bot</div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Instant 2FA & SMS</small>
    </div>
    <div class="flow-arrow"><i class="fas fa-arrow-right"></i></div>
    <div class="flow-step-box">
      <div class="flow-step-icon"><i class="fas fa-globe"></i></div>
      <div class="flow-step-label">WebRTC Softphone</div>
      <small style="color: var(--text-muted); font-size: 0.75rem;">Browser / Mobile SIP</small>
    </div>
  </div>
</section>

<!-- Key Feature Cards -->
<section class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fas fa-plane-departure"></i>
    </div>
    <h3 class="feature-title">Zero International Roaming</h3>
    <p class="feature-text">
      Keep your primary physical SIM cards active at domestic rates back home. Travel or relocate worldwide without paying predatory daily roaming passes.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fab fa-telegram"></i>
    </div>
    <h3 class="feature-title">Instant Telegram 2FA & Alerts</h3>
    <p class="feature-text">
      Never get locked out of your bank accounts, government portals, or email services. Incoming SMS verification codes and missed call alerts land directly in your private Telegram chat.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fas fa-headset"></i>
    </div>
    <h3 class="feature-title">WebRTC Browser Softphone</h3>
    <p class="feature-text">
      Make and receive phone calls directly from any web browser using our modern SIP.js client. No complicated app installation required on desktop.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fas fa-mobile-alt"></i>
    </div>
    <h3 class="feature-title">Mobile SIP Client Support</h3>
    <p class="feature-text">
      Connect your smartphone over Wi-Fi/4G using native SIP clients or popular apps like SessionTalk and Zoiper. Answer incoming calls as if you were back home.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fas fa-layer-group"></i>
    </div>
    <h3 class="feature-title">Multi-SIM Scalability</h3>
    <p class="feature-text">
      Manage multiple SIM cards on a single Raspberry Pi. Distribute separate numbers to distinct family members or businesses with dedicated Telegram routing.
    </p>
  </div>

  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fas fa-heartbeat"></i>
    </div>
    <h3 class="feature-title">Auto-Healing & Reliability</h3>
    <p class="feature-text">
      Automated health-check scripts monitor USB modem states, automatically recover dropped dongles via AT commands, and reboot gracefully if connectivity fails.
    </p>
  </div>
</section>

<!-- Quick Start Roadmap -->
<section style="margin-bottom: 3rem;">
  <div style="text-align: center; margin-bottom: 2rem;">
    <h2 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem;">How to Get Started</h2>
    <p style="color: var(--text-muted); font-size: 1.05rem;">Three clear steps from parts to remote cellular connectivity</p>
  </div>

  <div class="row g-4">
    <div class="col-md-4">
      <div class="step-card h-100">
        <div class="step-header">
          <div class="step-number">1</div>
          <h3 class="step-title">Hardware Selection</h3>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Assemble your Raspberry Pi 4, compatible Huawei USB dongles (E173/E1750/E3531), and a certified VL812 chipset powered USB hub.
        </p>
        <a href="{{ '/hardware' | relative_url }}" class="btn-cta-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
          View Hardware Guide &rarr;
        </a>
      </div>
    </div>

    <div class="col-md-4">
      <div class="step-card h-100">
        <div class="step-header">
          <div class="step-number">2</div>
          <h3 class="step-title">Server Installation</h3>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Follow our 6-phase guide to install Asterisk, compile <code>chan_dongle</code>, configure dialplans, and deploy the Telegram SMS bot.
        </p>
        <a href="{{ '/software' | relative_url }}" class="btn-cta-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
          View Software Guide &rarr;
        </a>
      </div>
    </div>

    <div class="col-md-4">
      <div class="step-card h-100">
        <div class="step-header">
          <div class="step-number">3</div>
          <h3 class="step-title">Connect & Dial</h3>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Dial out via WebRTC right in your web browser, or configure SessionTalk/Zoiper on iOS and Android to receive calls anywhere.
        </p>
        <a href="{{ '/connect' | relative_url }}" class="btn-cta-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
          Open Web Softphone &rarr;
        </a>
      </div>
    </div>
  </div>
</section>