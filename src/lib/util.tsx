// FUNCTIONS

const funcs: any = {};

/**
 * Return an 11-digit long sequential number (converted to string),
 * based on the time in milliseconds (new Date()).getTime())
 */
funcs.getSeqNum = () => {
  const ms = (new Date()).getTime();

  // take the first 9 digits (instead of the full 13 digits), which is already "unique enough"
  return ("" + ms).substring(0, 9);
};

export default funcs;

