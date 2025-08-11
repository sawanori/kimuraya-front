export interface MenuItem {
  name: string;
  description?: string;
  price?: number;
  price_tax_in?: number;
  unit?: string;
  price_text?: string;
}

export interface MenuOption extends MenuItem {
  // Additional properties specific to options if needed
  // Keeping interface for future extension
  _placeholder?: never;
}

export interface MenuGroup {
  group_name: string;
  items: MenuItem[];
}

export interface MenuSubcategory {
  subcategory_name: string;
  description?: string;
  notes?: string;
  options_title?: string;
  items?: MenuItem[];
  options?: MenuOption[];
  groups?: MenuGroup[];
  price?: number;
  price_tax_in?: number;
  unit?: string;
}

export interface MenuCategory {
  category_name: string;
  description?: string;
  subcategories: MenuSubcategory[];
}

export interface MenuData {
  menu: MenuCategory[];
}