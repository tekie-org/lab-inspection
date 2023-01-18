/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
const testConnectionSpeed = [
  {
    src: 'https://tekie-production.s3.ap-south-1.amazonaws.com/python/test-image_clcyo8mf611gy0tpd06qr2l4i_1673865397122.jpeg',
    downloadSize: 10057151,
  },
  {
    src: 'https://tekie-production.s3.ap-south-1.amazonaws.com/python/test_clcynjpwm08nj0uq3auehdqb8_1673864235238.jpeg',
    downloadSize: 2707459,
  },
  {
    src: 'https://tekie-production.s3.ap-south-1.amazonaws.com/python/test-img_clcyoc7gf11fr0vn21bcz1obj_1673865564351.jpeg',
    downloadSize: 342233,
  },
  {
    src: 'https://tekie-production.s3.ap-south-1.amazonaws.com/python/test-img-small_clcyoqn8p11h70tpd2m7mcbrc_1673866237993.jpeg',
    downloadSize: 38989,
  },
];

let startTime;
let endTime;
async function measureConnectionSpeed() {
  let totalSpeed = 0;
  for (const img of testConnectionSpeed) {
    startTime = new Date().getTime();
    const cacheBuster = `?nnn=${startTime}`;
    const download = new Image();
    download.src = img.src + cacheBuster;
    // this returns when the image is finished downloading
    await download.decode();
    endTime = new Date().getTime();
    const duration: number = (endTime - startTime) / 1000;
    const bitsLoaded: number = img.downloadSize * 8;
    const speedBps: number = parseFloat((bitsLoaded / duration).toFixed(2));
    const speedKbps: number = parseFloat((speedBps / 1024).toFixed(2));
    const speedMbps: number = parseFloat((speedKbps / 1024).toFixed(2));
    totalSpeed += Math.round(Number(speedMbps));
  }
  return Math.round(totalSpeed / testConnectionSpeed.length);
}

export default measureConnectionSpeed;
