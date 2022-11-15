let PHOTO = new Set();
PHOTO.add("image/gif");
PHOTO.add("image/png");
PHOTO.add("image/jpeg");
let VIDEO = new Set();
VIDEO.add("video/mp4");
let AUDIO = new Set();
AUDIO.add("audio/mpeg");

export default function (type: string | undefined) {
  if (PHOTO.has(type)) {
    return "photo";
  } else if (VIDEO.has(type)) {
    return "video";
  } else if (AUDIO.has(type)) {
    return "audio";
  }
  return undefined;
}
