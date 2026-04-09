import { gql } from "@apollo/client";

export const CREATE_AUTHOR = gql`
    mutation CreateAuthor($data: CreateAuthorInput!) {
        createAuthor(data: $data) {
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
        }
    }
`

export const LOGIN_AUHOR = gql`
    mutation LoginAuth($data: LoginAuthInput!) {
        loginAuth(data: $data) {
            user {
                phone
                password
                lastName
                isActive
                image
                id
                firstName
                email
                role {
                    name
                }
            }
            refreshToken
            message
            accessToken
        }
    }
`

export const UPDATE_CLIENT_AUTHOR = gql`
    mutation UpdateAuthor($data: UpdateAuthorInput!) {
        updateAuthor(data: $data) {
            phone
            firstName
            lastName
        }
    }
`

export const UPDATE_SHIPPING_ADDRESS = gql`
    mutation UpdateShippingAddress($data: UpdateShippingAddressInput!) {
        updateShippingAddress(data: $data) {
            name
            phone
            id
            email
            createdAt
            authorId
            address
        }
    }
`

export const FORGET_PASSWORD = gql`
    mutation ForgetPassword($data: ForgetPasswordInput!) {
    forgetPassword(data: $data) {
        message
    }
    }
`

export const RESET_PASSWORD = gql`
    mutation ResetPassword($data: ResetPasswordInput!) {
        resetPassword(data: $data) {
            message
        }
    }
`;

export const CREATE_PRODUCTS = gql`
    mutation CreateProduct($data: CreateProductInput!) {
        createProduct(data: $data) {
            title
            updatedAt
            stock
            soldCount
            slug
            sale
            rating
            price
            publicId
            isHot
            isActive
            image
            id
            description
            createdAt
            count
            author {
                firstName
                lastName
                email
                role {
                    id
                    name
                }
            }
            categories {
                category {
                    name
                    id
                    image
                }
            }
        }
    }
`


export const CREATE_CATEGORY = gql`
    mutation CreateCategory($data: CreateCategoryInput!) {
        createCategory(data: $data) {
            id
            name
            description
            image
            authorId
            createdAt
            updatedAt
        }
    }
`

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($data: UpdateCategoryInput!) {
        updateCategory(data: $data) {
            id
            name
            description
            image
            authorId
            createdAt
            updatedAt
        }
    }
`

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id) {
            id
            name
        }
    }
`

export const DELETE_CATEGORIES = gql`
    mutation DeleteCategories($ids: [ID!]!) {
        deleteCategories(ids: $ids) {
            id
            name
        }
    }
`
export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
            title
        }
    }
`

export const DELETE_PRODUCTS = gql`
    mutation DeleteProducts($ids: [ID!]!) {
        deleteProducts(ids: $ids) {
            id
            title
        }
    }
`

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($data: UpdateProductInput!) {
        updateProduct(data: $data) {
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
                role {
                    id
                    name
                }
            }
        }
    }
`

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id: ID!) {
        deleteAuthor(id: $id) {
            id
            email
        }
    }
`

export const DELETE_AUTHORS = gql`
    mutation DeleteAuthors($ids: [ID!]!) {
        deleteAuthors(ids: $ids) {
            id
            email
        }
    }
`

export const LOGOUT_AUTHOR = gql`
    mutation Mutation {
        logout
    }
`

export const CREATE_SLIDE = gql`
    mutation CreateSlide($data: CreateSlideInput!) {
        createSlide(data: $data) {
            id
            title
            image
            publicId
            link
            isActive
            createdAt
            updatedAt
        }
    }
`

export const UPDATE_SLIDE = gql`
    mutation UpdateSlide($data: UpdateSlideInput!) {
        updateSlide(data: $data) {
            id
            title
            image
            publicId
            link
            isActive
            createdAt
            updatedAt
        }
    }
`

export const DELETE_SLIDE = gql`
    mutation DeleteSlide($id: ID!) {
        deleteSlide(id: $id) {
            id
            title
        }
    }
`

export const DELETE_SLIDES = gql`
    mutation DeleteSlides($ids: [ID!]!) {
        deleteSlides(ids: $ids) {
            id
            title
        }
    }
`

export const UPDATE_SITE_CONFIG = gql`
    mutation UpsertSiteConfig($configs: SiteConfigInput!) {
        upsertSiteConfig(configs: $configs) {
            value
            updatedAt
            publicId
            key
            id
            createdAt
        }
    }
`
export const UPDATE_SITE_CONFIGS = gql`
    mutation UpsertSiteConfigs($configs: [SiteConfigInput!]!) {
        upsertSiteConfigs(configs: $configs) {
            value
            updatedAt
            publicId
            key
            id
            createdAt
        }
    }
`

export const DELETE_SITE_CONFIG = gql`
    mutation DeleteSiteConfig($id: ID!) {
        deleteSiteConfig(id: $id) {
            value
            updatedAt
            publicId
            key
            id
            createdAt
        }
    }
`

export const DELETE_SITE_CONFIGS = gql`
    mutation DeleteSiteConfigs($ids: [ID!]!) {
        deleteSiteConfigs(ids: $ids) {
            value
            updatedAt
            publicId
            key
            id
            createdAt
        }
    }
`

export const CREATE_POST = gql`
    mutation CreatePost($data: CreatePostInput!) {
    createPost(data: $data) {
        updatedAt
        title
        slug
        publicId
        image
        id
        createdAt
        content
        authorId
    }
}
`

export const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
            title
            id
        }
    }
`

export const DELETE_POSTS = gql`
    mutation DeletePosts($ids: [ID!]!) {
        deletePosts(ids: $ids) {
            id
            title
        }
    }
`

export const UPDATE_POST = gql`
    mutation UpdatePost($data: UpdatePostInput) {
        updatePost(data: $data) {
            updatedAt
            title
            slug
            publicId
            image
            id
            createdAt
            content
            authorId
        }
    }
`
export const TOGGLE_WISHLIST = gql`
    mutation ToggleWishlist($authorId: ID!, $productId: ID!) {
        toggleWishlist(authorId: $authorId, productId: $productId) {
            added
            message
        }
    }
`
export const REMOVE_WISHLIST = gql`
    mutation RemoveWishlist($authorId: ID!, $productId: ID!) {
        removeWishlist(authorId: $authorId, productId: $productId) {
            updatedAt
            productId
            product {
                id
                title
            }
            id
            createdAt
            authorId
        }
    }
`

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: CreateOrderInput!) {
    createOrder(data: $data) {
      id
      code
      total
      status
      paymentMethod
      createdAt
    }
  }
`

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!, $authorId: ID!) {
    cancelOrder(id: $id, authorId: $authorId) {
      id
      status
    }
  }
`


export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`

export const CREATE_COMMENT = gql`
    mutation CreateComments($data: CreateCommentInput!) {
        createComments(data: $data) {
            id
            content
            rating
            name
            createdAt
        }
    }
`

export const DELETE_COMMENT = gql`
  mutation DeleteComments($id: ID!) {
    deleteComments(id: $id) {
      id
    }
  }
`

export const UPDATE_STATUS_COMMENT = gql`
  mutation UpdateStatusComments($id: ID!, $isActive: Boolean!) {
    updateStatusComments(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`

export const UPDATE_HOT_COMMENT = gql`
    mutation UpdateHotComments($id: ID!, $isHot: Boolean!) {
        updateHotComments(id: $id, isHot: $isHot) {
            id
            isHot
        }
    }
`


