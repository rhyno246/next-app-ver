import { CategoryModel } from "./model/category.model";
import { ProductModel } from "./model/product.model";
import { AuthMutation } from "./mutation/auth.mutation";
import { AuthorMutation } from "./mutation/author.mutation";
import { BrowserVisitMutation } from "./mutation/browser.mutation";
import { CategoryMutation } from "./mutation/category.mutation";
import { CommentsMutation } from "./mutation/comments.mutation";
import { OrderMutation } from "./mutation/order.mutation";
import { PostsMutation } from "./mutation/post.mutation";
import { ProductMutation } from "./mutation/product.mutation";
import { ShippingAddressMutation } from "./mutation/shippingAddress.mutation";
import { SiteConfigMutation } from "./mutation/siteconfig.mutation";
import { SlideMutation } from "./mutation/slide.mutation";
import { WishlistMutation } from "./mutation/wishlist.mutation";
import { AuthorQuery } from "./query/author.query";
import { BrowserVisitQuery } from "./query/browser.query";
import { CategoryQuery } from "./query/category.query";
import { CommentsQuery } from "./query/comments.query";
import { OrderQuery } from "./query/order.query";
import { PostsQuery } from "./query/post.query";
import { ProductQuery } from "./query/product.query";
import { ShippingAddressQuery } from "./query/shippingAddress.query";
import { SiteConfigQuery } from "./query/siteconfig.query";
import { SlideQuery } from "./query/slide.query";
import { WishlistQuery } from "./query/wishlist.query";

export const resolvers = {
  Query: {
    ...AuthorQuery,
    ...CategoryQuery,
    ...ProductQuery,
    ...ShippingAddressQuery,
    ...SlideQuery,
    ...SiteConfigQuery,
    ...PostsQuery,
    ...WishlistQuery,
    ...OrderQuery,
    ...CommentsQuery,
    ...BrowserVisitQuery
  },
  Mutation: {
    ...AuthorMutation,
    ...CategoryMutation,
    ...ProductMutation,
    ...AuthMutation,
    ...ShippingAddressMutation,
    ...SlideMutation,
    ...SiteConfigMutation,
    ...PostsMutation,
    ...WishlistMutation,
    ...OrderMutation,
    ...CommentsMutation,
    ...BrowserVisitMutation
  },
  Product: ProductModel,
  Category: CategoryModel,
};