const tagStringBuilder = (tags) => {
  let string = '';

  tags.forEach((tag) => {
    // eslint-disable-next-line no-unused-expressions
    tags.indexOf(tag) === tags.length - 1 ? string += `${tag}` : string += `${tag}, `;
  });

  return string;
};

module.exports = {
  tagStringBuilder,
};
