let stage = 1; // update number when stage changed

export async function getMap() {
  try {
    const res = await fetch(`./src/js/maps/data/map-${stage}.json`);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
