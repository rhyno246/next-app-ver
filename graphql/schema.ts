import gql from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type AuthPayload {
    message: String!
    user: Author!
    accessToken: String!
    refreshToken: String!
  }

  type Role {
    id: ID!
    name: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Author {
    id: ID!
    firstName: String
    lastName: String
    email: String!
    password: String!
    image: String
    isActive: Boolean
    phone: String
    roleId: String
    provider: String
    publicId: String
    shippingAddress: ShippingAddress
    wishlist: [Wishlist!]
    role: Role!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Slide {
    id: ID!
    title: String
    image: String
    link: String
    isActive: Boolean
    publicId: String
    authorId: String
    author: Author!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  

  type MessageResponse {
    message: String!
  }

  type ShippingAddress {
    id: ID!
    authorId: String
    name: String
    email: String
    phone: String
    address: String
    author: Author!
    createdAt: DateTime!
    updatedAt: DateTime!
  }


  type ProductCategory {
    category: Category!
    product: Product! 
  }
  

  type Category {
    id: ID!
    name: String
    slug : String
    description: String
    image: String
    authorId: String
    author: Author!
    publicId: String
    products: [ProductCategory!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Product {
    id: ID!
    count: Int
    slug: String
    title: String
    image: String
    publicId: String
    description: String
    stock: Int
    price: Int
    rating: Int
    sale: Int
    soldCount: Int
    isActive: Boolean
    isHot: Boolean
    author: Author!
    categories: [ProductCategory!]
    images: [ProductImage!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Post {
    id: ID!
    title: String
    slug: String
    content: String
    image: String
    publicId: String
    authorId: String
    author: Author!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  

  type ProductImage {
    id: ID!
    url: String!
    publicId: String
    productId: String!
    createdAt: DateTime!
  }

  type AdminCategoryPagination {
    data: [Category!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type SlidePagination {
    data: [Slide!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type ProductPagination {
    data: [Product!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type PostPagination {
    data: [Post!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }


  type AuthorPagination {
    data: [Author!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type SiteConfig {
    id: ID!
    key: String!
    publicId: String
    value: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SiteConfigPagination {
    data: [SiteConfig!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type WishlistToggleResponse {
    added: Boolean!
    message: String!
  }
  type Wishlist {
    id: ID!
    authorId: String!
    productId: String!
    product: Product
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem {
    id: ID!
    orderId: String!
    productId: String!
    quantity: Int!
    price: Int!
    sale: Int!
    total: Int!
    product: Product!
  }

  type Order {
    id: ID!
    code: Int!
    authorId: String!
    subtotal: Int!
    total: Int!
    discount: Int!
    shippingFee: Int!
    status: String!
    paymentMethod: String!
    paymentStatus: String!
    note: String
    shippingName: String
    shippingPhone: String
    shippingEmail: String
    shippingAddress: String
    items: [OrderItem!]!
    author: Author!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderPagination {
    data: [Order!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type Comment {
    id: ID!
    content: String!
    rating: Int!
    productId: String!
    authorId: String
    email: String!
    name: String!
    isActive: Boolean!
    isHot: Boolean!
    product: Product!
    author: Author
    createdAt: DateTime!
  }
  type CommentPagination {
    data: [Comment!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type CanCommentResponse {
    canComment: Boolean!
    hasPurchased: Boolean!
    hasCommented: Boolean!
  }

  type WeeklyOrder {
    month: String!
    orders: Int!
  }

  type TopOrderUser {
    author: Author
    orderCount: Int
    totalAmount: Float
  }
  type MonthlyOrder {
    month: String
    orders: Int
    revenue: Float
  }

  type AuthorRegisterInMonth {
    month: String
    count: Int
  }
  type BrowserVisitStat {
    browser: String!
    count: Int!
  }

  input CreateAuthorInput {
    firstName: String
    lastName: String
    email: String!
    password: String!
    phone: String
    image: String
    roleId: String
  }

  input ForgetPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }
 

  input CreateProductInput {
    title: String
    image: String
    publicId: String
    description: String
    stock: Int
    price: Int
    rating: Int
    sale: Int
    authorId: String
    categories: [ID!]
    imageUrls: [String!]
    imagePublicIds: [String!]
  }

  input CreatePostInput {
    title: String
    image: String
    publicId: String
    content: String
    authorId: String
  }

  input CreateCategoryInput {
    name: String
    description: String
    image: String
    authorId: String
    publicId: String
  }

  input UpdateAuthorInput {
    id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    phone: String
    image: String
    isActive: Boolean
    roleId: String
    newpassword: String
    oldPassword: String
    publicId: String
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    description: String
    image: String
    authorId: String
    publicId: String
  }

  input UpdatePostInput {
    id: ID!
    title: String
    image: String
    content: String
    authorId: String
    publicId: String
  }

  input UpdateProductInput {
    id: ID!
    title: String
    image: String
    description: String
    publicId: String
    stock: Int
    price: Int
    rating: Int
    sale: Int
    soldCount: Int
    isActive: Boolean
    isHot: Boolean
    authorId: String
    categories: [ID!]
    imageUrls: [String!]      
    imagePublicIds: [String!]
  }

  input LoginAuthInput {
    email: String!
    password: String!
  }

  input UpdateShippingAddressInput {
    authorId: String!
    name: String!
    email: String!
    phone: String!
    address: String!
  }
  input CreateSlideInput {
    title: String!
    image: String
    link: String
    isActive: Boolean
    publicId: String
    authorId: String
  }

  input UpdateSlideInput {
    id: ID!
    title: String
    image: String
    link: String
    isActive: Boolean
    publicId: String
    authorId: String
  }

  input SiteConfigInput {
    key: String!
    value: String
    publicId: String
    authorId: String
  } 
  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Int!
    sale: Int!
  }

  input CreateOrderInput {
    authorId: ID
    items: [OrderItemInput!]!
    paymentMethod: String
    note: String
    shippingName: String
    shippingPhone: String
    shippingEmail: String
    shippingAddress: String
    discount: Int
    shippingFee: Int
  }

  input CreateCommentInput {
    productId: ID!
    content: String!
    rating: Int!
    email: String!
    name: String!
    authorId: ID
  }
  
  type Query {
    author(id: ID!): Author
    adminAuthor(page: Int, pageSize: Int, search: String): AuthorPagination!
    me: Author
    adminRole: [Role!]!
    products(page: Int, pageSize: Int, search: String, categories: [ID!]): ProductPagination!
    posts(page: Int, pageSize: Int, search: String): PostPagination!
    slides(page: Int, pageSize: Int, search: String) : SlidePagination!
    shippingAddress : [ShippingAddress]!
    adminCategories(page: Int, pageSize: Int, search: String): AdminCategoryPagination!

    siteConfigs(page: Int, pageSize: Int, search: String) : SiteConfigPagination!
    siteConfig(key: String!): SiteConfig
    
    categories: [Category!]!
    allSlides: [Slide!]!
    saleProducts: [Product!]!
    newArrivals : [Product!]!
    productBestSeller: [Product!]!
    postDetail(slug: String!): Post
    productDetail(slug: String!): Product
    categoryBySlug(slug: String!): Category

    wishlists(authorId: ID!): [Wishlist!]!
    wishlist(authorId: ID!, productId: ID!): Wishlist

    orders(page: Int, pageSize: Int, search: String, status: String, authorId: ID): OrderPagination!
    order(id: ID!): Order
    myOrders(authorId: ID!, page: Int, pageSize: Int, status: String): OrderPagination!
    
    adminOrders(page: Int, pageSize: Int, search: String): OrderPagination!

    getHomePageComments: [Comment!]!
    getComments(productId: ID!): [Comment!]!
    getCommentAdmins(page: Int, pageSize: Int, search: String): CommentPagination!
    canComment(productId: ID!, email: String!): CanCommentResponse!

    weeklyOrders(authorId: ID!): [WeeklyOrder!]!
    topOrderUsers(limit: Int): [TopOrderUser]
    monthlyOrders: [MonthlyOrder]
    getAllComments: [Comment]
    authorRegisterInMonth: [AuthorRegisterInMonth]
    browserVisitStats: [BrowserVisitStat!]!
  }
  type Mutation {
    createAuthor(data: CreateAuthorInput!): Author!
    createProduct(data: CreateProductInput!) : Product!
    createCategory(data: CreateCategoryInput!) : Category!
    createPost(data: CreatePostInput!) : Post!

    updateAuthor(data: UpdateAuthorInput!): Author!
    updateCategory(data: UpdateCategoryInput!): Category!
    updateProduct(data: UpdateProductInput) : Product!
    updatePost (data: UpdatePostInput) : Post!

    createSlide(data: CreateSlideInput!): Slide!
    updateSlide(data: UpdateSlideInput!): Slide!
    
    deleteSlide(id: ID!): Slide!
    deleteSlides(ids: [ID!]!): [Slide!]!

    deletePost(id: ID!): Post!
    deletePosts(ids: [ID!]!): [Post!]!

    deleteProduct(id: ID!): Product!
    deleteProducts(ids: [ID!]!): [Product!]!
    deleteCategory(id: ID!): Category!
    deleteAuthor(id: ID!): Author!
    deleteAuthors(ids: [ID!]!): [Author!]!
    deleteCategories(ids: [ID!]!): [Category!]!

    
    
    loginAuth(data: LoginAuthInput!): AuthPayload!
    forgetPassword(data: ForgetPasswordInput!): MessageResponse
    resetPassword(data: ResetPasswordInput!): MessageResponse

    updateShippingAddress(data: UpdateShippingAddressInput!): ShippingAddress
    
    upsertSiteConfig(configs: SiteConfigInput!): SiteConfig!
    upsertSiteConfigs(configs: [SiteConfigInput!]!): [SiteConfig!]!

    deleteSiteConfig(id: ID!): SiteConfig!
    deleteSiteConfigs(ids: [ID!]!): [SiteConfig!]!

    refreshToken: AuthPayload!
    logout: String!

    toggleWishlist(authorId: ID!, productId: ID!): WishlistToggleResponse!
    removeWishlist(authorId: ID!, productId: ID!): Wishlist!

    createOrder(data: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    cancelOrder(id: ID!, authorId: ID!): Order!
    deleteOrder(id: ID!): Order!


    createComments(data: CreateCommentInput!): Comment!
    updateStatusComments(id: ID!, isActive: Boolean!): Comment!
    updateHotComments(id: ID!, isHot: Boolean!): Comment!
    deleteComments(id: ID!): Comment!
    trackBrowserVisit(browser: String!): Boolean
  }
`;