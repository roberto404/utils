
const copyToClipboard = (text) =>
{
  const element = document.createElement('textarea');

  element.value = text;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);
};

export default copyToClipboard;
