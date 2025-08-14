import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOrderSchema, insertMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { z } from "zod";

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", upload.single("logo"), async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        email: req.body.email,
        password: req.body.password,
        companyName: req.body.companyName,
        unp: req.body.unp,
        directorName: req.body.directorName,
        phone: req.body.phone,
        address: req.body.address,
        logoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });

      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check for admin credentials
      if (email === "admin@admin.by" && password === "admin") {
        const adminUser = await storage.getUserByEmail(email);
        if (!adminUser) {
          // Create admin user if doesn't exist
          const adminData = {
            email: "admin@admin.by",
            password: "admin",
            companyName: "Семь Драконов",
            unp: "000000000",
            directorName: "Администратор",
            phone: "+375291234567",
            address: "г. Минск",
            isAdmin: true,
          };
          const admin = await storage.createUser(adminData);
          return res.json({ user: { ...admin, password: undefined } });
        }
        return res.json({ user: { ...adminUser, password: undefined } });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Неверный email или пароль" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Ошибка авторизации" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Ошибка получения категорий" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Ошибка получения товаров" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Ошибка получения товара" });
    }
  });

  // Admin product management
  app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        ageGroup: req.body.ageGroup,
        material: req.body.material,
        country: req.body.country,
        price5: req.body.price5,
        price20: req.body.price20,
        price50: req.body.price50,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
        inStock: req.body.inStock === 'true'
      };

      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ message: "Ошибка создания товара" });
    }
  });

  app.put("/api/products/:id", upload.single("image"), async (req, res) => {
    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        ageGroup: req.body.ageGroup,
        material: req.body.material,
        country: req.body.country,
        price5: req.body.price5,
        price20: req.body.price20,
        price50: req.body.price50,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
        inStock: req.body.inStock === 'true'
      };

      const product = await storage.updateProduct(parseInt(req.params.id), productData);
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(400).json({ message: "Ошибка обновления товара" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(parseInt(req.params.id));
      res.json({ message: "Товар удален" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(400).json({ message: "Ошибка удаления товара" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Create chat for this order
      const chat = await storage.createChat({
        orderId: order.id,
        userId: order.userId,
      });

      res.json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ message: "Ошибка создания заказа" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getUserOrders(parseInt(req.params.userId));
      res.json(orders);
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Ошибка получения заказов" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Get all orders error:", error);
      res.status(500).json({ message: "Ошибка получения заказов" });
    }
  });

  // Admin statistics
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      const users = await storage.getAllUsers();
      
      const stats = {
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0),
        ordersByStatus: orders.reduce((acc: any, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {})
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ message: "Ошибка получения статистики" });
    }
  });

  // Get all users (admin only)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get user orders by user ID (admin only)
  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { status, deliveryDate } = req.body;
      const order = await storage.updateOrderStatus(parseInt(req.params.id), status, deliveryDate);
      res.json(order);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(400).json({ message: "Ошибка обновления статуса заказа" });
    }
  });

  // Chat routes
  app.get("/api/chats/user/:userId", async (req, res) => {
    try {
      const chats = await storage.getChatsByUserId(parseInt(req.params.userId));
      res.json(chats);
    } catch (error) {
      console.error("Get user chats error:", error);
      res.status(500).json({ message: "Ошибка получения чатов" });
    }
  });

  app.get("/api/chats", async (req, res) => {
    try {
      const chats = await storage.getAllChats();
      res.json(chats);
    } catch (error) {
      console.error("Get all chats error:", error);
      res.status(500).json({ message: "Ошибка получения чатов" });
    }
  });

  app.get("/api/chats/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      console.error("Get chat messages error:", error);
      res.status(500).json({ message: "Ошибка получения сообщений" });
    }
  });

  app.post("/api/chats/:id/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        chatId: parseInt(req.params.id),
        senderId: req.body.senderId,
        content: req.body.content,
      });
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Create message error:", error);
      res.status(400).json({ message: "Ошибка отправки сообщения" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  const httpServer = createServer(app);
  return httpServer;
}
