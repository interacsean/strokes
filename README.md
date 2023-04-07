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

 - [ ] Style and structure Hole with sub-components
 - [ ] Test and refine geolocation UX
   - Requesting permission
   - Waiting til certain level of accuracy
 - [ ] Replace Chakra Selects for Lie and Club with custom modals
 - [ ] Ability to set Tee and Cup position for Hole
 - [ ] Using Tee and Cup position of Hole for start and end Stroke positions
 - [ ] Integrate with weather API to provide wind and weather data
 - [ ] Persisting data 
   - to localStorage, as MVP
   - to persistent remote storage (FireStore?)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
