---
layout: content
title: "Software"
---
This page shows the steps we use to set up the software for RemoSIM customers. We install Asterisk 18 / FreePBX 16 on Raspbian Bullseye 64bit/32bit [Raspberry PI 4 aarch64/armhf] according to this tutorial.

* TOC 
{:toc}

## Raspbian OS initial upgrade / config

```
sudo apt-get update
sudo apt-get dist-upgrade -y
sudo passwd
su 

# Fix vim
echo "set nocompatible" > /root/.vimrc

# Disable ipv6 if it is causing problems in your network:
echo "net.ipv6.conf.all.disable_ipv6 = 1" >> /etc/sysctl.conf
sysctl -p 

# update localhost to localhost6 for ::1 in /etc/hosts
vi /etc/hosts
```
Install Freepbx / Asterisk dependencies

```
#freepbx installation must be run as root, so login to SSH as root :
sudo passwd
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
service sshd restart

# Install required packages
apt install -y build-essential raspberrypi-kernel-headers apache2 mariadb-server mariadb-client php php-curl php-cli php-mysql php-pear php-gd php-mbstring php-intl php-bcmath curl sox mpg123 lame ffmpeg sqlite3 git unixodbc sudo dirmngr php-ldap nodejs npm pkg-config libicu-dev curl sox libncurses5-dev libssl-dev mpg123 libxml2-dev libnewt-dev sqlite3 libsqlite3-dev pkg-config automake libtool autoconf git unixodbc-dev uuid uuid-dev libasound2-dev libogg-dev libvorbis-dev libicu-dev libcurl4-openssl-dev libical-dev libneon27-dev libsrtp2-dev libspandsp-dev sudo subversion libtool-bin python-dev unixodbc dirmngr sendmail-bin sendmail htop cmake libmariadb-dev-compat nload dnsutils vnstat

# add the following line to [mysqld] section of /etc/mysql/mariadb.conf.d/50-server.cnf
sql_mode=NO_ENGINE_SUBSTITUTION

# restart mariadb
service mariadb restart
```

Download and install Asterisk 20 LTS

```
cd /usr/src
rm -fr asterisk-18-current.tar.gz
wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-18-current.tar.gz
tar xvfz asterisk-18-current.tar.gz
cd asterisk-18.*
contrib/scripts/get_mp3_source.sh
## This line is only needed on rpi 64 bit (arm64)
sed -i contrib/scripts/install_prereq -e "s,i386,armhf,g"
##
contrib/scripts/install_prereq install
./configure --with-pjproject-bundled --with-jansson-bundled
make menuselect.makeopts
menuselect/menuselect --enable app_macro --enable format_mp3 menuselect.makeopts
make
make install
make config
ldconfig
update-rc.d -f asterisk remove

# correct asterisk permissions
useradd -m asterisk
chown asterisk. /var/run/asterisk
chown -R asterisk. /etc/asterisk
chown -R asterisk. /var/{lib,log,spool}/asterisk
chown -R asterisk. /usr/lib/asterisk
rm -rf /var/www/html
mkdir /var/www/html # freepbx reinstall needed

# update apache config
sed -i 's/\(^upload_max_filesize = \).*/\120M/' /etc/php/7.4/apache2/php.ini
sed -i 's/\(^memory_limit = \).*/\1256M/' /etc/php/7.4/apache2/php.ini
sed -i 's/^\(User\|Group\).*/\1 asterisk/' /etc/apache2/apache2.conf
sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf
a2enmod rewrite
systemctl restart apache2
```

Install Freepbx 16

