/**
 * Function to scrape hole data from golftraxx hole-layout
 */
(function getCourseCoordinates() {
  return {
    holeNum: parseInt(
      document
        .querySelector(
          "body > div > div > div.container-fluid.mid-container.pt-4.pb-4 > div:nth-child(2) > div > font:nth-child(2) > font"
        )
        .innerText.match(/Hole# (\d*)/i)[1],
      10
    ),
    tees: {
      tee: {
        pos: {
          ...Object.entries(savedVals).filter(
            ([k, v]) => !["gc", "gf", "gb", "tt"].includes(k)
          )[0][1],
          alt: null,
        },
        nominalDistance: parseInt(
          document
            .querySelector(
              "body > div > div > div.container-fluid.mid-container.pt-4.pb-4 > div:nth-child(2) > div > font:nth-child(2) > font"
            )
            .innerText.match(/YDG (\d*)/i)[1] * 0.9144,
          10
        ),
        par: parseInt(
          document
            .querySelector(
              "body > div > div > div.container-fluid.mid-container.pt-4.pb-4 > div:nth-child(2) > div > font:nth-child(2) > font"
            )
            .innerText.match(/Par (\d*)/i)[1],
          10
        ),
      },
    },
    pins: {
      pin: {
        lat: parseFloat(gclatitude),
        lng: parseFloat(gclongitude),
        alt: null,
      },
    },
    green: {
      back: {
        lat: parseFloat(gblatitude),
        lng: parseFloat(gblongitude),
        alt: null,
      },
      front: {
        lat: parseFloat(gflatitude),
        lng: parseFloat(gflongitude),
        alt: null,
      },
    },
    waypoints: [savedVals.tt],
  };
})();
