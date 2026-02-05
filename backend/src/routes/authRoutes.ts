import { Router } from 'express';

const router = Router();

// Placeholder routes to get the server running
router.post('/register', (req, res) => {
    res.status(201).json({ success: true, message: "User registered successfully" });
});

router.post('/login', (req, res) => {
    res.status(200).json({ success: true, message: "Login successful" });
});

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Aqua Glow Deluxe', price: 250 },
      { id: 2, name: 'Exterior Express', price: 150 }
    ]
  });
});

export default router;