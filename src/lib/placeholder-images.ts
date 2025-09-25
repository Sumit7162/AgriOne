
import placeholderImages from './placeholder-images.json';

type PlaceholderImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  'data-ai-hint'?: string;
};

type PlaceholderImages = {
  [key: string]: PlaceholderImage;
};

const images: PlaceholderImages = placeholderImages;

export default images;
