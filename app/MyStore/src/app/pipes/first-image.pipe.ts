import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstImage',
  standalone: true
})
export class FirstImagePipe implements PipeTransform {
  transform(imageUrls: string): string {
    if (!imageUrls) return '';
    return imageUrls.split('|')[0].trim();
  }
} 