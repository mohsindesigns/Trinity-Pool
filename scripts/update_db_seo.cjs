const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function updateDbSeo() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection('pages').updateOne(
    { slug: 'contact-us' },
    {
      $set: {
        'seo.metaTitle': 'Contact Performance Recovery Specialists | Trinity Pump & Supply',
        'seo.metaDescription': 'Contact Trinity Pump & Supply for specialized sports massage, mobility restoration, and clinical bodywork in Timonium, MD. Book your session today.'
      }
    }
  );

  await db.collection('pages').updateOne(
    { slug: 'gallery' },
    {
      $set: {
        title: 'Recovery & Clinical Gallery',
        'seo.metaTitle': 'Clinical Bodywork & Recovery Gallery | Trinity Pump & Supply',
        'seo.metaDescription': 'Explore our clinical gallery featuring performance bodywork sessions, mobility restoration, and recovery treatments in Maryland.'
      }
    }
  );

  await db.collection('pages').updateOne(
    { slug: 'reviews' },
    {
      $set: {
        title: 'Client Reviews & Testimonials',
        'seo.metaTitle': 'Client Reviews & Testimonials | Trinity Pump & Supply',
        'seo.metaDescription': 'Read reviews and recovery testimonials from athletes and active adults who trust Trinity Pump & Supply for sports massage, fascial stretch, and pain relief in Maryland.'
      }
    }
  );

  await db.collection('pages').updateOne(
    { slug: 'faq' },
    {
      $set: {
        'seo.metaTitle': 'Frequently Asked Questions | Trinity Pump & Supply',
        'seo.metaDescription': 'Get answers to common questions about sports massage, fascial stretch therapy, cupping, appointments, and clinical recovery services from Trinity Pump & Supply.'
      }
    }
  );

  console.log('Database SEO metadata successfully updated!');
  await mongoose.disconnect();
}
updateDbSeo();
