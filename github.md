---
layout: content
title: "GitHub & Open Source"
description: "RemoSIM is open-source. Explore the repositories, report issues, and contribute to the project."
---

# GitHub & Open Source

RemoSIM is entirely open-source. All documentation, setup configurations, watchdog scripts, and notification tools are publicly available on GitHub.

---

## Repositories

<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fab fa-github"></i>
    </div>
    <h3 class="feature-title">RemoSIM Website & Docs</h3>
    <p class="feature-text">
      Source code for the official documentation, hardware testing reports, and softphone guides.
    </p>
    <div style="margin-top: 1rem;">
      <a href="https://github.com/remosim/remosim.github.io" target="_blank" rel="noopener noreferrer" class="btn-cta-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
        <i class="fab fa-github"></i> Repository &rarr;
      </a>
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon-wrapper">
      <i class="fas fa-satellite-dish"></i>
    </div>
    <h3 class="feature-title">chan_dongle Driver</h3>
    <p class="feature-text">
      The open-source Asterisk channel driver for Huawei 3G/4G USB cellular modems.
    </p>
    <div style="margin-top: 1rem;">
      <a href="https://github.com/wdoekes/asterisk-chan-dongle" target="_blank" rel="noopener noreferrer" class="btn-cta-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
        <i class="fab fa-github"></i> Driver Repo &rarr;
      </a>
    </div>
  </div>
</div>

---

## How to Contribute

We welcome community contributions:
1. **Tested Modems & Hubs**: If you test a new USB dongle model or powered USB hub with Asterisk `chan_dongle`, open a PR to update our [Hardware Guide]({{ '/hardware' | relative_url }}).
2. **Watchdog & Scripts**: Enhance the `/scripts/down.sh` or `/scripts/tg.py` auto-healing scripts.
3. **Bug Reports**: Open an issue on our [GitHub tracker](https://github.com/remosim/remosim.github.io/issues) to report bugs or ask questions.