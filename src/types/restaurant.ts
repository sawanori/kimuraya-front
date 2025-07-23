export interface RestaurantInfo {
  name: string;
  features: {
    [key: string]: string;
  };
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}