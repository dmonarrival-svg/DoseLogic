# DoseLogic

A supplement stack analyzer and interaction checker — React Native iOS app.

## Features
- 65+ supplements: vitamins, minerals, weight loss, gym, amino acids, nootropics, SARMs, peptides
- Real-time interaction detection with danger/warning/synergy levels
- Custom dose inputs per supplement
- Nutrient totals vs upper limits (UL) tracker
- SARM-specific warnings and PCT guidance
- Dark purple/silver design theme

## Setup
```bash
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

## Stack
- React Native 0.73
- React Navigation (bottom tabs)
- React Context API (no Redux)

## Screens
- **Stack** — Search and add supplements, adjust doses
- **Analysis** — Interaction flags, risk detection, UL alerts
- **Nutrients** — Visual bars showing cumulative nutrient load vs safe limits

> For informational use only. Not medical advice.