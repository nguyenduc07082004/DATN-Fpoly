export const languageMiddleware = (req, res, next) => {
    // Kiểm tra ngôn ngữ từ header hoặc query parameter
    const lang = req.headers['accept-language'] || req.query.lang || 'en';
    req.lang = lang;
    next();
  };
  