// src/utils/fetchSpotifyTrack.js
import axios from "axios";
import { getSpotifyAccessToken } from "./spotify";

export const fetchSpotifyTrack = async (trackId) => {
  const token = await getSpotifyAccessToken();

  const res = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    title: res.data.name,
    artist: res.data.artists[0].name,
    image: res.data.album.images[0].url,
  };
};
