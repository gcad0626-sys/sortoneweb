const { Jimp } = require('jimp');

async function processImage() {
  try {
    const w = 425;
    const h = 804;
    const bgColor = 0x63a8edff; // Hardcoded screen background color

    const cards = [
      { start: 177, end: 307 },
      { start: 380, end: 493 },
      { start: 504, end: 617 },
      { start: 628, end: 733 }
    ];
    
    // Generate blank image
    const blank = await Jimp.read('img/Central App Mockup.png');
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        // Paint over the card, but strictly inside the screen (X=46 to X=378)
        for(let cy = card.start - 8; cy <= card.end + 12; cy++) {
            for(let cx = 46; cx <= 378; cx++) {
                blank.setPixelColor(bgColor, cx, cy);
            }
        }
    }
    
    await blank.write('img/Central App Mockup0.png');
    console.log('Successfully generated Central App Mockup0.png');
  } catch (err) {
    console.error(err);
  }
}

processImage();
