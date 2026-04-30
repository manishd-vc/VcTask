import { NextResponse } from 'next/server';
import isPathMatch from './utils/pathMatching';
import { checkPermissions } from './utils/permissions';
import protectedRoutes from './utils/protectedRoutes';

const basePath = process.env.BASE_PATH || '';
const authPages = ['/auth/login', '/auth/forgot-password', '/auth/reset-password', '/auth/reset-password/:token'];
const defaultRedirect = '/auth/login';
const dashboardPath = '/admin/dashboard';

const handleRedirection = (req, path) => NextResponse.redirect(new URL(`${basePath}${path}`, req.url));

export const config = {
  matcher: [`/dpwfadm/:path*`, `/dpwfadm`, `/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)`]
};

function stripBasePath(pathname, basePath) {
  return pathname.startsWith(basePath) ? pathname.slice(basePath.length) || '/' : pathname;
}

function isProtectedRoute(path, token, authPages) {
  return !token && path.startsWith('/admin') && !authPages.includes(path) && path.startsWith('/');
}

function shouldRedirectToDefault(path, token) {
  return !token && path === '/';
}

export async function middleware(req) {
  const token = req.cookies.get('adminToken');
  const roles = req.cookies.get('assignRoles');
  const rolesValue = roles?.value ?? '';
  const allRoles = rolesValue.split(',');
  const { pathname } = req.nextUrl;
  const pathWithoutQuery = pathname.split('?')[0];
  const pathWithoutBase = stripBasePath(pathname, basePath);

  if (authPages.includes(pathWithoutBase)) {
    // Handle unauthenticated users accessing auth pages
    if (!token || !allRoles.length) {
      return NextResponse.next();
    }

    return handleRedirection(req, dashboardPath);
  }

  // Redirect authenticated users from root path to their allowed path
  if (pathWithoutBase === '/' && token && allRoles.length) {
    return handleRedirection(req, dashboardPath);
  }
  if (shouldRedirectToDefault(pathWithoutBase, token)) {
    return handleRedirection(req, defaultRedirect);
  }

  // Check if the current route is protected
  if (isProtectedRoute(pathWithoutBase, token, authPages)) {
    return handleRedirection(req, defaultRedirect);
  }
  const protectedRoute = protectedRoutes.find((route) => isPathMatch(route.path, pathWithoutQuery));

  if (protectedRoute && allRoles.length && pathWithoutBase.startsWith('/admin')) {
    // Skip permission check if no permissions are required
    if (protectedRoute.requiredPermissions.length === 0) {
      return NextResponse.next();
    }
    const hasPermission = checkPermissions(allRoles, protectedRoute.requiredPermissions);
    if (!hasPermission) {
      return handleRedirection(req, '/unauthorized');
    }
  }

  return NextResponse.next();
}
