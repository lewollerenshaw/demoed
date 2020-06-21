export default function Demo(id, title, recordings, dateCreated) {
  const demo = {};

  demo.id = id || null;
  demo.title = title || null;
  demo.recordings = recordings || null;
  demo.dateCreated = dateCreated || null;

  return demo;
}
