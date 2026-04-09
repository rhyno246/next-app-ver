import { gql } from "@apollo/client"
export const GET_PRODUCTS = gql`
    query Products($page: Int, $pageSize: Int, $search: String , $categories: [ID!]) {
        products(page: $page, pageSize: $pageSize, search: $search ,  categories: $categories) {
            data {
                id
                title
                image
                publicId
                description
                price
                stock
                sale
                rating
                isActive
                isHot
                soldCount
                slug
                createdAt
                updatedAt
                author {
                    id
                    firstName
                    lastName
                }
                categories {
                    category {
                        id
                        name
                    }
                }
                images {
                    id
                    url
                    publicId
                }
            }
            total
            page
            pageSize
            totalPages
        }
    }
`

export const GET_ME = gql`
    query Me {
        me {
        updatedAt
        roleId
        phone
        password
        lastName
        isActive
        image
        id
        firstName
        email
        createdAt
        provider
        publicId
        shippingAddress { 
            name
            email
            phone
            address
        }
        role {
            name
        }
    }
}
`

export const GET_CATEGORIES = gql`
    query Categories {
        categories {
            updatedAt
            publicId
            products {
                product {
                    title
                    id
                }
            }
            name
            slug
            image
            id
            description
            createdAt
            authorId
            author {
                id
                email
                firstName
                lastName
            }
        }
    }
`

export const GET_ADMIN_CATEGORIES = gql`
    query AdminCategories($page: Int, $pageSize: Int, $search: String) {
        adminCategories(page: $page, pageSize: $pageSize, search: $search) {
            data {
                id
                name
                description
                image
                publicId
                authorId
                createdAt
                updatedAt
            }
            total
            page
            pageSize
            totalPages
        }
    }
`

export const GET_ADMIN_AUTHOR = gql`
    query AdminAuthor($page: Int, $pageSize: Int, $search: String) {
        adminAuthor(page: $page, pageSize: $pageSize, search: $search) {
            totalPages
            total
            pageSize
            page
            data {
                firstName
                email
                updatedAt
                roleId
                publicId
                provider
                phone
                password
                lastName
                isActive
                image
                id
                createdAt
                role {
                    id
                    name
                    updatedAt
                    createdAt
                }
            }
        }
    }
`

export const ADMIN_ROLE = gql`
    query AdminRole {
        adminRole {
            name
            id
            createdAt
            updatedAt
        }
    }
`

export const GET_SLIDES = gql`
    query Slides($page: Int, $pageSize: Int, $search: String) {
        slides(page: $page, pageSize: $pageSize, search: $search) {
            data {
                id
                title
                image
                publicId
                link
                isActive
                createdAt
                updatedAt
                author {
                    id
                    firstName
                    lastName
                }
            }
            total
            page
            pageSize
            totalPages
        }
    }
`

export const GET_ALL_SLIDES = gql`
  query AllSlides {
    allSlides {
      id
      title
      image
      publicId
      link
      isActive
    }
  }
`

export const GET_SALE_PRODUCT = gql`
    query SaleProducts {
        saleProducts {
            title
            updatedAt
            stock
            soldCount
            slug
            sale
            rating
            publicId
            price
            isHot
            isActive
            image
            id
            description
            createdAt
            count
            categories {
                category {
                    name
                }
            }
        }
    }
`

export const GET_SITE_CONFIGS = gql`
    query SiteConfig($page: Int, $pageSize: Int, $search: String) {
        siteConfigs(page: $page, pageSize: $pageSize, search: $search) {
            totalPages
            total
            pageSize
            page
            data {
                value
                updatedAt
                publicId
                key
                id
                createdAt
            }
        }
    }
`

export const GET_SITE_CONFIG = gql`
    query SiteConfig($key: String!) {
        siteConfig(key: $key) {
            value
            updatedAt
            key
            id
            createdAt
        }
    }
`

export const GET_POSTS = gql`
    query Posts($page: Int, $pageSize: Int, $search: String) {
        posts(page: $page, pageSize: $pageSize, search: $search) {
            totalPages
            total
            pageSize
            page
            data {
                title
                updatedAt
                slug
                publicId
                image
                id
                createdAt
                content
                authorId
            }
        }
    }
`

export const GET_POST_DETAIL = gql`
    query PostDetail($slug: String!) {
        postDetail(slug: $slug) {
            updatedAt
            title
            slug
            publicId
            image
            id
            createdAt
            content
            authorId
            author {
            email
            firstName
            lastName
            }
        }
    }
`

export const GET_SITE_CONFIG_MULTI = gql`
    query GetSiteConfigMulti {
        logo: siteConfig(key: "system_logo") {
            value
            updatedAt
            key
            id
            createdAt
        }
        phone: siteConfig(key: "system_phone") {
            value
            updatedAt
            key
            id
            createdAt
        }
        linkedin: siteConfig(key: "linkedin_link") {
            value
            updatedAt
            key
            id
            createdAt
        }
        facebook: siteConfig(key: "facebook_link") {
            value
            updatedAt
            key
            id
            createdAt
        }
        address: siteConfig(key: "system_address") {
            value
            updatedAt
            key
            id
            createdAt
        }
        email: siteConfig(key: "system_email") {
            value
            updatedAt
            key
            id
            createdAt
        }
    }
    
`

export const GET_NEW_ARRIVALS = gql`
    query NewArrivals {
        newArrivals {
            updatedAt
            title
            stock
            soldCount
            slug
            sale
            rating
            publicId
            price
            isHot
            isActive
            images {
                publicId
                productId
                url
                id
                createdAt
            }
            image
            id
            description
            createdAt
            count
            categories {
                category {
                    slug
                    image
                    id
                    name
                }
            }
        }
    }
`

