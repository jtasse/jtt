import type { Context } from "https://edge.netlify.com";

interface MetaConfig {
    title: string;
    description: string;
    image: string;
    url?: string;
}

export default async (req: Request, context: Context) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Only process HTML requests
    const accept = req.headers.get("accept") || "";
    if (!accept.includes("text/html")) {
        return context.next();
    }

    // Normalize path (remove trailing slash for matching)
    const normalizedPath = pathname.replace(/\/$/, "") || "/";

    // Meta tag configurations for different routes
    const metaConfigs: Record<string, MetaConfig> = {
        "/portfolio": {
            title: "Portfolio - James Tasse",
            description:
                "My portfolio of technical writing and software projects, including interactive 3D demos.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
            url: "https://jamestasse.tech/portfolio/",
        },
        "/portfolio/orc-demo": {
            title: "ORC Demo - Interactive 3D Visualization",
            description:
                "Experience an interactive 3D demonstration of the ORC system with hand gesture controls.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
            url: "https://jamestasse.tech/portfolio/orc-demo/",
        },
        "/portfolio/docs": {
            title: "Technical Documentation - James Tasse",
            description: "Comprehensive technical documentation and guides.",
            image: "https://jamestasse.tech/orc_page_thumbnail.png",
            url: "https://jamestasse.tech/portfolio/docs/",
        },
    };

    const config = metaConfigs[normalizedPath];

    // If no specific config for this path, continue normally
    if (!config) {
        return context.next();
    }

    // Get the response
    const response = await context.next();

    // Only modify HTML responses
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
        return response;
    }

    try {
        // Read the response body
        let html = await response.text();

        // Remove existing og: meta tags
        html = html.replace(/<meta property="og:(title|description|image|url)"[^>]*>/g, "");
        html = html.replace(/<meta name="twitter:(card|title|description|image)"[^>]*>/g, "");

        // Create new meta tags
        const metaTags = `<meta property="og:title" content="${config.title.replace(/"/g, "&quot;")}" />
<meta property="og:description" content="${config.description.replace(/"/g, "&quot;")}" />
<meta property="og:image" content="${config.image}" />
<meta property="og:url" content="${config.url || url.toString()}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${config.title.replace(/"/g, "&quot;")}" />
<meta name="twitter:description" content="${config.description.replace(/"/g, "&quot;")}" />
<meta name="twitter:image" content="${config.image}" />`;

        // Inject meta tags into the head
        const finalHtml = html.replace("</head>", `${metaTags}\n</head>`);

        // Return modified response
        return new Response(finalHtml, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        console.error("Error in inject-meta-tags edge function:", error);
        return response;
    }
};
