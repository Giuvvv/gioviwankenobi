---
name: Aspera
tagline: A gym log built around the set you are actually doing
summary: >-
  Aspera tracks strength training: templates you start rather than read, a
  session screen that fills in last time's numbers before you ask, and a rest
  timer that still fires with the screen locked. The training data lives in a
  database on the phone; an account backs it up and is what lets a coach see a
  report when you choose to share one.
status: in-development
featured: true
order: 2
isDemo: false

icon: aspera/icon.png
accent:
  light: '#5B4BDB'
  dark: '#A18FFF'
  onLight: '#ffffff'
  onDark: '#171128'

platforms: [android]
languages: [it, en]
tech: [React Native, Expo, TypeScript, SQLite, Expo Router, Supabase]

version: '1.17.0'

poster:
  src: aspera/poster.png
  alt: >-
    A card in Aspera's colours reading "Built for the minute between sets", with
    a drawing of a session screen showing one open set above two collapsed ones
    and a running recovery timer, and three points beneath: Push, Pull, Legs
    ready to start, records, 1RM and volume, and a PDF report for your coach.

screenshots: []

features:
  - title: The set in front of you, not the spreadsheet
    body: >-
      A session opens on the set you are about to do, with last time's load and
      reps already in place. Decimal kilos, RIR or RPE, set types and intensity
      techniques are all there when you want them and out of the way when you
      do not. The rest timer runs on a local notification, so it still tells you
      when the screen is locked and recalculates itself when you come back.
  - title: Plans you start, not plans you read
    body: >-
      Push, Pull, Legs, Upper and Lower are there from the first launch, and
      your own templates sit beside them. The weekly planner sets the day, the
      template and the loads in advance, and a planned session starts with those
      numbers already filled in. Planned work is kept apart from what you
      actually lifted: targets never touch volume, records or progress.
  - title: Two kinds of exercise, judged differently
    body: >-
      Compound and accessory work are not read the same way. Aspera estimates a
      one-rep max with Epley and tracks load for the compounds, and looks at
      reps at equal load, performance inside the range and set volume for the
      accessories. Records cover load, reps, volume and estimated 1RM.
  - title: A report a coach can read
    body: >-
      One performance report, the same for the athlete and the coach: a week or
      a month, adherence, progression, RIR and RPE, and a set-by-set appendix.
      It exports as a vector PDF with the fonts embedded. Connecting a coach is
      the athlete's decision, and so is disconnecting, which stops further
      reading without needing the coach to agree.
---

Aspera is a training log for people who lift. The whole design assumes you are
using it between sets, with one hand, in a noisy room: the screen opens on the
set in front of you, the numbers from last time are already filled in, and the
rest timer keeps running when you put the phone down.

The sessions, the exercise library and the templates live in a SQLite database
on the phone, which is why the app is quick and works without a signal. An
account is what backs that up and what makes the coach report possible, so
unlike a purely local app there is a copy on a server and there are terms that
govern it.
