import type { Context } from "https://edge.netlify.com";

interface MetaConfig {
    title: string;
    description: string;
    image: string;
}

export default async (req: Request, context: Context) => {
    const url = new URL(req.url);
    const path = url.pathname;

    // Only process HTML requests
    if (!req.headers.get("accept")?.includes("text/html")) {
        return context.next();
    }

    // Meta tag configurations for different routes
    const metaConfig: Record<string, MetaConfig> = {
        "/portfolio/": {
            title: "Portfolio - James Tasse",
            description:
                "My portfolio of technical writing and software projects, including interactive 3D demos.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
        },
        "/portfolio": {
            title: "Portfolio - James Tasse",
            description:
                "My portfolio of technical writing and software projects, including interactive 3D demos.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
        },
        "/portfolio/orc-demo": {
            title: "ORC Demo - Interactive 3D Visualization",
            description:
                "Experience an interactive 3D demonstration of the ORC system with hand gesture controls.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
        },
        "/portfolio/orc-demo/": {
            title: "ORC Demo - Interactive 3D Visualization",
            description:
                "Experience an interactive 3D demonstration of the ORC system with hand gesture controls.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
        },
        "/portfolio/docs": {
            title: "Technical Documentation - James Tasse",
            description: "Comprehensive technical documentation and guides.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
        },
        "/portfolio/docs/": {
            title: "Technical Documentation - James Tasse",
            description: "Comprehensive technical documentation and guides.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
        },
    };

    const config = metaConfig[path];

    // If no specific config for this path, continue normally
    if (!config) {
        return context.next();
    }

    // Get the response
    const response = await context.next();

    // Only modify HTML responses
    if (!response.headers.get("content-type")?.includes("text/html")) {
        return response;
    }

    // Read the response body
    const html = await response.text();

    // Create new meta tags
    const metaTags = `
    <meta property="og:title" content="${config.title.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${config.description.replace(/"/g, "&quot;")}" />
    <meta property="og:image" content="${config.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${config.title.replace(/"/g, "&quot;")}" />
    <meta name="twitter:description" content="${config.description.replace(/"/g, "&quot;")}" />
    <meta name="twitter:image" content="${config.image}" />`;

    // Replace or inject meta tags in the head
    const modifiedHtml = html.replace(
        /<meta property="og:title"[^>]*>|<meta property="og:description"[^>]*>|<meta property="og:image"[^>]*>/g,
        ""
    );

    const finalHtml = modifiedHtml.replace("</head>", `${metaTags}</head>`);

    // Return modified response
    return new Response(finalHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
};
