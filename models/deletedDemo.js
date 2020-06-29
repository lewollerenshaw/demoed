export default function DeletedDemo(id, dateDeleted, demo) {
  const deletedDemo = {};

  deletedDemo.id = id || null;
  deletedDemo.dateDeleted = dateDeleted || null;
  deletedDemo.demo = demo || null;

  return deletedDemo;
}
