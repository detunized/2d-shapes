const S = '#2D2D2D';
const W = 3.5;

function svg(inner) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function pgon(points, fill) {
  return svg(`<polygon points="${points}" fill="${fill}" stroke="${S}" stroke-width="${W}" stroke-linejoin="round"/>`);
}

function rpoly(n, fill, cx = 100, cy = 100, r = 80) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return pgon(pts, fill);
}

function tick(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const px = -dy / len * 9, py = dx / len * 9;
  return `<line x1="${(mx - px).toFixed(1)}" y1="${(my - py).toFixed(1)}" x2="${(mx + px).toFixed(1)}" y2="${(my + py).toFixed(1)}" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>`;
}

function starPts(cx, cy, outer, inner) {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / 5 - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

export const shapes = [
  { name: 'circle', category: 'basic',
    svg: svg(`<circle cx="100" cy="100" r="80" fill="#E31E24" stroke="${S}" stroke-width="${W}"/>`) },
  { name: 'square', category: 'basic',
    svg: pgon('20,20 180,20 180,180 20,180', '#00AEEF') },
  { name: 'triangle', category: 'basic',
    svg: pgon('100,15 190,185 10,185', '#8DC63F') },
  { name: 'rectangle', category: 'basic',
    svg: pgon('15,40 185,40 185,168 15,168', '#FFC20E') },
  { name: 'oval', category: 'basic',
    svg: svg(`<ellipse cx="100" cy="100" rx="60" ry="82" fill="#8B5CF6" stroke="${S}" stroke-width="${W}"/>`) },
  { name: 'heart', category: 'basic',
    svg: svg(`<path d="M100,178 C58,140 12,108 12,65 C12,32 38,12 65,12 C82,12 94,25 100,42 C106,25 118,12 135,12 C162,12 188,32 188,65 C188,108 142,140 100,178Z" fill="#FFC20E" stroke="${S}" stroke-width="${W}" stroke-linejoin="round"/>`) },
  { name: 'semicircle', category: 'basic',
    svg: svg(`<path d="M12,125 A88,88 0 0,1 188,125 Z" fill="#39B54A" stroke="${S}" stroke-width="${W}" stroke-linejoin="round"/>`) },
  { name: 'rhombus', category: 'basic',
    svg: pgon('100,12 190,100 100,188 10,100', '#FFC20E') },
  { name: 'star', category: 'basic',
    svg: svg(`<polygon points="${starPts(100, 105, 85, 35)}" fill="#F7941D" stroke="${S}" stroke-width="${W}" stroke-linejoin="round"/>`) },
  { name: 'crescent', category: 'basic',
    svg: svg(`<path d="M130,15 A85,85 0 1,0 130,185 A62,62 0 0,1 130,15Z" fill="#F9A7C4" stroke="${S}" stroke-width="${W}"/>`) },

  { name: 'pentagon', category: 'polygons', svg: rpoly(5, '#0072BC') },
  { name: 'hexagon', category: 'polygons', svg: rpoly(6, '#F7941D') },
  { name: 'heptagon', category: 'polygons', svg: rpoly(7, '#EC008C') },
  { name: 'octagon', category: 'polygons', svg: rpoly(8, '#F7941D') },
  { name: 'nonagon', category: 'polygons', svg: rpoly(9, '#E31E24') },
  { name: 'decagon', category: 'polygons', svg: rpoly(10, '#A8B5A0') },

  { name: 'scalene triangle', category: 'triangles',
    svg: pgon('20,185 185,185 150,15', '#D4145A') },
  { name: 'equilateral triangle', category: 'triangles',
    svg: svg(`<polygon points="100,15 190,185 10,185" fill="#006838" stroke="${S}" stroke-width="${W}" stroke-linejoin="round"/>${tick(100,15,190,185)}${tick(190,185,10,185)}${tick(10,185,100,15)}`) },
  { name: 'right-angled triangle', category: 'triangles',
    svg: pgon('20,185 20,15 185,185', '#662D91') },
  { name: 'isosceles triangle', category: 'triangles',
    svg: svg(`<polygon points="100,15 178,185 22,185" fill="#F7941D" stroke="${S}" stroke-width="${W}" stroke-linejoin="round"/>${tick(100,15,178,185)}${tick(22,185,100,15)}`) },

  { name: 'kite', category: 'more',
    svg: pgon('100,10 175,90 100,190 25,90', '#C6449B') },
  { name: 'parallelogram', category: 'more',
    svg: pgon('45,162 90,40 178,40 133,162', '#E8501E') },
  { name: 'trapezium', category: 'more',
    svg: pgon('20,170 62,40 148,40 190,170', '#00AEEF') },
  { name: 'irregular quadrilateral', category: 'more',
    svg: pgon('25,178 52,30 178,52 168,178', '#F7941D') },
  { name: 'irregular pentagon', category: 'more',
    svg: pgon('35,55 130,10 190,78 155,185 15,168', '#A80050') },
  { name: 'irregular hexagon', category: 'more',
    svg: pgon('60,15 162,30 192,100 158,178 35,175 10,95', '#003366') },
  { name: 'irregular heptagon', category: 'more',
    svg: pgon('50,15 148,10 188,60 182,138 128,188 35,172 8,85', '#00A99D') },
  { name: 'irregular octagon', category: 'more',
    svg: pgon('60,10 148,15 188,50 192,128 162,178 70,188 15,148 10,65', '#E31E24') },
];
