import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadImageGitHub } from '@/lib/githubStorage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s+/g, '-').toLowerCase();

    // 1. Try GitHub Upload (Online Mode)
    if (process.env.GITHUB_TOKEN) {
      try {
        console.log('Uploading to GitHub...');
        const url = await uploadImageGitHub(filename, buffer);
        return NextResponse.json({ url });
      } catch (error) {
        console.error('GitHub upload failed, trying local...', error);
      }
    }

    // 2. Fallback to Local Upload (Dev Mode)
    const uploadDir = path.join(process.cwd(), 'public/images');
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/images/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
