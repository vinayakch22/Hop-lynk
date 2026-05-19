import mongoose from 'mongoose';
// Adjust these import paths based on your folder structure
import Url from "../models/Url.model.js"
import Analytics from '../models/Analytics.model.js';

// Realistic Indian demographics
const BROWSERS = ['Chrome', 'Chrome', 'Chrome', 'Safari', 'UC Browser', 'Edge', 'Firefox'];
const OS_LIST = ['Android', 'Android', 'Android', 'Android', 'iOS', 'Windows', 'Mac OS'];
const DEVICES = ['Mobile', 'Mobile', 'Mobile', 'Mobile', 'Desktop', 'Tablet'];
const REFERRERS = ['WhatsApp', 'WhatsApp', 'Instagram', 'Instagram', 'Direct', 'Google.co.in', 'Facebook', 'Telegram', 'X'];

// Helper to pick a random item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate a random date within the last 90 days
const getRandomPastDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 90));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return date;
};

// Hardcoded India-Centric URLs mapping to the provided user IDs
const generateUrlsData = () => [
  {
    userId: '6a070f4eb25a2f4395f8cfe6',
    originalUrl: 'https://www.flipkart.com/big-billion-days-sale',
    shortCode: 'bbd26',
    customAlias: 'flipkart-sale',
    isActive: true,
  },
  {
    userId: '6a0743d7bfe45cfe9ac3b9ed',
    originalUrl: 'https://www.swiggy.com/restaurants/meghana-foods',
    shortCode: 'swg7xy',
    customAlias: 'meghana-blr',
    isActive: true,
  },
  {
    userId: '6a0743edbfe45cfe9ac3b9f7',
    originalUrl: 'https://www.irctc.co.in/nget/train-search',
    shortCode: 'tatkal',
    customAlias: null,
    isActive: true,
  },
  {
    userId: '6a07440cbfe45cfe9ac3ba01',
    originalUrl: 'https://www.myntra.com/ethnic-wear',
    shortCode: 'diwali26',
    customAlias: 'myntra-ethnic',
    isActive: true,
  },
  {
    userId: '6a070f4eb25a2f4395f8cfe6',
    originalUrl: 'https://groww.in/mutual-funds',
    shortCode: 'grwsip',
    customAlias: 'sip-invest',
    isActive: true,
  },
  {
    userId: '6a0743d7bfe45cfe9ac3b9ed',
    originalUrl: 'https://www.zomato.com/hyderabad/paradise-biryani',
    shortCode: 'zomhyd',
    customAlias: 'paradise-hyd',
    isActive: true,
  },
  {
    userId: '6a0743edbfe45cfe9ac3b9f7',
    originalUrl: 'https://paytm.com/recharge',
    shortCode: 'ptmrchg',
    customAlias: null,
    isActive: true,
  },
  {
    userId: '6a07440cbfe45cfe9ac3ba01',
    originalUrl: 'https://www.bcci.tv/matches',
    shortCode: 'ipl2026',
    customAlias: 'ipl-tickets',
    isActive: true,
  }
];

/**
 * Main seeding function to be called after MongoDB connection
 */
export default async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding process...');

    // 1. Clear existing data to prevent unique constraint errors
    console.log('🗑️  Clearing old Urls and Analytics...');
    await Url.deleteMany({});
    await Analytics.deleteMany({});

    // 2. Insert URLs
    const urlsData = generateUrlsData();
    const insertedUrls = await Url.insertMany(urlsData);
    console.log(`✅ Inserted ${insertedUrls.length} Indian-context URLs.`);

    // 3. Generate massive Analytics data
    console.log('📊 Generating large volumes of analytics data...');
    let totalAnalyticsInserted = 0;

    // We process analytics url by url to manage memory and update the Url document
    for (const url of insertedUrls) {
      // Generate anywhere between 300 and 1500 clicks per URL to simulate high traffic
      const clicksCount = Math.floor(Math.random() * 1200) + 300; 
      const analyticsBatch = [];
      let latestClickDate = new Date(0); // Start at epoch to find the max date

      for (let i = 0; i < clicksCount; i++) {
        const clickDate = getRandomPastDate();
        if (clickDate > latestClickDate) {
          latestClickDate = clickDate;
        }

        analyticsBatch.push({
          urlId: url._id,
          browser: getRandom(BROWSERS),
          os: getRandom(OS_LIST),
          device: getRandom(DEVICES),
          country: 'India', 
          referrer: getRandom(REFERRERS),
          timestamp: clickDate,
        });
      }

      // Bulk insert analytics for this specific URL
      await Analytics.insertMany(analyticsBatch);
      totalAnalyticsInserted += analyticsBatch.length;

      // Update the URL document with the aggregated totals
      await Url.findByIdAndUpdate(url._id, {
        totalClicks: clicksCount,
        lastVisitedAt: latestClickDate,
      });
    }

    console.log(`✅ Inserted ${totalAnalyticsInserted} Analytics records.`);
    console.log('🚀 Database completely seeded and ready to go!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}