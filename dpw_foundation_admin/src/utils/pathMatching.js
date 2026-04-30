const isPathMatch = (routePath, currentPath) => {
  const routeSegments = routePath.split('/');
  const currentSegments = currentPath.split('/');

  // If the number of segments doesn't match, it's not a match
  if (routeSegments.length !== currentSegments.length) {
    return false;
  }

  // Compare each segment
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const currentSegment = currentSegments[i];

    // If the route segment is a dynamic segment (starts with ':'), skip comparison
    if (routeSegment.startsWith(':')) {
      continue;
    }

    // If the segments don't match, it's not a match
    if (routeSegment !== currentSegment) {
      return false;
    }
  }

  // If all segments match, it's a match
  return true;
};

export default isPathMatch;
