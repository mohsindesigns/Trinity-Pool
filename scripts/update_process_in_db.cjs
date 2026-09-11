const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'eagle_revolution';

const processData = {
  label: "OUR PROCESS",
  title: "How We Work",
  titleItalicWord: "Work",
  description: "From initial inquiry to long-term support, our process is designed to be simple, transparent and efficient — so you get the right solutions, exactly when you need them.",
  image: "",
  phaseLabel: "STEP",
  items: [
    {
      title: "Request a Quote",
      shortDescription: "Tell us what you need and get a quick, competitive quote.",
      description: "Share your requirements with our team. We'll review your needs and provide a competitive, no-obligation quote — fast and hassle-free.",
      ctaText: "GET A QUOTE",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-1.jpg",
      icon: "FileText"
    },
    {
      title: "Consultation",
      shortDescription: "We understand your requirements and provide the best solution.",
      description: "Our expert engineering team assesses your technical specifications, fluid dynamics, and operational requirements to recommend optimal, cost-efficient pump systems.",
      ctaText: "SCHEDULE CONSULTATION",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-2.jpg",
      icon: "MessageSquare"
    },
    {
      title: "Supply & Delivery",
      shortDescription: "We source, prepare and deliver on time.",
      description: "Fast-track logistics, certified equipment packaging, and guaranteed on-time site dispatch ensure zero operational downtime for your plant or drilling facility.",
      ctaText: "TRACK SHIPMENTS",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-3.jpg",
      icon: "Truck"
    },
    {
      title: "After-Sales Support",
      shortDescription: "Ongoing support for maximum uptime.",
      description: "24/7 technical hotline, rapid OEM spare parts replacement, preventative field diagnostics, and certified technician maintenance for maximum equipment uptime.",
      ctaText: "GET SUPPORT",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-4.jpg",
      icon: "Wrench"
    }
  ]
};

async function updateDb() {
  if (!uri) {
    console.error("No MONGODB_URI found!");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Update site_contents
    const resSite = await db.collection('site_contents').updateOne(
      { key: "complete_data" },
      { $set: { "data.process": processData, lastUpdated: new Date() } },
      { upsert: true }
    );
    console.log("Updated site_contents complete_data.process:", resSite.modifiedCount, "upserted:", resSite.upsertedCount);

    // Also update pages collection where slug is 'home' or '/'
    const resPage = await db.collection('pages').updateMany(
      { $or: [{ slug: "home" }, { slug: "/" }, { template: "home" }] },
      { $set: { "content.process": processData, updatedAt: new Date() } }
    );
    console.log("Updated pages content.process:", resPage.modifiedCount);

    console.log("✓ Process section seeded successfully into database!");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.close();
  }
}

updateDb();
