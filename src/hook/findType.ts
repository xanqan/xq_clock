let PHOTO = new Set();
PHOTO.add("image/gif");
PHOTO.add("image/png");
PHOTO.add("image/jpeg");
let VIDEO = new Set();
VIDEO.add("video/mp4");
let AUDIO = new Set();
AUDIO.add("audio/mpeg");
let Text = new Set();
Text.add("application/msword");

export default function (type: string | undefined) {
  if (PHOTO.has(type)) {
    return "photo";
  } else if (VIDEO.has(type)) {
    return "video";
  } else if (AUDIO.has(type)) {
    return "audio";
  } else if (Text.has(type)) {
    return "text";
  }
  return undefined;
}