export const GET_BEST_SELLER = gql`
query ProductBestSeller {
  productBestSeller {
    stock
    title
    updatedAt
    soldCount
    slug
    sale
    rating
    publicId
    price
    isHot
    isActive
    image
    id
    description
    createdAt
    count
    categories {
      category {
        slug
        name
        id
      }
    }
    images {
      id
      productId
      publicId
      url
    }
    author {
      id
      email
    }
  }
}
`

export const GET_PRODUCT_DETAIL = gql`
    query ProductDetail($slug: String!) {
        productDetail(slug: $slug) {
            updatedAt
            title
            stock
            soldCount
            slug
            sale
            rating
            publicId
            price
            isHot
            isActive
            image
            id
            description
            createdAt
            count
            categories {
            category {
                    name
                    slug
                    image
                    publicId
                    updatedAt
                    id
                    description
                    createdAt
                    authorId
                }
            }
            author {
                email
                id
                firstName
                lastName
            }
            images {
                url
                publicId
                productId
                id
                createdAt
            }
        }
    }
`

export const GET_WISHLISTS = gql`
    query Wishlists($authorId: ID!) {
        wishlists(authorId: $authorId) {
            id
            product {
            title
            updatedAt
            stock
            soldCount
            slug
            sale
            rating
            publicId
            price
            isHot
            isActive
            images {
                url
                publicId
                productId
                id
                createdAt
            }
            image
            id
            description
            createdAt
            count
            categories {
                category {
                name
                id
                }
            }
            }
        }
    }
`

export const CATEGORY_BY_SLUG = gql`
query Categories($slug: String!) {
  categoryBySlug(slug: $slug) {
    products {
      product {
        title
        updatedAt
        stock
        soldCount
        slug
        sale
        rating
        publicId
        price
        isHot
        isActive
        images {
          url
          publicId
          productId
          id
          createdAt
        }
        image
        id
        description
        createdAt
        count
      }
    }
  }
}
`

export const GET_MY_ORDERS = gql`
  query MyOrders($authorId: ID!, $page: Int, $pageSize: Int, $status: String) {
    myOrders(authorId: $authorId, page: $page, pageSize: $pageSize, status: $status) {
      data {
        id
        code
        total
        subtotal
        discount
        shippingFee
        status
        paymentMethod
        shippingName
        shippingEmail
        createdAt
        items {
          id
          quantity
          price
          sale
          total
          product {
            id
            title
            price
            image
            slug
          }
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`


export const GET_ADMIN_ORDERS = gql`
  query AdminOrders($page: Int, $pageSize: Int, $search: String) {
    adminOrders(page: $page, pageSize: $pageSize, search: $search) {
      data {
        id
        code
        shippingName
        shippingEmail
        shippingPhone
        shippingAddress
        paymentMethod
        total
        subtotal
        discount
        shippingFee
        status
        note
        createdAt
        items {
          id
          quantity
          price
          sale
          total
          product {
            id
            title
            image
          }
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`

export const GET_COMMENTS = gql`
    query GetComments($productId: ID!) {
        getComments(productId: $productId) {
            id
            content
            rating
            name
            email
            createdAt
            author {
                id
                firstName
                lastName
                image
            }
        }
    }
`

export const CAN_COMMENT = gql`
    query CanComment($productId: ID!, $email: String!) {
        canComment(productId: $productId, email: $email) {
            canComment
            hasPurchased
            hasCommented
        }
    }
`

export const GET_COMMENT_ADMINS = gql`
  query GetCommentAdmins($page: Int, $pageSize: Int, $search: String) {
    getCommentAdmins(page: $page, pageSize: $pageSize, search: $search) {
      data {
        id
        content
        rating
        email
        name
        isActive
        isHot
        productId
        createdAt
        product {
          id
          title
        }
        author {
          id
          firstName
          lastName
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`

export const GET_COMMENTS_HOME = gql`
    query GetHomePageComments {
        getHomePageComments {
            name
            rating
            content
            createdAt
            author {
                image
            }
        }
    }
`

export const GET_WEEKLY_ORDERS = gql`
  query WeeklyOrders($authorId: ID!) {
    weeklyOrders(authorId: $authorId) {
      month
      orders
    }
  }
`;

export const GET_TOP_ORDER_USERS = gql`
  query TopOrderUsers($limit: Int) {
    topOrderUsers(limit: $limit) {  
        orderCount
        totalAmount
        author {
            lastName
            firstName
            email
            image
        }
    }
  }
`;

export const GET_MONTHLY_ORDERS = gql`
  query MonthlyOrders {
    monthlyOrders {
      month
      orders
      revenue
    }
  }
`;

export const GET_ALL_COMMENTS = gql`
  query GetAllComments {
    getAllComments {
      id
      content
      rating
      isActive
      isHot
      createdAt
      author {
        firstName
        lastName
        email
        image
      }
      product {
        id
        title
        price
      }
    }
  }
`;

export const GET_AUTHOR_REGISTER_IN_MONTH = gql`
  query AuthorRegisterInMonth {
    authorRegisterInMonth {
      month
      count
    }
  }
`;

export const TRACK_BROWSER = gql`
  mutation TrackBrowserVisit($browser: String!) {
    trackBrowserVisit(browser: $browser)
  }
`;

export const GET_STATS = gql`
  query BrowserVisitStats {
    browserVisitStats {
      browser
      count
    }
  }
`;