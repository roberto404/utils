
const getAddress = ({ street, streetType, streetNo, building, staircase, floor, houseNumber }) => {
  const address = [[street, streetType, streetNo].filter(i => i).join(' ')];

  if (address[0].slice(-1) !== '.') {
    address[0] += '.';
  }

  if (building) {
    address.push(`${building} épület`);
  }

  if (staircase) {
    address.push(`${staircase} lh.`);
  }

  if (!isNaN(floor) && floor !== null) {
    if (parseInt(floor) !== 0) {
      address.push(`${floor}. emelet`);
    }
    else {
      address.push('fsz.');
    }
  }

  if (houseNumber) {
    address.push(`${houseNumber} ajtó`);
  }

  return address.join(' ');
};

export default getAddress;
