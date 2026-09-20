---
layout: content
title: "Hardware Guide"
description: "Hardware specifications, supported Huawei USB dongles, powered USB hub compatibility, and VL812 chipset requirements for RemoSIM."
---

# Hardware Requirements

RemoSIM combines a Raspberry Pi with cellular USB modems (dongles) to interface with physical SIM cards. Selecting the correct hardware—especially the **USB Hub chipset**—is essential for reliable 24/7 operation.

---

## 1. Hardware Checklist

| Item | Component | Specification | Estimated Price | Notes |
|:---|:---|:---|:---|:---|
| **1** | **Raspberry Pi** | Raspberry Pi 4B (2GB, 4GB, or 8GB) | ~$45 – $75 | 4GB RAM recommended for compiling Asterisk and FreePBX. |
| **2** | **Cellular Dongles** | **Huawei 3G/4G USB Dongles** (Voice-enabled) | ~$20 – $40 each | Models with `chan_dongle` voice/audio & AT port support. |
| **3** | **Powered USB Hub** | **TP-Link UH700 or UH720** (VL812 chipset) | ~$30 – $45 | **Mandatory** when using 2 or more dongles to prevent USB bus drops. |
| **4** | **Power Supply** | Official 15W USB-C Power Adapter | ~$10 – $15 | Stable 5.1V / 3.0A power prevents under-voltage throttling. |
| **5** | **MicroSD Card** | 32GB+ SanDisk Extreme or Samsung EVO Plus | ~$10 – $15 | High random-write performance for Asterisk CDR and logs. |
| **6** | **Cooling Case** | Aluminum Case or Heatsink + 5V Fan | ~$8 – $15 | Maintains low temperatures during sustained compilations and calls. |

---

## 2. Supported Cellular USB Dongles

RemoSIM relies on the open-source [`asterisk-chan-dongle`](https://github.com/wdoekes/asterisk-chan-dongle) channel driver. The dongle must support both AT modem commands and USB audio streaming (voice enabled).

### Recommended Huawei Models:
- **Huawei E173 / E173u** (Classic, highly stable voice support)
- **Huawei E1750 / E1752**
- **Huawei E3531** (Requires stick mode / non-HiLink firmware)
- **Huawei E3131** (Voice enabled)
- **Huawei K3765 / K3770**

<div class="callout callout-warning">
  <div class="callout-title"><i class="fas fa-exclamation-triangle"></i> Avoid HiLink Firmware</div>
  <p>Ensure your Huawei dongle runs in <strong>Modem/Serial (Stick) mode</strong>, exposing multiple <code>/dev/ttyUSB*</code> ports (one for audio, one for AT data). Dongles with <em>HiLink</em> firmware present themselves as virtual Ethernet cards (RNDIS/web router mode) and do not support direct Asterisk voice channels unless re-flashed.</p>
</div>

---

## 3. Powered USB Hubs & The VL812 Chipset

Cellular modems draw significant transient current spikes (up to 1.5A–2.0A) when negotiating network signals with cellular towers. The Raspberry Pi's onboard USB bus cannot reliably power multiple cellular transmitters at once without brownouts.

<div class="callout callout-tip">
  <div class="callout-title"><i class="fas fa-microchip"></i> Why the VIA VL812 Chipset is Essential</div>
  <p>Through extensive testing with multi-dongle setups, we found that USB hubs powered by the <strong>VIA VL812 chipset</strong> (found in the <strong>TP-Link UH700</strong> and <strong>TP-Link UH720</strong>) properly handle the multi-interface USB packet timing required by Huawei modems without dropping devices off the bus.</p>
</div>

### Tested USB Hub Compatibility Matrix

| Hub Manufacturer | Model | Chipset | Multi-Dongle Compatibility |
|:---|:---|:---|:---|
| **TP-Link** | **UH700** (v3 recommended) | **VIA VL812** | <span class="badge-pill badge-success"><i class="fas fa-check"></i> Fully Compatible</span> |
| **TP-Link** | **UH720** (v3 recommended) | **VIA VL812** | <span class="badge-pill badge-success"><i class="fas fa-check"></i> Fully Compatible</span> |
| **D-Link** | DUB-1370 | Realtek | <span class="badge-pill badge-neutral">Partially Compatible (max 2 dongles)</span> |
| **D-Link** | DUB-H7 | NEC / Terminus | <span class="badge-pill badge-danger"><i class="fas fa-times"></i> Incompatible</span> |
| **Transcend** | TS-HUB3K | Genesis Logic | <span class="badge-pill badge-danger"><i class="fas fa-times"></i> Incompatible</span> |
| **Orico** | MH4U-U3 | RTS5401 | <span class="badge-pill badge-danger"><i class="fas fa-times"></i> Incompatible</span> |

### Identifying an Incompatible Hub in `dmesg`
When using an incompatible or under-powered USB hub, you will observe the following error codes in the system kernel log (`dmesg`):

```text
usb 1-2-port2: Cannot enable. Maybe the USB cable is bad?
usb 1-2.2: device not accepting address 15, error -71
usb 1-2.2: device descriptor read/64, error -71
```

<div style="text-align: center; margin: 1.5rem 0;">
  <img src="{{ '/assets/img/Incompatible-USB-Hub.png' | relative_url }}" alt="Incompatible USB Hub dmesg output" style="max-width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-md);">
  <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
    <em>Kernel dmesg log displaying error -71 when an incompatible USB hub resets Huawei dongles.</em>
  </div>
</div>

---

## Next Step: Software & Server Setup
Once you have your Raspberry Pi, Huawei modems, and powered hub connected, proceed to the [Software Setup Guide]({{ '/software' | relative_url }}) to install Asterisk, `chan_dongle`, and the Telegram SMS bot.