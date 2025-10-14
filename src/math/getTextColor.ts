/**
 * 
 * getTextColor("rgb(255, 240, 0)")); // "#000000" (fekete)
 * getTextColor("rgb(0, 133, 62)"));  // "#FFFFFF" (fehér)
 */
function getTextColor(backgroundColor: string, tolarence: number = 128): "#000000" | "#FFFFFF" {

  const rgbMatch = backgroundColor.match(/\d+/g);
  if (!rgbMatch || rgbMatch.length < 3) return "#000000";

  const [r, g, b] = rgbMatch.map(Number);
  const brightness = (r * 0.299) + (g * 0.587) + (b * 0.114);

  return brightness > tolarence ? "#000000" : "#FFFFFF";
}


export default getTextColor;