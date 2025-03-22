"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const product_entity_1 = require("./database/models/product.entity");
const dotenv = __importStar(require("dotenv"));
// Load environment variables
const envPath = path_1.default.resolve(process.cwd(), "app/backend/.env");
dotenv.config({ path: envPath });
const app = (0, express_1.default)();
const port = process.env.PORT || 8081;
const isCI = process.env.NODE_ENV === "ci";
const isProd = process.env.NODE_ENV === "production";
// CORS setup
app.use((0, cors_1.default)({
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods",
    ],
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    origin: "*",
}));
app.use(express_1.default.json());
// Health check endpoint for CI testing
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// Serve static files in production
if (isProd) {
    // Try looking for files in different possible locations
    const possiblePaths = [
        path_1.default.join(__dirname, "../../../dist/MyStore"),
        path_1.default.join(__dirname, "../../MyStore"),
        path_1.default.join(__dirname, "../MyStore"),
        path_1.default.join(__dirname, "../../../app/MyStore/dist/my-store"),
    ];
    let staticPath = "";
    for (const p of possiblePaths) {
        if (fs_1.default.existsSync(p)) {
            staticPath = p;
            console.log(`Using static files from: ${staticPath}`);
            break;
        }
    }
    if (staticPath) {
        app.use(express_1.default.static(staticPath));
        // Serve index.html for any non-API routes
        app.get("*", (req, res) => {
            if (!req.path.startsWith("/api")) {
                res.sendFile(path_1.default.join(staticPath, "index.html"));
            }
        });
    }
    else {
        console.warn("No static files directory found");
    }
}
// Skip database connection in CI environment
if (isCI) {
    console.log("Running in CI environment - skipping database connection");
    // Mock API response for testing
    app.get("/api/products", (req, res) => {
        res.json([
            {
                id: 1,
                name: "Test Product",
                price: 99.99,
                images: ["test.jpg"],
                description: "Test description",
            },
        ]);
    });
    app.listen(port, () => {
        console.log(`Server running in CI mode at http://localhost:${port}`);
    });
}
else {
    // Configure TypeORM connection
    const dataSource = new typeorm_1.DataSource({
        type: "postgres",
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || "5432"),
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [product_entity_1.Product],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        extra: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        connectTimeoutMS: 10000,
    });
    dataSource
        .initialize()
        .then(() => {
        console.log("Connected to PostgreSQL successfully");
        // Products API
        app.get("/api/products", async (req, res) => {
            try {
                const productRepository = dataSource.getRepository(product_entity_1.Product);
                const products = await productRepository
                    .createQueryBuilder("product")
                    .select([
                    "product.id",
                    "product.name",
                    "product.price",
                    "product.description",
                    "product.images",
                ])
                    .getMany();
                // Process products to ensure consistent format
                const formattedProducts = products.map((product) => {
                    let processedImages = product.images || [];
                    // Handle different possible formats
                    if (typeof processedImages === "string") {
                        processedImages = processedImages
                            .replace(/[{}"]/g, "")
                            .split(",");
                    }
                    // Process and combine image URLs
                    const combinedImages = [];
                    if (Array.isArray(processedImages)) {
                        for (let i = 0; i < processedImages.length; i++) {
                            let img = processedImages[i];
                            if (typeof img === "string") {
                                if (img.trim().endsWith("/f_auto") &&
                                    i + 1 < processedImages.length) {
                                    const nextPart = processedImages[i + 1];
                                    if (typeof nextPart === "string" &&
                                        nextPart.trim().startsWith("q_auto")) {
                                        combinedImages.push(`${img}/${nextPart}`);
                                        i++;
                                        continue;
                                    }
                                }
                                combinedImages.push(img);
                            }
                        }
                    }
                    // Ensure valid image URLs
                    const finalImages = combinedImages
                        .map((img) => {
                        if (!img || typeof img !== "string")
                            return "";
                        let cleanUrl = img.trim();
                        // Fix URL format
                        if (cleanUrl.startsWith("//")) {
                            return `https:${cleanUrl}`;
                        }
                        else if (cleanUrl.startsWith("static.nike.com")) {
                            return `https://${cleanUrl}`;
                        }
                        else if (!cleanUrl.startsWith("http")) {
                            if (cleanUrl.startsWith("q_auto") ||
                                cleanUrl.includes("/dri-fit") ||
                                cleanUrl.includes(".png") ||
                                cleanUrl.includes(".jpg")) {
                                return `https://static.nike.com/a/images/${cleanUrl}`;
                            }
                            return "";
                        }
                        return cleanUrl;
                    })
                        .filter((url) => url !== "");
                    // Add fallback if no images
                    if (finalImages.length === 0) {
                        finalImages.push("https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-mens-shoes-jBrhbr.png");
                    }
                    return { ...product, images: finalImages };
                });
                res.json(formattedProducts);
            }
            catch (error) {
                console.error("Database error:", error);
                res.status(500).json({ error: "Error fetching products" });
            }
        });
        // Single product API
        app.get("/api/products/:id", async (req, res) => {
            try {
                const productId = Number(req.params.id);
                if (isNaN(productId)) {
                    return res.status(400).json({ error: "Invalid product ID" });
                }
                const productRepository = dataSource.getRepository(product_entity_1.Product);
                const product = await productRepository.findOneBy({ id: productId });
                if (product) {
                    res.json(product);
                }
                else {
                    res.status(404).json({ error: "Product not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Error fetching product" });
            }
        });
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
        .catch((error) => {
        console.error("Database connection error:", error);
    });
}
//# sourceMappingURL=server.js.map