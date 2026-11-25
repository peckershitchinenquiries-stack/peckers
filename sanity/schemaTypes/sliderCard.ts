import { defineType, defineField } from "sanity";

export default defineType({
    name: "sliderCard",
    title: "Homepage Slider Cards",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "image",
            title: "Card Image",
            type: "image",
            options: { hotspot: true },
            description: "Shown on the card. If a Card Video is added below, this image becomes the poster frame the video loads over — so keep it filled in either way.",
        }),
        defineField({
            name: "video",
            title: "Card Video (optional)",
            type: "file",
            options: { accept: "video/*" },
            description: "Optional short MP4 loop that replaces the image on this card. It plays muted and on repeat, so no sound. Keep it 3-6 seconds and under about 5MB.",
        }),
        defineField({
            name: "order",
            title: "Order",
            type: "number",
        }),
        defineField({
            name: "caption",
            title: "Caption",
            type: "text",
            rows: 3,
        }),
    ],
});