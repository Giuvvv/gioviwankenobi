---
name: Alba
tagline: A calorie counter that keeps everything on your phone
summary: >-
  Alba logs a food in a few seconds: open, search, quantity, add, done. It runs
  local-first, so the diary, the weights and the recipes live in a database on
  the device and nowhere else. There is no account, no advertising and no
  analytics.
status: in-development
featured: true
order: 1
isDemo: false

icon: alba/icon.png
accent:
  light: '#ff4e63'
  dark: '#ff4e63'
  onLight: '#ffffff'
  onDark: '#161a2b'

platforms: [ios, ipados, android]
languages: [it, en, fr, es, de, pt]
tech: [React Native, Expo, TypeScript, SQLite, Expo Router, Reanimated]

version: '0.1.0'

links:
  appStore: https://example.com/TODO_APP_STORE_URL
  googlePlay: https://example.com/TODO_GOOGLE_PLAY_URL

poster:
  src: alba/poster.png
  alt: >-
    A card in Alba's colours reading "Everything stays on your phone", with a
    drawing of a phone holding a food diary, and three points beneath: a meal
    logged in seconds, barcodes when you want them, six languages.

screenshots:
  - src: alba/screenshot-today.png
    alt: >-
      Alba's home screen for a Wednesday, greeting Giovi above an illustration
      of a flame character holding a bowl of fruit, with 1,735 calories logged
      and protein, carbohydrate and fat totals below.
    caption: The day, in one screen.
    body: >-
      Calories and the three macros are the first thing on screen, not something
      you go looking for. Adding a food takes one tap from here, and the barcode
      scanner is the same distance away when the label is easier than the name.
  - src: alba/screenshot-history.png
    alt: >-
      The history screen with a bar chart of calories per day and a list of
      logged days underneath, each showing its total and how it compares with
      the day before.
    caption: Days, weeks, months, or the whole run.
    body: >-
      The same diary at four zoom levels. Every day carries how it compares with
      the one before it, so a week reads as a direction rather than a column of
      numbers, and weight sits on the same page under its own tab.
  - src: alba/screenshot-planner.png
    alt: >-
      The weekly planner with a row of days and slots for breakfast, lunch,
      dinner and snacks, plus buttons to copy a day or a whole week.
    caption: Plan the week before it starts.
    body: >-
      Meals set out for the days ahead, with a whole day or a whole week copied
      forward in a tap. What you planned becomes what you logged, so a routine
      week costs almost nothing to record.
  - src: alba/screenshot-settings.png
    alt: >-
      Settings, listing the six interface languages, weight tracking frequency
      and unit, and the privacy and data section.
    caption: Six languages, and the privacy switches in one place.
    body: >-
      Italian, English, French, Spanish, German and Portuguese, each with its own
      privacy policy and terms. Online search sits here too, off until you turn
      it on, with the destination of every request named before the first one
      leaves.

features:
  - title: Nothing leaves the phone
    body: >-
      The diary, your weight history and your recipes are stored in a database
      on the device. There is no account to create, no server holding a copy,
      and Android backup is switched off so the data is not copied out
      silently.
  - title: Barcodes, when you want them
    body: >-
      The camera is used for one thing only, reading a product barcode, and
      only while that screen is open. Nothing is recorded and no image is kept.
  - title: Online search is off until you turn it on
    body: >-
      Alba starts by searching only the foods already on your phone. Before the
      first request ever leaves the device it tells you exactly who will
      receive it and what will be sent, and it stays off unless you accept.
  - title: Six languages
    body: >-
      Italian, English, French, Spanish, German and Portuguese, with the
      privacy policy and terms published in every one of them.
---

Alba exists because logging a meal usually takes too long. The whole app is
built around one path: open, search, set a quantity, add, done.

Keeping it local-first is what makes that possible. There is no sign-in step,
no sync spinner and no network round trip between opening the app and writing
something down. The trade is deliberate: because there is no copy on a server,
nobody can recover the diary for you, so the app puts export and deletion in
your own hands instead.
