const tagStringBuilder = (tags) => {
  let string = '';

  tags.forEach((tag) => {
    // eslint-disable-next-line no-unused-expressions
    tags.indexOf(tag) === tags.length - 1 ? string += `${tag}` : string += `${tag}, `;
  });

  return string;
};

// eslint-disable-next-line max-len
const sortListByDate = (list) => list.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

// E.g. 12 July 2020
const formatDate = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Date is stored as string in async storage
  // So, when app loads and redux gets demos from async storage,
  // date is stored as string
  // So, check if date is string then convert string to date object
  if (typeof date === 'string') return `${new Date(date).getDate()} ${months[new Date(date).getMonth() - 1]} ${new Date(date).getFullYear()}`;
  else return `${date.getDate()} ${months[date.getMonth() - 1]} ${date.getFullYear()}`;
};

const hasSearchTextInTags = (search, tags) => {
  let result = false;

  tags.forEach((tag) => {
    if (tag.includes(search)) result = true;
  });

  return result;
};

module.exports = {
  tagStringBuilder,
  sortListByDate,
  formatDate,
  hasSearchTextInTags,
};
