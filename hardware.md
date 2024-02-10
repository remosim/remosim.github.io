---
layout: content
title: "Hardware"
---
The following products are required to run RemoSIM software.

|\#|Product Name|Price|Shopping Link|
|:----|:----|:----|:----|
|1|Raspberry Pi 4Bwith at least 4GB of RAM(Amazon links includes the whole bundle i.e. Raspberry PI Power adapter, Samsung microSDXC card, Fan, Case, microHDMI to HDMI cable, microSDXC Reader)|~150$|[Amazon USA](https://www.amazon.com/dp/B08B6G2RFG/)[Amazon Canada](https://www.amazon.ca/dp/B09Q4TQBSZ/)[Digikala](https://www.digikala.com/product/dkp-2023121/)|
|2|32G+ SanDisk Extreme MicroSDXCor32G+ Samsung Evo+ MicroSD card|~8$|[Digikala](https://www.digikala.com/search/category-memory-cards/sandisk/?types[0]=6522&attributes[3877][0]=24597) Sandisk[Digikala](https://www.digikala.com/search/category-memory-cards/samsung/?types[0]=6522&attributes[3877][0]=24597) Samsung|
|3|Raspberry Pi 15W USB-C Power Supply|~10$|[](https://www.digikala.com/product/dkp-6543154)[Bir-Robotic](https://www.digikala.com/product/dkp-6543154)|
|4|K-Net Plus Micro HDMI to HDMI 2.0 cable|~8$|[Digikala](https://www.digikala.com/product/dkp-795389/)|
|5|Raspberry 4 Case|~4$|[Digikala](https://www.digikala.com/product/dkp-2158556/)|
|6|TP-Link UH-700 or UH-720or D-Link DUB-1370|~80$|[Digikala UH700](https://www.digikala.com/product/dkp-68716/)[Digikala UH720](https://www.digikala.com/product/dkp-2052978/)[Digikala DUB-1370](https://www.digikala.com/product/dkp-1569587)|
| |Total|300$| |

A Huawei dongle supported by Asterisk is required. A list of supported dongles can be found at [wdoekes asterisk-chan-dongle repository](https://github.com/wdoekes/asterisk-chan-dongle).

A powered USB hub is only required if you want to connect 2 or more dongles.

# Compatible USB hubs
Not all USB hubs work with Huawei USB dongles. Here are a list of tested USB hubs:

|Hub Brand|Model|Compatible|
|:----|:----|:----|
|D-Link|DUB-H7|[Not compatible](https://www.dlink.com/en/products/dub-h7-7-port-usb-20-hub) ❌|
|TP-Link|UH700(v3 recommended)|[Compatible](https://www.tp-link.com/uk/home-networking/computer-accessory/uh700/) ✅|
|TP-Link|UH720(v3 recommended)|[Compatible](https://www.tp-link.com/uk/home-networking/computer-accessory/uh720/) ✅|
|Transcend|TS-HUB3K|[Not Compatible](https://www.transcend-info.com/Products/No-402) ❌|
|Orico|MH4U-U3|[ Not Compatible](https://www.orico.cc/usmobile/product/detail/id/3307) ❌|

TP-Link USB hub uses VL812 chip which might be the reason why its compatible with Huawei dongles. There are [some other hubs](https://www.google.com/search?q=site%3Aorico.cc+VL812) with this chipset which can be tested to confirm this.

You will see the following errors in dmesg when using an incompatible hub with Huawei USB dongles :

```
usb 1-2-port2: Cannot enable. Maybe the USB cable is bad?
usb 1-2.2: device not accepting address 15, error -71
usb 1-2.2: device descriptor read/64, error -71
```

|![Incompatible USB Hub](/assets/img/Incompatible-USB-Hub.png)|
|:--:| 
|*dmesg output when using USB dongles with an incompatible USB hub*|