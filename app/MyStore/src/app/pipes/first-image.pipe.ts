import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstImage',
  standalone: true
})
export class FirstImagePipe implements PipeTransform {
  // Default Nike image as fallback
  private defaultImage = 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-mens-shoes-jBrhbr.png';
  
  transform(imageUrls: string | string[]): string {
    // Handle null or undefined
    if (!imageUrls) {
      return this.defaultImage;
    }
    
    // Convert to array if it's a string
    const images = Array.isArray(imageUrls) 
      ? imageUrls 
      : imageUrls.split(',').map(url => url.trim());
    
    // Find the first valid URL
    for (const url of images) {
      if (url && typeof url === 'string' && url.trim().length > 0) {
        return url.trim();
      }
    }
    
    // Default fallback
    return this.defaultImage;
  }
}