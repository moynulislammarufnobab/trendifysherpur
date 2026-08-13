import React from 'react';

export function cleanImageUrl(url: string | undefined | null): string {
  if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
  let str = url.trim();

  // Extract from HTML tag if pasted e.g. <img src="..."> or <a href="...">
  const htmlSrcMatch = str.match(/src=["']([^"']+)["']/i);
  if (htmlSrcMatch && htmlSrcMatch[1]) str = htmlSrcMatch[1];

  // Extract from Markdown snippet e.g. ![text](url)
  const mdMatch = str.match(/\((https?:\/\/[^\)]+)\)/);
  if (mdMatch && mdMatch[1]) str = mdMatch[1];

  // If already direct i.postimg.cc link, return clean
  if (str.includes('i.postimg.cc/')) {
    return str;
  }

  // Handle postimg.cc or postimages.org page URLs:
  // e.g. https://postimg.cc/JGY2z9yS or https://postimg.cc/image/JGY2z9yS or https://postimages.org/JGY2z9yS
  const postimgMatch = str.match(/(?:postimg\.cc|postimages\.org)\/(?:image\/)?([a-zA-Z0-9]+)/i);
  if (postimgMatch && postimgMatch[1]) {
    const code = postimgMatch[1];
    return `https://i.postimg.cc/${code}/image.jpg`;
  }

  return str;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  const currentSrc = target.src;

  if (currentSrc.includes('i.postimg.cc/')) {
    if (currentSrc.endsWith('/image.jpg')) {
      target.src = currentSrc.replace('/image.jpg', '/image.png');
      return;
    }
    if (currentSrc.endsWith('/image.png')) {
      target.src = currentSrc.replace('/image.png', '/image.jpeg');
      return;
    }
    if (currentSrc.endsWith('/image.jpeg')) {
      target.src = currentSrc.replace('/image.jpeg', '/image.webp');
      return;
    }
  }

  // Fallback image if link fails completely
  target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
}
