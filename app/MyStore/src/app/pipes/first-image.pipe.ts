import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstImage',
  standalone: true
})
export class FirstImagePipe implements PipeTransform {
  transform(imageUrls: string | string[]): string {
    if (!imageUrls) {
      return 'assets/placeholder.jpg';
    }

    // If imageUrls is an array, process the first item
    if (Array.isArray(imageUrls)) {
      if (imageUrls.length === 0) return 'assets/placeholder.jpg';
      
      const firstUrl = this.fixImageUrl(imageUrls[0]);
      console.log('Using image URL:', firstUrl);
      return firstUrl;
    }

    // Handle string type
    try {
      const urls = imageUrls.split(',');
      if (urls.length === 0) return 'assets/placeholder.jpg';
      
      const firstUrl = this.fixImageUrl(urls[0].trim());
      console.log('Using image URL from string:', firstUrl);
      return firstUrl;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return 'assets/placeholder.jpg';
    }
  }

  private fixImageUrl(url: string): string {
    if (!url) return 'assets/placeholder.jpg';
    
    // Clean the URL (remove quotes, trim whitespace)
    let cleanUrl = url.trim().replace(/^["']|["']$/g, '');
    
    // Fix common URL issues
    if (cleanUrl.startsWith('//')) {
      cleanUrl = 'https:' + cleanUrl;
    } else if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/') && !cleanUrl.startsWith('assets/')) {
      // Assume it's a relative path to Nike assets if it doesn't have a protocol
      cleanUrl = 'https://' + cleanUrl;
    }
    
    return cleanUrl || 'assets/placeholder.jpg';
  }
}