# Strokes

An app to track strokes on the golf course, and provide statistics and caddy-like recommendations based on previous play

## Todo

**Bootstrapping / code management**

- [ ] Add more linting rules
  - Import order
  - Dependency rules to maintain Clean(ish) architecture
- [ ] Backfill some unit tests
- [ ] Set up deployment to surge.sh

**Application**

- [x] Persisting data to localStorage, as MVP
- [x] Load course from course data
- [ ] Update UI from design
- [ ] New shot - increment active shot by default
- [ ] New shot - fill in some values from previous shot
  - fromLie
  - fromPos
  - sensible club - i.e. if on green
- Can I get caddie prior to arriving at ball, i.e. if I'm like 5m away from my ball, can I get caddie even though I haven't marked my shot yet
- [ ] 'Finish hole' to mark hole as completed

---

- [ ] Scorecard
- [ ] 'Fringe' should set 'Stroke: chip'
- [ ] Bug: New stroke without touching anything does not seem to acknowledge the default stroke that is added on a new hole
- [ ] Adding new stroke from previous: 'Green' shoud default to 'Putter'/'Putt'
- [ ] Adding new stroke from previous: 'Fringe' shoud default to 'Green'/'Putter'/'Putt'(optimistically!)
- [ ] If hole is complete, remove "for [par|etc]"
- [ ] Design bigger UI
- [ ] Expose caddy
- [ ] Allow select clubs in bag
- [ ] Selecting the Tee used
- [ ] Shot tracking - implement all variations
- [ ] Style and structure Hole with sub-components
- [ ] Test and refine geolocation UX
  - Requesting permission
  - Waiting til certain level of accuracy
- [ ] Replace Chakra Selects for Lie and Club with custom modals
- [ ] Ability to set Tee and Cup position for Hole
- [ ] Using Tee and Cup position of Hole for start and end Stroke positions
- [ ] Integrate with weather API to provide wind and weather data
- [ ] Persisting data to persistent remote storage (FireStore?)
- [ ] View Stats

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
