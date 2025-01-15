const opencage = require("opencage-api-client");

const getCoordinates = async (address) => {
  try {
    const response = await opencage.geocode({ q: address });
    if (response.results && response.results.length > 0)
      return response.results[0].geometry;
    else
      throw new Error("Unable to fetch coordinates");
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

module.exports = getCoordinates;
