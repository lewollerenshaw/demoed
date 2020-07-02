const tagStringBuilder = (tags) => {
  let string = '';

  tags.forEach((tag) => {
    tags.indexOf(tag) === tags.length - 1 ? string += `${tag}` : string += `${tag}, `;
  });

  return string;
};

const sortListByDate = (list) => list.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

// E.g. 12 July 2020
const formatDate = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let parsedDate;

  typeof date === 'string' ? parsedDate = new Date(date) : parsedDate = date;

  return `${parsedDate.getDate()} ${months[parsedDate.getMonth()]} ${parsedDate.getFullYear()}`;
};

const hasSearchTextInTags = (search, tags) => {
  let result = false;

  tags.forEach((tag) => {
    if (tag.includes(search)) result = true;
  });

  return result;
};

const idGenerator = () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis / 1000) % 60);
  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

module.exports = {
  tagStringBuilder,
  sortListByDate,
  formatDate,
  hasSearchTextInTags,
  idGenerator,
  millisToMinutesAndSeconds,
};
