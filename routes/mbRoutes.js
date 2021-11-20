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
    // country: "US",
    // primarytype: "Album",
  });
  res.status(200).json(result.releases[0]);
  // console.log(result.releases[0]);
  //   res.json(result.releases[0]);
});

module.exports = router;
