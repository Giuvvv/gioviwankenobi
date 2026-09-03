---
title: "Privacy policy"
updated: 2026-09-01
version: "1.0"
intro: "How Alba handles your data. Provided under Articles 13 and 14 of Regulation (EU) 2016/679 (GDPR)."
isPlaceholder: false
---
## In short

- Alba runs on your phone: your food diary, weight, water, recipes and goals stay in a local database.
- There is no account and no Alba server: the person who writes the app cannot see your data.
- No advertising, no tracking, no profiling, no selling or sharing of data.
- Online product search starts switched off: it runs only if you choose to turn it on, and you can turn it off at any time.
- You can export everything to a readable file and erase everything from inside the app, whenever you want, without asking anyone.

<span id="controller"></span>

## Who handles your data

The data controller is <strong>Giovan Battista Lo Buglio</strong> (independent developer, also known as <em>gioviwankenobi</em>), 90011 Bagheria (PA), Italy.

For any question about this policy, or to exercise your rights, write to <a href="mailto:info@gioviwankenobi.com">info@gioviwankenobi.com</a>.

Alba is a personal project rather than a business: it is free, carries no advertising and has no in-app purchases. No Data Protection Officer has been appointed, as the conditions of Article 37 GDPR do not apply.

<span id="how-it-works"></span>

## How Alba works, in one sentence

