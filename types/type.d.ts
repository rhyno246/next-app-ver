import { StringsRow } from "@/components/Admin/Settings/SettingsColumns";
import { NextRequest } from "next/server";

export type ProductParent = {
  id: string;
};

export type CategoryParent = {
  id: string;
};

export type MeResponse = {
  me: Author | null;
};

export type CreateAuthor = {
    firstName: string;
    lastName: string;
    email: string;
    password : string;
    phone: string;
    image?: string | null;
}

export type UpdateAuthor = {
    id : string,
    firstName : string,
    lastName : string,
    email : string,
    password : string;
    phone : string,
    isActive : boolean,
    image : string | null
    roleId : string | null
    newpassword : string
    oldPassword : string
}

export type ShippingAddressType = {
  authorId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type Category = {
    id: string;
    slug : string;
    name: string;
    description: string;
    image: string;
    publicId: string;
    createdAt : string;
    updatedAt : string;
    products : ProductCategory[]
};

export type CreateCategory = {
    name : string,
    description: string | null,
    image : string | null,
    authorId : string,
    publicId : string | null
}

export type UpdateCategory = {
    id : string,
    name : string,
    description : string | null,
    image : string | null,
    authorId : string
    publicId : string | null
}

export type Products = {
    id : string,
    title : string,
    image?: string,
    slug : string,
    description?: string,
    stock: number | 0,
    price: number | 0,
    rating: number | 0,
    sale: number | 0,
    soldCount?: number,
    isActive : boolean,
    isHot : boolean,
    categories?: ProductCategory[],
    authorId : string
    publicId?: string
    quantity? : number;
    images?: ProductImage[];
    createdAt: string;
    updatedAt: string;
}
export type ProductImage = {
  id: string;
  url: string;
  publicId: string | null;
  productId: string;
};

export type UpdateProduct = {
    id : string,
    title : string,
    image : string | null,
    description: string | null,
    stock : number | 0,
    price : number | 0,
    rating : number | 0,
    sale : number | 0,
    soldCount : number | 0,
    isActive : boolean,
    isHot : boolean,
    categories?: string[],
    authorId : string
    publicId : string | null,
    imageUrls?: string[];  
    imagePublicIds?: string[];
}
export type CreateProduct = {
    title : string
    image : string | null,
    description?: string | null
    stock : number
    price : number
    rating : number
    sale : number | null
    authorId : string,
    categories : string[]
    publicId : string | null
    imageUrls?: string[];       
    imagePublicIds?: string[]; 
}

export type LoginInput = {
    email : string,
    password : string
}

export type ForgetPasswordInput  = {
  email : string
}
export type ResetPasswordInput = {
  token : string;
  newPassword : string;
}


export type Context = {
  req: NextRequest;
  res: NextResponse;
  authorId?: string; 
  roleId?: string;     
  roleName?: string;  
  setCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }>;
};
export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  path?: string;
};

export type Author = {
    id: string | number;
    firstName : string | null;
    lastName : string | null;
    last : string;
    email : string | null | undefined;
    password : string;
    phone : string;
    image : string;
    isActive : boolean;
    roleId : string;
    role: Record<string,string>; 
    name : string | null;
    provider : string | null;
    publicId : string | null;
    shippingAddress : Record;
    createdAt : string;
    updatedAt : string;
}

export type LoginAuthResponse = {
  loginAuth: {
    message: string;
    user: Author;
    accessToken: string;
    refreshToken: string;
  };
};

export type ShippingAddress = {
  id : string;
  authorId: string;
  name : string;
  email : string;
  address : string;
  phone : string;
  author : Author
}

export type ShippingAddressResponse = {
  shippingAddress: ShippingAddress;
};

export type CategoriesResponse = {
    categories: Category[];
}

