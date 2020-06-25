export default function DeletedDemo(dateDeleted, demo) {
  const deletedDemo = {};

  deletedDemo.dateDeleted = dateDeleted || null;
  deletedDemo.demo = demo || null;

  return deletedDemo;
}
