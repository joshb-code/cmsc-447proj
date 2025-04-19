/**
 * Admin Authorization Middleware
 * 
 * This middleware controls access to protected routes that require admin privileges.
 * It examines the request headers to check if the user has the 'admin' role.
 * If the user doesn't have admin rights, the request is rejected with a 403 Forbidden status.
 * 
 * Usage: Import this middleware and apply it to routes that should be restricted to admins:
 * router.post('/protected-route', authorizeAdmin, controllerFunction);
 * 
 * Security note: In a production environment, this should be enhanced with:
 * 1. JWT token validation rather than relying on request body
 * 2. Session-based authentication verification
 * 3. Role verification against a database
 * 
 * IMPORTANT: This version of the middleware is COMPLETELY BYPASSED for development/testing
 * and should never be used in production!
 */
const authorizeAdmin = (req, res, next) => {
  // For development/testing, bypass authentication completely
  console.log('[Auth Middleware] DEVELOPMENT MODE - Bypassing admin authorization check completely');
  return next();
  
  // The code below is disabled for development/testing
  // Uncomment for production use with proper authentication
  /*
  console.log('[Auth Middleware] Authorization check for admin role');
  console.log('[Auth Middleware] Request body:', req.body);
  console.log('[Auth Middleware] Request query:', req.query);
  console.log('[Auth Middleware] Request headers:', req.headers);
  
  // Check if user role exists in the request body or query and is set to 'admin'
  if (req.body.role === 'admin' || req.query.role === 'admin' || req.headers['x-role'] === 'admin') {
    console.log('[Auth Middleware] Admin role verified, proceeding...');
    // If user has admin role, allow the request to proceed
    return next();
  }
  
  // If role is not admin, return 403 Forbidden status
  return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  */
  console.log('[Auth Middleware] Authorization check for admin role');
  console.log('[Auth Middleware] Request headers:', req.headers);
  
  // Check if admin role exists in the request headers
  if (req.headers['x-role'] === 'admin') {
    console.log('[Auth Middleware] Admin role verified, proceeding...');
    // If user has admin role, allow the request to proceed
    return next();
  }
  
  // If role is not admin, return 403 Forbidden status
  console.log('[Auth Middleware] Access denied - Admin role not found');
  return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
};

module.exports = authorizeAdmin;
  