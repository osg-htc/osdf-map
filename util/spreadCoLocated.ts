import {Marker} from "@/app/types";

/** Ring radius, in degrees of latitude, used to fan out a stack of points. */
const DEFAULT_RADIUS = 0.08;

const key = ({latitude, longitude}: Marker) => `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

/**
 * Several Pelican servers can be registered at the exact same coordinate (five
 * sit on top of each other at CHTC), which leaves one marker hiding the rest.
 * This fans each stack out onto a small ring around the shared point so that
 * zooming in separates them. The offset is geographic and deterministic, so the
 * layout is stable across renders and the stack reads as a single location when
 * zoomed out.
 */
export function spreadCoLocated<T extends Marker>(points: T[], baseRadius = DEFAULT_RADIUS): T[] {

  const stacks = new Map<string, T[]>();
  points.forEach(point => {
    const stack = stacks.get(key(point)) ?? [];
    stack.push(point);
    stacks.set(key(point), stack);
  });

  return points.map(point => {
    const stack = stacks.get(key(point)) as T[];
    if (stack.length === 1) return point;

    const index = stack.indexOf(point);
    const angle = (2 * Math.PI * index) / stack.length;

    // Grow the ring for larger stacks so neighbours keep at least baseRadius apart
    const radius = Math.max(baseRadius, baseRadius / (2 * Math.sin(Math.PI / stack.length)));

    // Scale longitude by the latitude so the ring stays circular on screen
    const latitude = point.latitude + radius * Math.cos(angle);
    const longitude = point.longitude + (radius * Math.sin(angle)) / Math.cos((point.latitude * Math.PI) / 180);

    return {...point, latitude, longitude};
  });
}

export default spreadCoLocated;
