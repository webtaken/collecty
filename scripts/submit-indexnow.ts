/**
 * IndexNow URL Submission Script
 *
 * This script submits URLs to Bing IndexNow for faster indexing.
 * Run with: npx tsx scripts/submit-indexnow.ts
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const HOST = "collecty.dev";
const KEY = "5e13ea4713f94212abe1b1b804b733cc";
const KEY_LOCATION = `https://collecty.dev/${KEY}.txt`;

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

async function submitToIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) {
    console.log("No URLs to submit.");
    return;
  }

  const payload: IndexNowPayload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log("Submitting URLs to IndexNow...");
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(
        `✅ Success! Status: ${response.status} - URLs submitted successfully.`,
      );
    } else {
      const errorText = await response.text();
      console.error(
        `❌ Failed! Status: ${response.status} - ${response.statusText}`,
      );
      console.error("Response:", errorText);
    }
  } catch (error) {
    console.error("❌ Error submitting to IndexNow:", error);
  }
}

// Define your URLs to submit
async function main() {
  const BASE_URL = "https://collecty.dev";

  // Static pages
  const staticUrls = [
    BASE_URL,
    `${BASE_URL}/login`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/privacy`,
    `${BASE_URL}/terms`,
  ];

  // If you want to fetch dynamic blog posts, you can do so here
  // For now, we'll submit the static URLs
  // You can add blog post URLs manually or fetch them from your API

  console.log("URLs to submit:");
  staticUrls.forEach((url) => console.log(`  - ${url}`));
  console.log("");

  await submitToIndexNow(staticUrls);
}

main().catch(console.error);
