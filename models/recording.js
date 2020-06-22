export default function Recording(title, duration, tags, URI, dateCreated) {
  const recording = {};

  recording.title = title || null;
  recording.duration = duration || null;
  recording.tags = tags || null;
  recording.URI = URI || null;
  recording.dateCreated = dateCreated || null;

  return recording;
}
