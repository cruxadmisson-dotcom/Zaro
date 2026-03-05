import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';

// Load these from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'cruxadmisson-dotcom';
const GITHUB_REPO = 'Zaro';
const PRODUCTS_PATH = 'src/data/products.json';
const IMAGES_DIR = 'public/images';

export async function getProductsFromGitHub() {
  if (!GITHUB_TOKEN) return null;
  
  const octokit = new Octokit({ 
    auth: GITHUB_TOKEN,
    request: {
      fetch: (url: string, options: any) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
          next: { revalidate: 0 }
        });
      },
    },
  });
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: PRODUCTS_PATH,
    });
    
    if ('content' in data && data.content) {
      const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    }
  } catch (error: any) {
    if (error.status === 404) {
      console.warn('Products file not found on GitHub, returning empty list.');
      return [];
    }
    console.error('Failed to fetch from GitHub:', error);
    throw error; // Let the caller handle the error (or fail loudly)
  }
  return null;
}

export async function saveFileToGitHub(filePath: string, content: string | Buffer, message: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not found in environment variables.');
  }

  const octokit = new Octokit({ 
    auth: GITHUB_TOKEN,
    request: {
      fetch: (url: string, options: any) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
          next: { revalidate: 0 }
        });
      },
    },
  });

  try {
    // Check if file exists to get SHA
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
      });
      if (!Array.isArray(data) && 'sha' in data) {
        sha = data.sha;
      }
    } catch (error: any) {
      // If error is NOT 404, throw it
      if (error.status !== 404) {
        console.error('Error fetching file SHA:', error);
        throw error;
      }
      // If 404, it's a new file, so no SHA needed.
    }

    // Convert content to Base64
    const contentBase64 = Buffer.isBuffer(content) 
      ? content.toString('base64') 
      : Buffer.from(content).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: message,
      content: contentBase64,
      sha: sha, // Only needed for updates
      committer: {
        name: 'Zaro Admin Bot',
        email: 'admin@zarofashion.com',
      },
      author: {
        name: 'Zaro Admin Bot',
        email: 'admin@zarofashion.com',
      },
    });
    
    return true;
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw error;
  }
}

export async function saveProductsGitHub(products: any[]) {
  return saveFileToGitHub(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'Update products via Admin Panel');
}

export async function uploadImageGitHub(filename: string, buffer: Buffer) {
  const filePath = `${IMAGES_DIR}/${filename}`;
  await saveFileToGitHub(filePath, buffer, `Upload image: ${filename}`);
  return `/images/${filename}`; // Return the public path
}
