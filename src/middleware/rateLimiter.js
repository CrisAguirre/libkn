const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { message: 'Demasiadas solicitudes, intente más tarde' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Demasiados intentos de login, intente en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter, authLimiter };
