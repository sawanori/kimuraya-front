export interface CourseMenuItem {
  name: string;
  description?: string;
}

export interface Course {
  title: string;
  price: number;
  price_with_tax: number;
  duration: string;
  items: CourseMenuItem[];
}

export interface CourseData {
  courses: Course[];
}