import { defineType, defineField } from "sanity";

export default defineType({
    name: "location",
    title: "Homepage Location Cards",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Location Name",
            type: "string",
            description:
                "Must match the town exactly — 'Hitchin', 'Stevenage', 'Welwyn Garden City' or 'Hertford' — so the homepage card picks up this image.",
        }),
        defineField({
            name: "subtitle",
            title: "Location Subtitle",
            type: "string",
        }),
        defineField({
            name: "image",
            title: "Location Image",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            description:
                "Open stores link through to their own page. Coming soon cards show the badge below and are not clickable, because there is no page to open yet.",
            options: {
                list: [
                    { title: "Open", value: "open" },
                    { title: "Coming Soon", value: "comingSoon" },
                ],
                layout: "radio",
            },
            initialValue: "open",
        }),
        defineField({
            name: "badgeText",
            title: "Badge Text",
            type: "string",
            description:
                "Only shown on Coming Soon cards. Leave empty for the default, 'Coming Soon'.",
            hidden: ({ parent }) => parent?.status !== "comingSoon",
        }),
        defineField({
            name: "order",
            title: "Order",
            type: "number",
            description:
                "Lowest number first. Leave empty and the card falls back to the order set in the code.",
        }),
    ],
    preview: {
        select: { title: "name", status: "status", media: "image" },
        prepare({ title, status, media }) {
            return {
                title: title || "Untitled location",
                subtitle: status === "comingSoon" ? "Coming soon" : "Open",
                media,
            };
        },
    },
});
