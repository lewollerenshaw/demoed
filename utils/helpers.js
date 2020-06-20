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

  return `${date.getDate()} ${months[date.getMonth() - 1]} ${date.getFullYear()}`;
};

module.exports = {
  tagStringBuilder,
  sortListByDate,
  formatDate,
};
