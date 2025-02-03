import { defineQuery } from "next-sanity";

export const allProducts = defineQuery(
    `*[_type == "product"]{
    _id,
    title,
    description,
    price,
    tags,
    isNew,
    dicountPercentage,
    "productImage": productImage.asset->url,
    }
    `
)
export const shopQuery = defineQuery(
    `*[_type == "product"]{
    _id,
    title,
    description,
    price,
    tags,
    isNew,
    dicountPercentage,
    "productImage": productImage.asset->url,
    }[0]
    `
)
