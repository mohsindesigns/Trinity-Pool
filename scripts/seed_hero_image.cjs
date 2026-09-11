const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'eagle_revolution';

async function seedHero() {
  if (!uri) {
    console.error("No MONGODB_URI found!");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const heroImg = "/images/trinity/hero-bg.png";
    const heroAlt = "Trinity Pump & Supply Industrial Oilfield Operations";

    // Update site_contents
    const resSite = await db.collection('site_contents').updateOne(
      { key: "complete_data" },
      { 
        $set: { 
          "data.hero.image": heroImg, 
          "data.hero.imageAlt": heroAlt,
          lastUpdated: new Date() 
        } 
      }
    );
    console.log("Updated site_contents complete_data.hero.image:", resSite.modifiedCount);

    // Also update pages collection
    const resPage = await db.collection('pages').updateMany(
      { $or: [{ slug: "home" }, { slug: "/" }, { template: "home" }] },
      { 
        $set: { 
          "content.hero.image": heroImg,
          "content.hero.imageAlt": heroAlt,
          updatedAt: new Date() 
        } 
      }
    );
    console.log("Updated pages content.hero.image:", resPage.modifiedCount);

    console.log("✓ Hero background image successfully seeded into database!");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.close();
  }
}

seedHero();
