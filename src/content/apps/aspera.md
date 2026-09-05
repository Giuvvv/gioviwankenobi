---
name: Aspera
tagline: A gym log built around the set you are actually doing
summary: >-
  Aspera tracks strength training: templates you start rather than read, a
  session screen that fills in last time's numbers before you ask, and a rest
  timer that still fires with the screen locked. The training data lives in a
  database on the phone; an account backs it up and is what lets a coach see a
  report when you choose to share one.
status: beta
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

screenshots:
  - src: aspera/screenshot-home.png
    alt: >-
      Aspera's home screen for a Thursday, greeting Giovanni above an
      illustration of a flame character in a gym, with a "Choose your workout"
      button, an August recap banner, a week calendar tagged Upper, Push and
      Lower on three days, and the day's session showing six exercises,
      eighteen working sets, an hour and twelve minutes and 15,170 kg.
    caption: The week, and what today is for.
    body: >-
      The home screen answers one question: what am I doing today. The calendar
      carries the sessions already logged, tagged with the template that ran,
      and the day you are on opens straight into its own summary. The button
      changes with the state, offering the next workout or the one you left
      running.
  - src: aspera/screenshot-templates.png
    alt: >-
      The workout templates screen, headed "Your workouts", with a button to
      create a new one and five preloaded coloured cards; Legs and Lower are
      visible, each showing six exercises and a Start button.
    caption: Five templates, ready on the first launch.
    body: >-
      Push, Pull, Legs, Upper and Lower are there before you have set anything
      up, so the first session is a tap away rather than an evening of data
      entry. Each is a real template you can edit, rename or throw away, and
      your own sit beside them in the same list.
  - src: aspera/screenshot-active.png
    alt: >-
      A live Upper session, one minute in, showing Barbell Bench Press with a
      "Last session, Sep 2" panel listing 46.5 kg by 10, 80 kg by 8 at RIR 3,
      80 kg by 7 at RIR 2 and 77.5 kg by 7 at RIR 1; set one is active with the
      weight already set to 46.5 kg and ten reps, sets two and three are queued
      at 80 kg, and a Finish workout button sits at the bottom.
    caption: What you lifted last time, before you have to remember it.
    # Nudged down: cropping from the top stops just under the WEIGHT and REPS
    # labels, hiding the prefilled numbers that are the whole point of the shot.
    focus: center 25%
    body: >-
      Every set of the last session is on screen while you do this one, and the
      fields arrive already filled with those numbers rather than empty. You are
      not recalling what you did in August, you are looking at it: add two and a
      half kilos or one more rep and the progression is deliberate instead of
      guessed. The set you are on stays open, the ones you have finished
      collapse out of the way.
  - src: aspera/screenshot-exercises.png
    alt: >-
      The exercise library with a search field, a New button and filters by
      muscle group; Barbell Bench Press, Barbell Curl, Barbell Row, Cable
      Crunch, Cable Fly, Calf Raise and Chest Press are listed, each tagged
      Compound or Accessory with its muscle group and equipment.
    caption: The main lifts are there. The rest you add.
    body: >-
      The library arrives with the movements most programmes are built from,
      and it is yours to extend: add what you actually do, edit what is there,
      rename or remove the rest. Each one carries its muscle group, its
      equipment and, crucially, whether it is a compound or an accessory. That
      label is not decoration: it decides how the movement is read later,
      because a bench press and a cable fly do not get judged by the same
      number.
  - src: aspera/screenshot-history.png
    alt: >-
      The history screen, subtitled "Every set, always easy to find", listing
      three sessions: Lower on 3 September with six exercises, twenty sets and
      15,170 kg, Push on 2 September with 6,571.5 kg, and Upper on 1 September
      with 8,215 kg.
    caption: Every set, still there months later.
    body: >-
      A session is kept whole: how long it took, which exercises, how many
      sets, how much was moved. Opening one gets you back to the individual
      sets, which is what makes last month's numbers worth anything when you
      are standing at the same bench again.
  - src: aspera/screenshot-progress.png
    alt: >-
      The progress screen on the weekly tab, showing external volume of
      29,956.5 kg, 481 repetitions, 54 working sets, 3 workouts and 3 hours 22
      minutes, each marked as a new best, with average volume per workout of
      9,985.5 kg below.
    caption: A week or a month, compared with the last.
    body: >-
      Volume, repetitions, working sets, workouts and time, each set against
      the equivalent period before it rather than against nothing. Underneath
      sit the per-exercise trends: estimated one-rep max and load for the
      compounds, reps at equal load and set volume for the accessories.

  - src: aspera/screenshot-coach.png
    alt: >-
      The coach calendar screen, with Giovanni Cliente selected under a list of
      athletes, September 2026 shown as a month grid with coloured dots on the
      days that carry sessions, a button for the monthly performance report and
      one to refresh the calendar.
    caption: A coach can follow along, if you invite one.
    body: >-
      An athlete hands over a coach code, and from then on the coach sees that
      calendar: which sessions happened, what was lifted in them, and the
      monthly performance report built from the same data. It is the athlete
      who connects and the athlete who disconnects, and disconnecting stops the
      reading there and then. What it cannot do is call back a report already
      exported: a PDF, once saved, belongs to whoever has it.
  - src: aspera/screenshot-coach-plan.png
    alt: >-
      The add workout screen a coach uses, with tabs for their own workouts and
      the athlete's, buttons to create a workout or an exercise, and a list to
      choose from: Legs, Lower, Pull, Push and Upper, each with six exercises.
    caption: And put the work in your calendar.
    body: >-
      The coach picks a template, from their own library or the athlete's, and
      assigns it to a day. It lands in the athlete's calendar as planned work,
      ready to start with the loads already set, and stays separate from what
      was actually lifted: a plan never touches volume, records or progress.

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
  - title: A coach, on the athlete's terms
    body: >-
      A coach code connects the two: from then on the coach can follow the
      athlete's calendar, see the sessions and the loads in them, and add
      training programmes to it. The same performance report serves both sides,
      a week or a month of adherence, progression and RIR or RPE with a
      set-by-set appendix, exported as a vector PDF. Connecting is the athlete's
      decision, and so is disconnecting, which stops further reading without
      needing the coach to agree — though a report already exported stays with
      whoever downloaded it.
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