```
# Freepbx 16 requirements
# compile ODBC driver for aarch64
# https://mariadb.com/kb/en/mariadb-connector-odbc/
ver=3.1.17
cd /usr/src
wget https://dlm.mariadb.com/2454036/Connectors/odbc/connector-odbc-$ver/mariadb-connector-odbc-$ver-src.tar.gz
tar -zxvf mariadb-connector-odbc-$ver*
cd mariadb-connector-odbc-$ver*src/
mkdir build
cd build
# RPI 64 bit:
DM_DIR=/usr/lib/aarch64-linux-gnu cmake .. -DCMAKE_BUILD_TYPE=RelWithDebInfo -DCONC_WITH_UNIT_TESTS=Off -DCMAKE_C_FLAGS_RELWITHDEBINFO="-I/usr/include/mariadb -L/usr/lib"
# RPI 32 bit:
DM_DIR=/usr/lib/arm-linux-gnueabihf cmake .. -DCMAKE_BUILD_TYPE=RelWithDebInfo -DCONC_WITH_UNIT_TESTS=Off -DCMAKE_C_FLAGS_RELWITHDEBINFO="-I/usr/include/mariadb -L/usr/lib"
##
make
make install

# Configure ODBC
cat <<EOF > /etc/odbcinst.ini
[MySQL]
Description = ODBC for MySQL (MariaDB)
Driver = /usr/local/lib/mariadb/libmaodbc.so
FileUsage = 1
EOF


cat <<EOF > /etc/odbc.ini
[MySQL-asteriskcdrdb]
Description = MySQL connection to 'asteriskcdrdb' database
Driver = MySQL
Server = localhost
Database = asteriskcdrdb
Port = 3306
Socket = /var/run/mysqld/mysqld.sock
Option = 3
EOF

# Download and install freepbx
cd /usr/src
wget http://mirror.freepbx.org/modules/packages/freepbx/freepbx-16.0-latest.tgz
tar vxfz freepbx-16.0-latest.tgz
touch /etc/asterisk/{modules,cdr}.conf
cd freepbx
./start_asterisk start
./install -n
fwconsole ma disablerepo commercial
fwconsole ma install callrecording core dashboard customappsreg infoservices logfiles pm2 soundlang sipsettings voicemail 
fwconsole ma downloadinstall soundlang
fwconsole reload

cat <<EOF > /etc/systemd/system/freepbx.service
[Unit]
Description=FreePBX VoIP Server
After=mariadb.service
[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/sbin/fwconsole start -q
ExecStop=/usr/sbin/fwconsole stop -q
[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable freepbx --now
```
Installing [chan_dongle](https://github.com/wdoekes/asterisk-chan-dongle)
```
apt-get install usb-modeswitch -y
cd /usr/src
git clone https://github.com/wdoekes/asterisk-chan-dongle
cd asterisk-chan-dongle
./bootstrap
./configure --with-astversion=18.15 --with-asterisk=/usr/src/asterisk-18.15.0/include
make
make install

# chown ttyUSB* devs to asterisk
echo 'KERNEL=="ttyUSB*", GROUP="dialout", OWNER="asterisk"' > /etc/udev/rules.d/50-udev-default.rules

# add pi to asterisk/dialout groups
# vi /etc/group
dialout:x:20:pi
asterisk:x:1001:pi

# Grant access to pi user to run the following command in sudoers
# vi /etc/sudoers.d/pi
pi ALL=(ALL) NOPASSWD:SETENV: /usr/bin/systemctl reboot
pi ALL=(ALL) NOPASSWD:SETENV: /usr/sbin/fwconsole
pi ALL=(ALL) NOPASSWD:SETENV: /usr/sbin/uhubctl

```
Tuning `asterisk`, add the followings to `/etc/asterisk/asterisk.conf`
```
[files]
astctlpermissions=775	; Make asterisk accessible by pi user

[options]
hideconnect=yes 	; Hide messages displayed when a remote console connects and disconnects
```

Adding `pi` user to `asterisk` group to make it accessible for the user, add `pi` to end of the line starting with `asterisk` in `/etc/group`:
```
asterisk:x:1001:pi
```

Misc configuration on Raspberry pi:

```
# Enable swap area on Raspberry 
dd if=/dev/zero of=/swapfile bs=1G count=1
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
# add the following line to /etc/fstab
# vi /etc/fstab
/swapfile swap swap defaults 0 0

# delete journald folder so that it stores logs to RAM to avoid high disk io
rm -fr /var/log/journal

# compile atinout command 
cd /usr/src
wget http://sourceforge.net/projects/atinout/files/v0.9.1/atinout-0.9.1.tar.gz
tar -zxvf atinout*.gz
cd atinout-0.9.1
sed -i Makefile -e "s,-Werror,,g"
make
make install
mkdir /scripts

# add this script to send commands to all dongles {0..4} , 4 should be replaced by the number of dongles you have minus one
# vi /scripts/at
#!/bin/bash

dataports=`for i in {0..4}; do asterisk -rx "dongle show device state dongle$i" | grep "Device\|USB" | grep Data | awk '{print $3}'; done`

for data in $dataports; do
	echo "$1" | timeout 1 atinout - $data - 2>&1
done

# add this script to remove all sms messages from sim cards / dongles : 
# vi /scripts/deletesms.sh
#!/bin/bash
# Storage types: https://www.developershome.com/sms/cpmsCommand.asp
# Reading commands: https://www.developershome.com/sms/cmgrCommand2.asp
# Delivery reports: https://stackoverflow.com/questions/18251903/how-to-handle-delivery-report-in-gsm-modem
/scripts/at AT+CPMS=\"SR\",\"SR\",\"SR\"
/scripts/at AT+CMGD=1,4
/scripts/at AT+CPMS=\"MT\",\"MT\",\"MT\"
/scripts/at AT+CMGD=1,4
/scripts/at AT+CPMS=\"ME\",\"ME\",\"ME\"
/scripts/at AT+CMGD=1,4
/scripts/at AT+CPMS=\"SM\",\"SM\",\"SM\"
/scripts/at AT+CMGD=1,4

# The following script can be used to monitor your local VPN network (10.0.1.1 here)  and restart the vpn service (wireguard in this example) if the connection was not available. 
# vi /scripts/nointernet.sh
#!/bin/bash
if ping -c 1 10.0.1.1 &> /dev/null
then
  echo 1
else
  echo 0
  /bin/systemctl restart wg-quick@wg0
  /bin/systemctl restart wg-quick@wg1
  sleep 5
  /scripts/tg.py --sender 'System' --dongle 'system' --destination 'system' --message "There was no internet connection, the VPN service was restarted"

fi

# The following scripts can be used to monitor number of dongles you have ( here 5 ) and restart them if they were disconnected
# vi /scripts/down.sh
#!/bin/bash
numdongles=5
downs=$(/usr/sbin/asterisk -rx "dongle show devices" | grep "Not connec\|GSM not\|Unknown" | awk '{print $1}')
now=$(date +'%m-%d-%Y')

# reset down dogles
for down in $downs; do
        /scripts/tg.py --sender 'system' --dongle 'system' --destination 'system' --message "dongle $down was down and it was reset";
        /usr/sbin/asterisk -rx "dongle reset $down";
#        /usr/sbin/asterisk -rx "dongle restart now $down";
done

# need to reset raspberry if all dongles are in Not connected state :
downs=$(/usr/sbin/asterisk -rx "dongle show devices" | grep "Not connec" | awk '{print $1}' | wc -l)
if [ $downs -eq $numdongles ]; then
        /scripts/tg.py --sender 'system' --dongle 'system' --destination 'system' --message "all donlges were down and the pi was restarted";
        /bin/dmesg > /scripts/log/dmesg-$now.txt
        /scripts/restart.sh
fi

# need to reset raspberry if one of dongles is disconnected
notconnected=$(/usr/bin/lsusb | grep Huawei | wc -l)
if [ $notconnected -ne $numdongles ]; then
        /scripts/tg.py --sender 'system' --dongle 'system' --destination 'system' --message "one of dongles was not listed in lsusb and the dongle was restarted";
        /bin/dmesg > /scripts/log/dmesg-$now.txt;
        /scripts/restart.sh
fi


# make them executable
chmod +x /scripts/at
chmod +x /scripts/deletesms.sh
chmod +x /scripts/down.sh
chmod +x /scripts/nointernet.sh

# add the following cron jobs to keep raspberrypi updated
crontab -e
# 
0 14 * * * apt-get update && apt-get dist-upgrade -y
0 17 * * * /usr/sbin/fwconsole ma refreshsignatures && /usr/sbin/fwconsole ma upgradeall
30 17 * * * /usr/sbin/fwconsole setting SIGNATURECHECK 0
30 17 * * * /usr/sbin/fwconsole setting MODULEADMINEDGE 1
0 18 * * * /usr/bin/rpi-eeprom-update -a

# add deletesms.sh to cronjobs to avoid this bug 
# crontab -e
0 */6 * * * /scripts/deletesms.sh
*/5 * * * * /scripts/nointernet.sh
*/10 * * * * /scripts/down.sh
0 * * * * /usr/bin/find /var/log/ -type f -size +500M  -delete
0 * * * * /usr/bin/find /home/ -type f -size +500M  -delete
* * * * * /scripts/tg.py

# Adding a useful alias command: s
# typing s in shell would show status of all dongles with a refresh rate of 1 second:
# vi ~/.bashrc
alias s="watch -n1 'asterisk -rx \"dongle show devices\";asterisk -rx \"sip show peers\"'"
```
Telegram API:

```
# The following python packages are needed:
pip3 install -U pip PySocks python-telegram-bot
apt-get install uhubctl

# vi /scripts/tg.py
#!/usr/bin/python3
# -*- coding: utf-8 -*-
# pip3 install -U pip PySocks python-telegram-bot
# apt-get install uhubctl
print("tg.py $sender $dongle $dest $message")
import sys, time, subprocess, pickle, os
now = time.strftime("%Y-%m-%d %H:%M:%S")

# set global proxy for telegram if needed
# os.environ["HTTPS_PROXY"] = "socks5h://127.0.0.1:1080/"

if len(sys.argv) > 1:
	sender=sys.argv[2]
	dongle=sys.argv[4]
	dest=sys.argv[6]
	message=sys.argv[8]
else:
	sender, dongle, dest = False, False, False
	message = []

blacklist = [
	"spam content 1",
	"spam content 2",
]

both_token = 'TELEGRAM BOT API TOKEN'

if any(b in message for b in blacklist):
	sys.exit()

receiver = False
chatid="-AdminChatID"
if dongle=="dongle0":
	receiver = "Dongle0Owner"
	chatid="TGOwner0ChatID"
elif dongle=="dongle1":
        receiver = "Dongle0Owner"
        chatid="TGOwner1ChatID"
elif dongle=="system":
	receiver = "System"
	chatid="-AdminChatID"

# telegram functions
def post_event_on_telegram(tgmessage):
	#
	import telegram # this is from python-telegram-bot package
	from telegram.ext import Defaults
	from telegram.utils.request import Request
	request = Request(connect_timeout=3,read_timeout=5)
	bot = telegram.ext.ExtBot(token=both_token,request=request, defaults=Defaults(timeout=5))
	# some customization here if you have a camera at parking perhaps
	if dongle == "parking":
		bot.send_photo(chat_id=chatid, photo=tgmessage, caption="Parking at " + now)
		return true
	try:
		bot.send_message(chat_id=chatid,text=tgmessage, parse_mode=telegram.ParseMode.HTML, disable_web_page_preview=True, timeout=5)
	except telegram.error.BadRequest:
		bot.send_message(chat_id=chatid,text=tgmessage, disable_web_page_preview=True, timeout=5)
	except:
		# Save the message for trying to send later
		with open('/scripts/data/sms-'+str(round(time.time() * 1000)), 'wb+') as f:
			pickle.dump([chatid, tgmessage],f)

if receiver:
	post_event_on_telegram("<b>SIM</b>: {}\n\n<b>Sender</b>: {}\n\n<b>Content:</b>\n{}".format(receiver, sender, message))

if dongle=="dongle2":
	# Send SMS to dongle2 owner if it is from a specific sender
	if sender in ["Content Required to be fouind in the text", "+124312312"] :
		print(subprocess.run(["/usr/sbin/asterisk", "-rx", "dongle sms dongle2 +112121212 {}".format(message) ])  )

if dongle=="jitsi" or dongle=="parking":
	chatid = dest 
	post_event_on_telegram(message)

import glob
texts = glob.glob("/scripts/data/*")
for text in texts:
	with open(text, 'rb') as f:
		chatid, tgmessage = pickle.load(f)
	#
	import telegram # this is from python-telegram-bot package
	from telegram.ext import Defaults
	from telegram.utils.request import Request
	request = Request(connect_timeout=3,read_timeout=5)
	bot = telegram.ext.ExtBot(token=both_token,request=request, defaults=Defaults(timeout=5))
	#
	bot.send_message(chat_id=chatid,text=tgmessage, parse_mode=telegram.ParseMode.HTML, disable_web_page_preview=True, timeout=5)
	os.remove(text)

# and make it executable
chmod +x /scripts/tg.py
```
Finally, you need to have access to the internet plan you use remotely to check the remaining amount of your internet package and recharge it if needed.


## Asterisk Config Check list
Disable ipv6 on the server /etc/sysctl.conf

```
net.ipv6.conf.all.disable_ipv6 = 1
```
Update localhost in the hosts file to point to ipv4 only

```
127.0.0.1	localhost
::1		localhost6 ip6-localhost ip6-loopback
```
Asterisk Settings:

- Ringtime Default: 90
- SIP Channel Driver: SIP
- RSS Feeds: None
- Browser Stats: No

For Websocket connections:

- Enable the mini-HTTP Server: Yes
- Set HTTP Bind Address and Port, and setup nginx upgrade rules
- HTTP Prefix: Your prefix of choice e.g. mysecureprefix

```
  location /mysecureprefix {
    # prevents 502 bad gateway error
    proxy_buffers 8 32k;
    proxy_buffer_size 64k;

    proxy_pass http://YourAsteriskIP:HTTPBindPort;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #proxy_set_header X-NginX-Proxy true;

    # enables WS support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_read_timeout 999999999;
  }
```
Asterisk SIP Settings for Websocket:

- Media Transport Settings STUN Server Address: stun.l.google.com:19302
- TURN Server Address: turnserver.yourdomain.com:turnport
- TURN Server Username: turnusername
- TURN Server Password: turnpassword
- Codecs: opus, ulaw, alaw
- PJSIP settings: ws: enable

Asterisk SIP Settings:

- External Address: According to the Welcome Email
- RTP Port Range: According to the Welcome Email
- SIP Legacy -> Bind Port: According to the Welcome Email

Application Extensions:

- Create extensions you want
- For each extension -> Advanced -> Optional Destinations -> Not Reachable: Redirect the extension to itself. This is required to beep and not hang the incoming calls when the extension is unreachable

Connectivity -> Trunks -> Add Trunk -> Custom Trunk:

- TrunkName: UserGSM
- Outbound CallerID: Phone Number
- Custom Settings -> Custom Dial String: dongle/dongle0/$OUTNUM$

Connectivity -> Outbound Routes -> Add Outbound route:

- Route Name: User
- Trunk Sequence for Matched Routes: Select Trunk related to the user
- Dial Pattern:
-- Prefix: CODE*
-- Match Pattern: .

Connectivity -> Inbound Routes -> Add Inbound Route:

- Description: User
- DID Number: Phone Number
- Set destination: Extensions -> Choose the corresponding extension

The default dongle.conf in /etc/asterisk

```
[general]

interval=15			; Number of seconds between trying to connect to devices
smsdb=/var/lib/asterisk/smsdb
csmsttl=600

;------------------------------ JITTER BUFFER CONFIGURATION --------------------------
;jbenable = yes			; Enables the use of a jitterbuffer on the receiving side of a
				; Dongle channel. Defaults to "no". An enabled jitterbuffer will
				; be used only if the sending side can create and the receiving
				; side can not accept jitter. The Dongle channel can't accept jitter,
				; thus an enabled jitterbuffer on the receive Dongle side will always
				; be used if the sending side can create jitter.

;jbforce = no			; Forces the use of a jitterbuffer on the receive side of a Dongle
				; channel. Defaults to "no".

;jbmaxsize = 200		; Max length of the jitterbuffer in milliseconds.

;jbresyncthreshold = 1000	; Jump in the frame timestamps over which the jitterbuffer is
				; resynchronized. Useful to improve the quality of the voice, with
				; big jumps in/broken timestamps, usually sent from exotic devices
				; and programs. Defaults to 1000.

;jbimpl = fixed			; Jitterbuffer implementation, used on the receiving side of a Dongle
				; channel. Two implementations are currently available - "fixed"
				; (with size always equals to jbmaxsize) and "adaptive" (with
				; variable size, actually the new jb of IAX2). Defaults to fixed.

;jbtargetextra = 40		; This option only affects the jb when 'jbimpl = adaptive' is set.
				; The option represents the number of milliseconds by which the new jitter buffer
				; will pad its size. the default is 40, so without modification, the new
				; jitter buffer will set its size to the jitter value plus 40 milliseconds.
				; increasing this value may help if your network normally has low jitter,
				; but occasionally has spikes.

;jblog = no			; Enables jitterbuffer frame logging. Defaults to "no".
;-----------------------------------------------------------------------------------

[defaults]
; now you can set here any not required device settings as template
;   sure you can overwrite in any [device] section this default values

context=dongle-incoming		; context for incoming calls
group=0				; calling group
rxgain=0			; increase the incoming volume; may be negative
txgain=0			; increase the outgoint volume; may be negative
autodeletesms=yes		; auto delete incoming sms
resetdongle=yes			; reset dongle during initialization with ATZ command
u2diag=-1			; set ^U2DIAG parameter on device (0 = disable everything except modem function) ; -1 not use ^U2DIAG command
usecallingpres=yes		; use the caller ID presentation or not
callingpres=allowed_passed_screen ; set caller ID presentation		by default use default network settings
disablesms=no			; disable of SMS reading from device when received
				;  chan_dongle has currently a bug with SMS reception. When a SMS gets in during a
				;  call chan_dongle might crash. Enable this option to disable sms reception.
				;  default = no

language=en			; set channel default language
mindtmfgap=45			; minimal interval from end of previews DTMF from begining of next in ms
mindtmfduration=80		; minimal DTMF tone duration in ms
mindtmfinterval=200		; minimal interval between ends of DTMF of same digits in ms

callwaiting=auto		; if 'yes' allow incoming calls waiting; by default use network settings
				; if 'no' waiting calls just ignored
disable=no			; OBSOLETED by initstate: if 'yes' no load this device and just ignore this section

initstate=start			; specified initial state of device, must be one of 'stop' 'start' 'remote'
				;   'remove' same as 'disable=yes'

exten=+1234567890		; exten for start incoming calls, only in case of Subscriber Number not available!, also set to CALLERID(ndid)

dtmf=off			; control of incoming DTMF detection, possible values:
				;   off	   - off DTMF tones detection, voice data passed to asterisk unaltered
				;              use this value for gateways or if not use DTMF for AVR or inside dialplan
				;   inband - do DTMF tones detection
				;   relax  - like inband but with relaxdtmf option
				;  default is 'relax' by compatibility reason

; dongle required settings
[dongle0]
;audio=/dev/ttyUSB1		; tty port for audio connection; 	no default value
;data=/dev/ttyUSB2		; tty port for AT commands; 		no default value

; or you can omit both audio and data together and use imei=123456789012345 and/or imsi=123456789012345
;  imei and imsi must contain exactly 15 digits !
;  imei/imsi discovery is available on Linux only
;imei=123456789012345
;imsi=123456789012345

; if audio and data set together with imei and/or imsi audio and data has precedence
;   you can use both imei and imsi together in this case exact match by imei and imsi required

; USER0
[dongle0]
imei=123456789


; USER1
[dongle1]
imei=112233445566

; USER2
[dongle2]
imei=111333222444

; USER3
[dongle3]
imei=1221112221112
```
The following code should also be added to `/etc/asterisk/extensions_custom.conf` for context=dongle-incoming that was used above

```
[dongle-incoming]
exten => sms,1,Set(who=${SHELL(/scripts/who.sh ${DONGLENAME})})
exten => sms,n,System(echo '${STRFTIME(${EPOCH},,%Y-%m-%d %H:%M:%S)} - ${DONGLENAME} - ${CALLERID(num)}: ${BASE64_DECODE(${SMS_BASE64})}' >> /var/log/asterisk/sms.txt)
; exten => sms,n,System(echo '${BASE64_DECODE(${SMS_BASE64})}' | mail --content-type 'text/plain${SPRINTF(%c,59)} charset=utf-8' -r 'VOIP Server ${SPRINTF(%c,60)}sms@mydomain.com${SPRINTF(%c,62)}' -s 'New SMS: ${CALLERID(num)} @${DONGLENAME}' ${who})
exten => sms,n,System(/scripts/tg.py --sender '${CALLERID(num)}' --dongle '${DONGLENAME}' --destination '${who}' --message '${BASE64_DECODE(${SMS_BASE64})}')
exten => sms,n,Hangup()

exten => ussd,1,Set(type=${USSD_TYPE})
exten => ussd,n,Set(typestr=${USSD_TYPE_STR})
exten => ussd,n,Set(ussd=${USSD})
exten => ussd,n,Set(ussd_multiline=${BASE64_DECODE(${USSD_BASE64})})
exten => ussd,n,Verbose(2, Incoming USSD: ${ussd_multiline})
exten => ussd,n,System(echo '${STRFTIME(${EPOCH},,%Y-%m-%d %H:%M:%S)} - ${DONGLENAME}: ${ussd_multiline}' >> /var/log/asterisk/ussd.txt)
exten => ussd,n,Hangup()

exten => _.,1,Set(CALLERID(name)=${CALLERID(num)})
exten => _.,n,GotoIf($["${CHANNEL(state)}" = "Ring"]?call)
exten => _.,n,Goto(from-trunk,${EXTEN},1)
exten => _.,n(call),Set(who=${SHELL(/scripts/who.sh ${DONGLENAME})})
exten => _.,n,System(echo '${STRFTIME(${EPOCH},,%Y-%m-%d %H:%M:%S)} - ${DONGLENAME} - ${CALLERID(num)}' >> /var/log/asterisk/call.txt)
exten => _.,n,System(/scripts/tg.py --sender '${DONGLENAME}' --dongle '${DONGLENAME}' --destination '${who}' --message 'Incoming call from ${CALLERID(num)}')
exten => _.,n,Goto(from-trunk,${EXTEN},1)

[from-dongle]
; This will be executed by an indbound Dongle channel ( call initiated on the dongle side )
exten => _[+0-9].,1,Dial(SIP/bob,b(from-dongle^outbound^1)) ;

; This will be executed by an outbound SIP channel ( channel generated by dial )
exten => outbound,1,Set(JITTERBUFFER(adaptive)=default)
same => n,Set(AGC(rx)=4000)
same => n,Return()

[from-sip]
; This will be executed by an inbound SIP channel ( call initiated on the SIP side )
exten => _[+0-9].,1,Set(JITTERBUFFER(adaptive)=2000,1600,120)
same => n,Set(AGC(rx)=4000)
same => n,Dial(Dongle/i:${IMEI_OF_MY_DONGLE}/${NUMBER_OF_BOB}) 

; Edit the extension for destination calls, and redirect it to itself upon Not Reachable condition
; in the Advanced tab, this will avoid hanging up the call if the extension was not reachable
; note that incoming calls also require callrecording module for freepbx
```
We have used /scripts/who.sh to assign emails to dongles in the above code, and `/scripts/tg.py` to post messages to Telegram using Telegram API

`/scripts/who.sh`
```
#!/bin/bash
key="$1"
case $key in
	dongle4)
	echo -n "user4email@gmail.com"
	;;
	dongle3)
	echo -n "user3email@gmail.com"
	;;
	dongle2)
	echo -n "user2email@gmail.com"
	;;
	dongle1)
	echo -n "user1email@gmail.com"
	;;
	dongle0)
	echo -n "user0email@gmail.com"
	;;
esac
```
make it executable

```
chmod +x /scripts/who.sh
```
`/scripts/tg.py`
```
#!/usr/bin/python3
# -*- coding: utf-8 -*-
# pip3 install -U pip PySocks python-telegram-bot
# apt-get install uhubctl
print("tg.py $sender $dongle $dest $message")
import sys, time, subprocess, pickle, os
now = time.strftime("%Y-%m-%d %H:%M:%S")

if len(sys.argv) > 1:
	sender=sys.argv[2]
	dongle=sys.argv[4]
	dest=sys.argv[6]
	message=sys.argv[8]
else:
	sender, dongle, dest = False, False, False
	message = []

blacklist = [
	"SpamText1",
	"SpamText2",
	"SpamText3",
]

both_token = 'XXX' # Your Telegram Token

if any(b in message for b in blacklist):
	sys.exit()

receiver = False
chatid="-428183725"
if dongle=="dongle0":
	receiver = "User0 Name"
	chatid="User0ChatID"
elif dongle=="dongle1":
	receiver = "User1 Name"
	chatid="User1ChatID"
elif dongle=="dongle2":
	receiver = "User2 Name"
	chatid="User2ChatID"

# set global proxy for telegram
#os.environ["HTTPS_PROXY"] = "socks5h://YourSocks5ProxyIP:Port/"

# telegram functions
def post_event_on_telegram(tgmessage):
	#
	import telegram # this is from python-telegram-bot package
	from telegram.ext import Defaults
	from telegram.utils.request import Request
	request = Request(connect_timeout=3,read_timeout=5)
	bot = telegram.ext.ExtBot(token=both_token,request=request, defaults=Defaults(timeout=5))
	#
	try:
		bot.send_message(chat_id=chatid,text=tgmessage, parse_mode=telegram.ParseMode.HTML, disable_web_page_preview=True, timeout=5)
	except telegram.error.BadRequest:
		bot.send_message(chat_id=chatid,text=tgmessage, disable_web_page_preview=True, timeout=5)
	except:
		# Save the message for trying to send later
		with open('/scripts/data/sms-'+str(round(time.time() * 1000)), 'wb+') as f:
			pickle.dump([chatid, tgmessage],f)

if receiver:
	post_event_on_telegram("<b>Dongle</b>: {}\n\n<b>Sender</b>: {}\n\n<b>Text:</b>\n{}".format(receiver, sender, message))


import glob
texts = glob.glob("/scripts/data/*")
for text in texts:
	with open(text, 'rb') as f:
		chatid, tgmessage = pickle.load(f)
	#
	import telegram # this is from python-telegram-bot package
	from telegram.ext import Defaults
	from telegram.utils.request import Request
	request = Request(connect_timeout=3,read_timeout=5)
	bot = telegram.ext.ExtBot(token=both_token,request=request, defaults=Defaults(timeout=5))
	#
	bot.send_message(chat_id=chatid,text=tgmessage, parse_mode=telegram.ParseMode.HTML, disable_web_page_preview=True, timeout=5)
	os.remove(text)
```
```
chmod +x /scripts/tg.py
```
