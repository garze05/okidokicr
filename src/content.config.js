// // 1. Import utilities from `astro:content`
// import { defineCollection, z } from "astro:content";

// // 2. Import loader(s)
// import { glob, file } from "astro/loaders";

// // 3. Define your collection(s)
// const testimonials = defineCollection({
//   schema: z.object({
//     title: z.string(),
//     author: z.string(),
//     role: z.string(),
//     videoFile: z.string().regex(/^\/videos\/\w+\.(mp4|webm|mov)$/, {
//       message: "Ruta inválida. Ejemplo: /videos/testimonio.mp4",
//     }),
//   }),
// });

// const ads = defineCollection({});
// // const blog = defineCollection({ /* ... */ });
// // const dogs = defineCollection({ /* ... */ });

// // 4. Export a single `collections` object to register your collection(s)
// export const collections = { testimonials, ads };