export type AdminCategoryPagination = {
    data: Category[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}



export type AdminCategoriesResponse = {
    adminCategories: CategoryPagination;
}

export type ImageItem = {
    file: File | null;
    preview: string;
    publicId?: string;
};

export type ProductsResponse = {
  products: {
    data: Products[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}

export type Role = {
  id : string;
  name : string;
  createdAt : string;
  updatedAt : string;
}

export type RoleResponse = {
  adminRole : Role[]
}

export type AdminAuthorPagination = {
    data: Author[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type AdminAuthorResponse = {
    adminAuthor: AdminAuthorPagination;
}

export type Slide =  {
  id: id
  title: string
  image: string
  link: string
  isActive: boolean
  publicId: string
  authorId: string
  author: Author!
  createdAt: DateTime!
  updatedAt: DateTime!
}

export type SlidePagination = {
    data: Slide[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type SlideResponse = {
  slides: SlidePagination;
}
export type CreateSlide = {
    title: string;
    image?: string | null;
    link?: string | null;
    isActive?: boolean;
    publicId?: string | null;
    authorId: string;
}

export type UpdateAndCrteateConfig = {
  id : string,
  key : string,
  value : string; 
  publicId?: string | null;
  authorId: string;
}

export type UpdateSlide = {
    id: string;
    title?: string;
    image?: string | null;
    link?: string | null;
    isActive?: boolean;
    publicId?: string | null;
    authorId?: string;
}

export type SettingResponse = {
  siteConfigs: {
    data: StringsRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type ConfigResponse = {
  siteConfig: {
    data: StringsRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    value : string
  };
  logo: {
    value: string;
    publicId: string;
  };
  phone: {
    value: string;
    publicId: string;
  };
  address: {
    value: string;
    publicId: string;
  };
  email: {
    value: string;
    publicId: string;
  };
  linkedin: {
    value: string;
    publicId: string;
  };
  facebook: {
    value: string;
    publicId: string;
  };
  
}

export type CreatePosts = {
  id : string;
  slug : string;
  title : string;
  content: string;
  image : string;
  publicId : string;
  authorId : string;
  createdAt: DateTime!
  updatedAt: DateTime!
}

export type Posts = {
  id : string;
  slug : string;
  title : string;
  content: string;
  image : string;
  publicId : string;
  authorId : string;
  author : Author;
  createdAt: DateTime!
  updatedAt: DateTime!
}

export type UpdatePost = {
  id : string;
  slug : string;
  title : string;
  content: string;
  image : string;
  publicId : string;
  authorId : string;
  createdAt: DateTime!
  updatedAt: DateTime!
}

export type PostRow = {
  id: string;
  title: string;
  slug : string;
  image: string;
  publicId: string;
  content: string;
  createdAt: string;
};

export type PostsResponse = {
  posts: {
    data: PostRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}
export type ProductRow = Products & {
  author?: Author;
};

export type OrderItemInput = {
    productId: string;
    quantity: number;
    price: number;
    sale: number;
};

export type CreateOrderInput = {
    authorId: string;
    items: OrderItemInput[];
    paymentMethod?: string;
    note?: string;
    shippingName?: string;
    shippingPhone?: string;
    shippingEmail?: string;
    shippingAddress?: string;
    discount?: number;
    shippingFee?: number;
};

export type OrdersData = {
  code : number;
  discount : number;
  id : string;
  items : OrderItem[];
  note : string;
  paymentMethod : string;
  shippingAddress : string;
  shippingEmail : string;
  shippingName : string;
  shippingPhone : string;
  shippingFee : number;
  status : string;
  total : number;
  authorId : string;
  author : Author;
  createdAt: DateTime!
}

export type OrdersResponse = {
  myOrders: {
    data: OrdersData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}

export type CreateComments = {
    productId: string;
    content: string;
    rating: number;
    email: string;
    name: string;
    authorId: string;
}

export type Comment = {
  id : string;
  content : string;
  rating : number;
  email : string;
  name : string;
  authorId : string;
  author : Author;
  productId : string;
  product : Products;
  isActive : boolean;
  isHot : boolean;
  createdAt : string;
  updatedAt : string;
}

export type Comments = {
  id: string;
  content: string;
  rating: number;
  name: string;
  email: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    image: string;
  };
};

export type CommentsResponse = {
  getComments: Comment[];
};

export interface BrowserVisitStat {
  browser: string;
  count: number;
}

export interface BrowserVisitStatsData {
  browserVisitStats: BrowserVisitStat[];
}

export type SearchProductsResponse = {
  products: {
    data: Products[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};