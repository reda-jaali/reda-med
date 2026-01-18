module.exports = (req, res, next) => {
    const protectedRoutes = ['/customers', '/transactions'];
    
    if (protectedRoutes.some(route => req.path.startsWith(route))) {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    
    next();
  };