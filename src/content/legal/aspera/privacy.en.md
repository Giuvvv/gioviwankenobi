---
title: "Privacy Policy"
updated: 2026-09-09
version: "1.0"
intro: "What happens to your information when you use Aspera and when you choose to train with a coach."
isPlaceholder: false
---

## At a glance

- Aspera uses account and workout data to provide the requested features.
- It has no advertising, in-app purchases or profiling SDKs and does not sell personal data.
- Workouts are not public. If you connect a coach, only that coach can view the shared portion.
- You can disconnect the coach, delete workouts and delete your account.
- Minors may use Aspera subject to the safeguards described below.

<span id="titolare"></span>

## 1. Data controller

The controller of the Aspera service is **Giovan Battista Lo Buglio**, based in **90011 Bagheria (PA), Italy**, who publishes the app under the developer name **gioviwankenobi**.

For information, privacy support and exercising your rights, email [info@gioviwankenobi.com](mailto:info@gioviwankenobi.com). You may also use this address if you cannot access the app.

<span id="dati"></span>

## 2. Data processed

- **Account:** chosen name, email address, user identifier and technical data needed for authentication. The password is handled by the authentication service and is not visible to other users or coaches.
- **Age and legal documents:** the date of birth entered is used on the device to determine the age group and is not stored in its complete form. The cloud stores the “under 14” or “14 and over” group, account-holder type, document version and language, declarations made and server date and time.
- **A minor’s account:** parent or guardian name and email, confirmation that they control that address, authorisation date and subsequent coach-connection authorisations.
- **Workouts:** plans, custom exercises, calendar entries, dates and times, sets, repetitions, loads, added weight, rest periods, RIR/RPE, completion state and technical notes entered by the user.
- **Coach–athlete relationship:** coach role, connection code, identities of the parties, connection state, authorising person, applicable legal-document version and authorship of assigned plans.
- **Local preferences:** language, theme, colour and workout settings stored on the device.
- **Technical data:** IP address, network requests, app version, device and security information that may be included in provider logs.
- **Support:** the content of communications voluntarily sent to the support address.

### Notes and health information

Aspera is a fitness log and does not ask for diagnoses, medical conditions, treatments, medication or other clinical information. Note fields are intended only for technical workout information such as execution, equipment, tempo and general sensations.

Do not enter medical or health information in notes. If this type of information is entered accidentally, the user can remove it using the app or ask the controller to delete it. Once aware of such information, the controller processes it only to handle the request and remove it, unless the law requires otherwise. Ordinary physical activity data may nonetheless be health data when, in its context, it reveals information about a person’s health status.

<span id="finalita"></span>

## 3. Purposes and legal bases

| Purpose | Data | Legal basis |
| --- | --- | --- |
| Create the account, authenticate the user and provide the calendar, plans, history and progress features | Account and workout data | Performance of the requested service, Article 6(1)(b) GDPR |
| Synchronise necessary data between the device and cloud | Identifiers, catalogue and synchronised calendar | Performance of the service, Article 6(1)(b) |
| Connect a coach and share calendar and workout information | Profile and shared workout data | Consent of the athlete or, where required, their parent or guardian, Article 6(1)(a); withdrawn by disconnecting the coach |
| Security, prevention of abuse and defence of rights | Strictly necessary identifiers and technical data | Legitimate interests, Article 6(1)(f), subject to the user’s rights |
| Answer support and privacy requests | Email and request content | Performance of the request, a legal obligation or legitimate interests, depending on the circumstances |
| Comply with lawful authority requests and legal obligations | Strictly necessary data | Legal obligation, Article 6(1)(c) |

Connecting a coach and entering notes are optional. Summaries are calculations based on information entered and do not produce automated decisions with legal effects.

<span id="dispositivo-cloud"></span>

## 4. Device and cloud

The app maintains a local archive separated by account. Signing out does not delete that archive. The authentication session is stored on the device or, for the web version, in browser storage.

Supabase processes accounts, profiles, coach–athlete connections, the synchronised catalogue, scheduled plans and completed sessions. Synchronisation may occur without a connected coach: cloud storage does not give a coach permission to read the data.

Ongoing sessions are not uploaded as completed workouts. Synchronisation is not a complete multi-device backup and may not restore preferences or content that remained only on the original device.

<span id="coach"></span>

## 5. Coach and athlete connection

Connecting a coach is optional. The athlete enters the code they received, reviews the permission summary and confirms. The athlete must verify that the code came from the intended coach; Aspera does not automatically certify a coach’s identity or professional qualifications.

The connected coach can see the profile name and synchronised workout data, but not the account password or email address. They can view the calendar, plans, sessions, exercises, loads and technical notes; generate reports; and assign their own plans, including custom exercises. They can delete only their own unstarted scheduled plans, subject to the app’s controls.

