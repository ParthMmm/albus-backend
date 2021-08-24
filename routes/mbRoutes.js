const MusicBrainzApi = require("musicbrainz-api").MusicBrainzApi;
const router = require("express").Router();
const url = require("url");

const mbApi = new MusicBrainzApi({
  appName: "my-app",
  appVersion: "0.1.0",
  appContactInfo: "user@mail.org",
});

router.get("/album_id", async (req, res, next) => {
  const artist = req.query.artist;
  const album = req.query.album;

  console.log(artist, album);
  const result = await mbApi.search("release", {
    artist: artist,
    release: album,
    country: "US",
    primarytype: "Album",
  });
  console.log(result);
  res.json(result.releases[0]);
  //   res.json(result.releases[0]);
});
async function hello() {
  const result = await mbApi.search("release", {
    artist: "madonna",
    release: "confessions on a dance floor",
    country: "US",
    primarytype: "Album",
  });
  console.log(result.releases[0]);

  const recording = await mbApi.getRecording(
    "0ace9b23-934d-4b58-a749-f0f33b883646"
  );
  console.log(recording);
}

module.exports = router;
