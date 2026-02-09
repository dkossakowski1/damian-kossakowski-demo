
This project is a lightweight front-end demo built on Algolia using InstantSearch.js. The goal was to create a practical product search experience while demonstrating the core building blocks you’d expect in an ecommerce search UI: query, sorting, faceting, and a clean results layout.

I focused on fast product discovery so a shopper can go from “search” to “found it” quickly. The demo follows common ecommerce workflows: searching by name or keywords, refining by category and attributes, and sorting results to match different buyer goals.

On the UI side, the demo includes search with results stats, sorting, and a simple set of filters. Categories use a hierarchical tree (lvl0 to lvl3), with refinements for brand, price (slider), rating, and free shipping. Results render in a responsive grid with product cards showing image, title, rating, price, and key metadata. Selected filters remain visible without showing internal attribute names.

The demo uses records as the primary index, with the relevant fields enabled for search and filtering. Ranking uses Algolia’s relevance pipeline, with a custom ranking as a tiebreaker (popularity first then rating). Strict sorts are handled with replicas and the UI switches indices when a sort has been selected (Price Low to High, Price High to Low, Rating High to Low, Popularity High to Low).