The athlete can disconnect the coach at any time. Once the server confirms disconnection, new access through that relationship is blocked. Disconnection cannot recall exported PDFs and does not remove plans already delivered to the athlete. The coach must use and retain any external copies in accordance with the law and their own responsibilities.

For an account in the under-14 group, the parent or guardian must authorise the connection by re-entering the password of the account they control. The authentication service verifies the password and it is not retained as evidence; Aspera instead records who authorised the connection, the legal version and the authorisation date.

<span id="fornitori"></span>

## 6. Providers and transfers

- **Supabase, Inc.** provides authentication, APIs and the cloud database. The project’s primary database is in the Central EU, Frankfurt region (`eu-central-1`). Supabase acts as a technical processor under its DPA and may use the subprocessors listed in that agreement, including infrastructure providers. Transfers outside the EEA are governed by the mechanisms described in the DPA, including adequacy decisions and standard contractual clauses.
- **Expo / EAS** is used to build and distribute builds and updates. It does not receive workout content through Aspera; it may process request metadata, installation identifiers, logs and artefacts related to distribution.
- **Google Play and Apple App Store** distribute the app and process store-account data under their own privacy policies. Aspera does not send them the workout log.
- **GitHub Pages** hosts these documents and may record visitors’ IP addresses for security.
- **User-selected destinations:** when you export or share a PDF, the file is delivered to the app or person you select.

Aspera currently integrates no advertising, behavioural analytics, profiling or crash-reporting SDKs. The app uses authentication and server-side access controls, but no measure can guarantee the complete absence of risk.

Supabase’s current agreement and subprocessors are available in its [legal documentation](https://supabase.com/legal/dpa); Expo’s terms are available in its [Privacy Policy](https://expo.dev/privacy).

<span id="conservazione"></span>

## 7. Retention and deletion

- **Account, age group and legal evidence:** retained while the account remains active. Account deletion also removes the age group, guardian authorisation and acceptance records held in the operational database.
- **Workouts:** retained while the account remains active or until the user deletes individual content.
- **Synchronised deletions:** after server confirmation, workout content is physically removed from the operational database. A technical anti-restoration marker remains, containing the item identifier, athlete identifier and deletion date, but no exercises, loads or notes; it is deleted with the account.
- **Account:** completed deletion removes the authentication identity, profile, personal cloud data, calendar and connections. Plans already delivered by a coach remain as copies in the recipient athlete’s account.
- **Local archive:** the app removes account data from the device that completes the procedure. Copies on offline devices and previously delivered exports cannot be recalled remotely.
- **Supabase logs:** on the current Free plan, API and database logs are available for one day. The plan includes no automatic backups or Point-in-Time Recovery; any provider technical copies follow its contractual obligations and cycles.
- **Expo/EAS:** build or update logs and artefacts may be retained for up to 90 days; they do not contain the workout log sent to Supabase.
- **Support:** email is kept as long as needed to answer and normally no longer than 24 months after the request is closed, unless a dispute or legal obligation requires otherwise.

Deleting a workout period is different from deleting the account. For the full procedure, see [Delete account](../delete-account/).

<span id="diritti"></span>

## 8. Your rights

Where provided by the GDPR, you may request access, correction, erasure, restriction and portability and object to processing. Where processing is based on consent, you can withdraw it at any time without affecting prior lawful processing.

Email [info@gioviwankenobi.com](mailto:info@gioviwankenobi.com). Proportionate information may be requested to verify identity, but never your password. You may also complain to the [Italian Data Protection Authority](https://www.garanteprivacy.it/) or another competent supervisory authority.

<span id="minori"></span>

## 9. Minors

Aspera provides fitness content suitable for a general audience and may also be used by minors. Content ratings, including any PEGI 3 rating, are assigned by the relevant rating authorities and stores and do not replace privacy requirements.

In Italy, a minor aged 14 or over may give their own consent for an information-society service. Below 14, the account must be created and managed by a parent or guardian using an email address under their control; the parent or guardian reviews the documents, authorises processing and manages any coach connection. In other countries, the threshold required by local law applies.

A minor’s workouts must be supervised by a parent or guardian and, where appropriate, a qualified professional. If the controller becomes aware that a minor’s account was created without the necessary authorisation, it may suspend the account and delete the data after appropriate checks. A parent or guardian can exercise the minor’s rights through the contact address above.

<span id="sito"></span>

## 10. This website

The legal pages contain no forms, advertising, external fonts or tracking scripts added by Aspera and do not load workout data. GitHub states that it records GitHub Pages visitors’ IP addresses for security. See the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) and [GitHub’s Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

<span id="aggiornamenti"></span>

## 11. Updates

Material changes will be communicated through the app, website or email where appropriate. If a change requires fresh consent, it will be requested before the relevant processing.

Reference: [Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng).
