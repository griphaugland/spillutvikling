// Verdier jeg trenger
// tile høyde standard: 50
// tile er mindre eller lik maks høyde på canvas
// samme verdi som tile høyde
// tile bredde standard: 50
// tile bredde er mindre ller lik maks bredde på canvas
// samme verdi som tile bredde
export function calculateGameSize() {
  let screenSizeHeight = window.screen.height;
  let screenSizeWidth = window.screen.width;
  console.log(screenSizeWidth);

  let units = {
    boxHeight: 50,
    maxCanvasHeight: 600,
    boxWidth: 50,
    maxCanvasWidth: 600,
    lineLength: 12,
    multiplier: 1,
  };

  if (screenSizeWidth > 1000 && screenSizeHeight > 900) {
    console.log('large');
    units.multiplier = 1.4;
    units.boxHeight = units.boxHeight * units.multiplier;
    units.maxCanvasHeight = units.maxCanvasHeight * units.multiplier;
    units.boxWidth = units.boxWidth * units.multiplier;
    units.maxCanvasWidth = units.maxCanvasWidth * units.multiplier;
    return units;
  } else if (screenSizeWidth >= 600) {
    console.log('medium');
    units.multiplier = 1;
    units.boxHeight = units.boxHeight * units.multiplier;
    units.maxCanvasHeight = units.maxCanvasHeight * units.multiplier;
    units.boxWidth = units.boxWidth * units.multiplier;
    units.maxCanvasWidth = units.maxCanvasWidth * units.multiplier;

    return units;
  } else if (screenSizeWidth <= 600) {
    console.log('small');
    units.multiplier = 0.6;
    units.boxHeight = units.boxHeight * units.multiplier;
    units.maxCanvasHeight = units.maxCanvasHeight * units.multiplier;
    units.boxWidth = units.boxWidth * units.multiplier;
    units.maxCanvasWidth = units.maxCanvasWidth * units.multiplier;

    return units;
  }
}
