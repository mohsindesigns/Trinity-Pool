const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function cleanMediaAndSubmissions() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const mediaDocs = await db.collection('media').find({}).toArray();
  for (const m of mediaDocs) {
    const json = JSON.stringify(m);
    if (/eagle/i.test(json)) {
      const cleanedJson = json
        .replace(/https?:\/\/eaglerevolution\.com\/?/gi, 'https://trinitypumpsupply.com/')
        .replace(/https?:\/\/www\.eaglerevolution\.com\/?/gi, 'https://trinitypumpsupply.com/')
        .replace(/eaglerevolution\.com/gi, 'trinitypumpsupply.com')
        .replace(/eagle_revolutionllc/gi, 'trinitypumpsupply')
        .replace(/eagle-revolution/gi, 'trinitypumpsupply')
        .replace(/Eagle Revolution/gi, 'Trinity Pump & Supply')
        .replace(/eagle/gi, 'trinity');
      const updatedObj = JSON.parse(cleanedJson);
      delete updatedObj._id;
      await db.collection('media').updateOne({ _id: m._id }, { $set: updatedObj });
    }
  }

  const submissions = await db.collection('submissions').find({}).toArray();
  for (const s of submissions) {
    const json = JSON.stringify(s);
    if (/eagle/i.test(json)) {
      const cleanedJson = json
        .replace(/https?:\/\/eaglerevolution\.com\/?/gi, 'https://trinitypumpsupply.com/')
        .replace(/eaglerevolution\.com/gi, 'trinitypumpsupply.com')
        .replace(/eagle/gi, 'trinity');
      const updatedObj = JSON.parse(cleanedJson);
      delete updatedObj._id;
      await db.collection('submissions').updateOne({ _id: s._id }, { $set: updatedObj });
    }
  }

  console.log('Cleaned media and submissions in DB!');
  await mongoose.disconnect();
}
cleanMediaAndSubmissions();
