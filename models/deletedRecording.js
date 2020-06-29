export default function DeletedRecording(id, dateDeleted, associatedDemo, recording) {
  const deletedRecording = {};

  deletedRecording.id = id || null;
  deletedRecording.dateDeleted = dateDeleted || null;
  deletedRecording.associatedDemo = associatedDemo || null;
  deletedRecording.recording = recording || null;

  return deletedRecording;
}