Alba saves everything you record in a database <strong>on your own device</strong> (SQLite, inside the app's private storage). There is no Alba server for the data to be sent to, no backup managed by us, and no account to recover it from.

<aside class="callout" data-kind="info">
<p class="callout__title">What that means in practice</p>
<p>The controller has no technical access to your diary, your weight or your recipes. We cannot read them, correct them or delete them for you — but you can do all of that yourself, inside the app, as described below.</p>
</aside>

<span id="data"></span>

## What data the app handles, and where it stays

| Category | Data | Where it is handled | For how long |
| --- | --- | --- | --- |
| Profile and preferences | Optional name, language, nutrition goals, app preferences, whether onboarding was completed | On the device only | Until you erase it |
| Food diary | Date, meal, food, brand, quantity and the nutrition values recorded | On the device only | Until you erase it |
| Weight and hydration | Weight, unit, date of the measurement, water logged | On the device only | Until you erase it |
| Recipes and planning | Names, ingredients, quantities, servings, planned meals | On the device only | Until you erase it |
| Favourites and usage | Favourite foods, how often they are used, the last quantity entered | On the device only | Until you erase it |
| Online search <em>(only if you enable it)</em> | The text you type from the third character onwards, the language of the request, and ordinary network metadata including your IP address | Sent to <a href="https://world.openfoodfacts.org/" rel="noopener">Open Food Facts</a> | Technical logs kept by Open Food Facts for 3 years |
| Barcode scanning <em>(only if you enable it)</em> | The barcode read by the camera | Sent to <a href="https://world.openfoodfacts.org/" rel="noopener">Open Food Facts</a> | Technical logs kept by Open Food Facts for 3 years |
| Camera | The frames needed to recognise a barcode | Processed on the device, at the moment of the scan | Never saved, never sent |
| Network status and system language | Whether there is a connection, the language set on the phone | On the device only | While you use the app |

Weight, food and hydration can say a great deal about your physical condition and your habits. That is precisely why they stay on your phone and are never transmitted anywhere.

<span id="not-collected"></span>

## What Alba does not do

- It does not ask you to create an account and collects no e-mail addresses, phone numbers or credentials.
- It contains no advertising and no advertising identifier (IDFA, Android Advertising ID).
- It contains no analytics, usage statistics, heat maps or automatic crash reporting.
- It does not track your activity across apps or websites, and never asks for iOS tracking permission.
- It does not access your location, contacts, calendar, files, microphone or photo library.
- It does not sell, rent or share your data with anyone, for any purpose, and does not use it to profile you.
- It makes no automated decisions producing legal effects concerning you.

<span id="purposes"></span>

## Why it handles this data, and on what legal basis

| Processing | Purpose | Legal basis |
| --- | --- | --- |
| Diary, weight, water, recipes, goals and preferences on the device | Giving you the feature you expect from the app: recording what you eat and reading it back | Performance of the contract for the use of the app (Art. 6(1)(b) GDPR). To the extent that this data reveals your physical condition, it is processed entirely under your own control, on your own device, on the basis of the explicit consent you give by choosing to enter it (Art. 9(2)(a) GDPR) |
| Online product search and barcode scanning | Finding the nutrition values of a packaged product that is not already on your phone | Freely given, specific and revocable consent (Art. 6(1)(a) GDPR). The feature stays off until you turn it on |
| Camera access | Reading a product barcode | Consent, given through the operating system permission and revocable from your phone settings |
| Exporting and erasing data | Letting you exercise your rights yourself, without writing to anyone | Legal obligation of the controller (Art. 6(1)(c) GDPR, in relation to Arts. 15-20) |

<span id="online"></span>

## Online search: how consent works

Alba can look up packaged products in the collaborative <a href="https://world.openfoodfacts.org/" rel="noopener">Open Food Facts</a> database. It is the only moment when anything leaves your phone, and it is an optional feature.

1. On a fresh install, online search is <strong>off</strong>. The app only searches the foods already on your phone.
2. Before the first request is ever sent, Alba shows you who will receive the data and what will be sent.
3. Only if you accept does online search switch on. A request is sent once you have typed at least three characters.
4. You can switch it off whenever you like in <em>Settings → Privacy and data</em>. From that moment no request is sent and the temporary result cache is cleared.

Requests never carry your name, your goals, your weight or the contents of your diary. What is sent is the text you typed, or the barcode, and nothing else. Every request travels over HTTPS.

If you pick a product found online, its nutrition values are saved into the local database on your phone, so next time you will find them again even without a connection.

<span id="camera"></span>

## The camera

The camera serves exactly one purpose: recognising a product barcode. Permission is requested only when you open the scanner, never at launch, and only after you have enabled online search.

<strong>No image is saved, stored or sent.</strong> Frames are processed on the device for the duration of the scan. Alba never requests microphone permission and records no audio.

<span id="recipients"></span>

## Who receives the data

There is a single external recipient, and only if you enable online search.

| Recipient | Data received | Role | Details |
| --- | --- | --- | --- |
| Open Food Facts | Search text or barcode, the language of the request, IP address and technical connection metadata | Independent controller for its own technical logs | A French non-profit association, 21 rue des Iles, 94100 Saint-Maur-des-Fossés, France. It keeps IP addresses and server logs for <strong>3 years</strong> for security, technical analysis and popularity measurement. Contact: <a href="mailto:privacy@openfoodfacts.org">privacy@openfoodfacts.org</a> — <a href="https://world.openfoodfacts.org/privacy" rel="noopener">privacy notice</a> |

Open Food Facts processes data in France, inside the European Union: <strong>there is no transfer of your data to third countries</strong>. Its supervisory authority is the French CNIL.

There are no other recipients: no analytics provider, no ad network, no cloud service, no other developer.

<span id="retention"></span>

## How long it is kept, and how to erase it

What you record stays on your phone <strong>until you erase it</strong>. There is no automatic expiry, because the point of a food diary is being able to read it back months later.

### You can erase everything at any time

- In <em>Settings → Privacy and data → Erase all data</em>: one confirmation removes your profile, diary, plans, recipes, favourites, water, goals, weight, temporary cache and preferences. The app returns to its first screen, online search is switched off, and only your interface language is kept.
- By uninstalling the app: the operating system removes the database along with it.

For the technical data Open Food Facts keeps on its own account (IP address and logs, 3 years), you can contact them directly at the address above.

<span id="backup"></span>

## Backups and moving to another phone

Alba is configured so that your data <strong>does not end up in the operating system's automatic backups</strong>: on Android automatic app backup is disabled, and on iOS the database is excluded from iCloud backup.

<aside class="callout" data-kind="warn">
<p class="callout__title">What this means for you</p>
<p>Your data is never copied to anyone's cloud — but if you change phone, lose it, or restore from a backup, <strong>your diary will not follow you</strong>. Before switching devices, export your data from <em>Settings → Privacy and data → Export my data</em> and keep the file somewhere safe.</p>
</aside>


## Security

- The database lives in the app's private storage, protected by the operating system and inaccessible to other apps.
- Every network request uses HTTPS.
- Since there is no Alba server, there is no central store that could be breached.
- The app adds no encryption of its own beyond the device's: protecting your data means protecting your phone.

<aside class="callout" data-kind="warn">
<p class="callout__title">The most useful advice on this page</p>
<p>Keep your phone locked with a passcode, fingerprint or face recognition, and keep the operating system up to date. Anyone with physical access to an unlocked phone has access to your diary.</p>
</aside>

<span id="rights"></span>

## Your rights

The GDPR gives you the right to access your data, have it corrected, erase it, restrict or object to its processing, receive it in a readable format, and withdraw consent at any time.

In Alba you exercise these rights <strong>directly in the app, without asking anyone and without waiting</strong>:

| Right | How to exercise it |
| --- | --- |
| Access and portability (Arts. 15 and 20) | <em>Settings → Privacy and data → Export my data</em>: you get a readable JSON file with everything you have recorded |
| Rectification (Art. 16) | Edit or delete the individual entry directly in the diary, in recipes, or in weight |
| Erasure (Art. 17) | <em>Settings → Privacy and data → Erase all data</em>, or uninstall the app |
| Withdrawal of consent (Art. 7(3)) | <em>Settings → Privacy and data</em>: switch off online search; camera permission is revoked in your phone settings |
| Objection and restriction (Arts. 18 and 21) | Switching off online search stops the app communicating with the outside world entirely |

If you would still rather write to a person, the address is <a href="mailto:info@gioviwankenobi.com">info@gioviwankenobi.com</a>. We will reply within one month, as Article 12 GDPR requires — bearing in mind that, having no access to your data, the help we can give concerns the instructions rather than the execution.

If you believe the processing infringes the GDPR you have the right to lodge a complaint with the Italian supervisory authority, <strong>Garante per la protezione dei dati personali</strong>, Piazza Venezia 11, 00187 Rome — <a href="https://www.garanteprivacy.it/" rel="noopener">garanteprivacy.it</a>, or with the authority of the country where you live.

<span id="minors"></span>

## Children

Alba contains nothing unsuitable for any age, but it is <strong>designed for an adult audience</strong> and is not directed at children. It does not knowingly collect children's data — it collects no one's data on a server at all.

Counting calories and tracking weight is not a neutral activity for a growing person. If a minor uses Alba, they should do so with the awareness of a parent or guardian, and with the advice of a doctor or dietitian.

<span id="website"></span>

## This website

The pages you are reading are hosted on GitHub Pages. They <strong>use no cookies</strong>, contain no analytics and do not profile visitors.

Like any website, the hosting provider (GitHub, Inc., a US company in the Microsoft group) records technical connection data, including your IP address, in order to deliver and protect the service. GitHub is the controller of that processing, described in its <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">privacy statement</a> and its <a href="https://docs.github.com/site-policy/privacy-policies/github-data-protection-agreement" rel="noopener">data protection page</a>. The typeface is served by Google Fonts, which likewise receives the IP address of the request.

The full text of these documents is also available inside the app, where the <em>Privacy and data</em> screen needs no connection at all.

<span id="changes"></span>

## Changes to this policy

If the way the app handles data changes, this page is updated and the version at the top changes with it. Substantial changes are also announced inside the app.

Version 1.0 — 1 September 2026.


## Contact

<strong>Giovan Battista Lo Buglio</strong><br>90011 Bagheria (PA), Italy<br><a href="mailto:info@gioviwankenobi.com">info@gioviwankenobi.com</a>
