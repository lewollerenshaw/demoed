export default function DeletedRecording(dateDeleted, associatedDemo, recording) {
  const deletedRecording = {};

  deletedRecording.dateDeleted = dateDeleted || null;
  deletedRecording.associatedDemo = associatedDemo || null;
  deletedRecording.recording = recording || null;

  return recording;
}
