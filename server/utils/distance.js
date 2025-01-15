const calculateDistances = async (sourceCoords, targetCoords) => {
  try {
    const fetch = (await import("node-fetch")).default;

    const raw = JSON.stringify({
      mode: "drive",
      sources: [{ location: [sourceCoords.lng, sourceCoords.lat] }],
      targets: targetCoords.map((coords) => ({ location: [coords.lng, coords.lat] })),
    });

    const response = await fetch(
      `https://api.geoapify.com/v1/routematrix?apiKey=${process.env.GEOAPIFY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      }
    );

    const data = await response.json();
    if (!data.sources || !data.sources_to_targets || !Array.isArray(data.sources_to_targets))
      throw new Error("Invalid API response structure");

    const distances = data.sources_to_targets[0]?.map((target) => target.distance);
    if (!distances)
      throw new Error("No distance data found in API response");

    return distances; // Distances in meters
  } catch (err) {
    console.error("Error in calculateDistances:", err.message);
    return [];
  }
};

module.exports = calculateDistances;
