import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vnr202_matma_thoigian_v1';
const NOW = '2026-01-01T00:00:00.000Z';

const chapterProgress = (chapterId: number) => ({
  chapterId,
  status: 'completed',
  taskResults:
    chapterId === 1
      ? [
          { taskId: 'c1-t1', completed: true, score: 100, hintsUsed: 0, answeredCorrectly: true },
          { taskId: 'c1-t2', completed: true, score: 100, hintsUsed: 0, answeredCorrectly: true },
          { taskId: 'c1-t3', completed: true, score: 76, hintsUsed: 1, answeredCorrectly: true },
        ]
      : [],
  totalScore: 276,
  bestScore: 276,
  hintsUsed: 0,
  completedAt: NOW,
});

const SEEDED_PROGRESS = {
  profile: {
    nickname: 'Nguyễn Minh Anh',
    avatarId: 'explorer-1',
    gameMode: 'exploration',
    createdAt: NOW,
  },
  chapters: Object.fromEntries([1, 2, 3, 4, 5].map(id => [id, chapterProgress(id)])),
  collectedFragments: [1, 2, 3, 4, 5].map(id => `fragment-${id}`),
  totalScore: 1380,
  hintsUsedTotal: 2,
  isCompletedAll: true,
  certificateIssuedAt: NOW,
  certificateCode: 'VNR202-FPT-ABCDE',
  lastPlayedAt: NOW,
  reflection: 'Tinh thần độc lập tự cường và trách nhiệm của thế hệ trẻ.',
};

const ROUTES = [
  { path: '/', name: 'Trang chủ' },
  { path: '/how-to-play', name: 'Hướng dẫn' },
  { path: '/setup', name: 'Hồ sơ người chơi' },
  { path: '/story', name: 'Cốt truyện' },
  { path: '/timeline', name: 'Bản đồ thời gian' },
  { path: '/chapter/1', name: 'Giới thiệu chương' },
  { path: '/play/1', name: 'Phòng chơi' },
  { path: '/result/1', name: 'Kết quả chương' },
  { path: '/collection', name: 'Bộ sưu tập' },
  { path: '/archive', name: 'Thư viện lịch sử' },
  { path: '/ending', name: 'Kết thúc' },
  { path: '/certificate', name: 'Chứng nhận' },
];

async function openRoute(page: import('@playwright/test').Page, route: string) {
  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, value);
      sessionStorage.clear();
    },
    { key: STORAGE_KEY, value: JSON.stringify(SEEDED_PROGRESS) },
  );

  await page.goto(route, { waitUntil: 'domcontentloaded' });

  // Chờ lazy chunk của route thay thế fallback Suspense.
  await page.waitForFunction(
    () => {
      const main = document.querySelector('main');
      const text = (main?.textContent ?? '').trim();
      return text.length > 120 && !text.includes('ĐANG MỞ HỒ SƠ LƯU TRỮ');
    },
    { timeout: 15_000 },
  );

  // Tắt animation/transition còn lại để đo bố cục cuối.
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0s !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0s !important;
      scroll-behavior: auto !important;
    }`,
  });

  await page.evaluate(() =>
    Promise.race([
      document.fonts.ready.then(() => true),
      new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1_500)),
    ]),
  );

  await page.waitForTimeout(route === '/certificate' ? 2_000 : 650);
}

for (const { path, name } of ROUTES) {
  test(`${name} — ${path}`, async ({ page }) => {
    await openRoute(page, path);

    expect(new URL(page.url()).pathname, `Route ${path} bị chuyển hướng`).toBe(path);

    const report = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;

      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : '';
        const classes = Array.from(el.classList)
          .slice(0, 3)
          .map(cls => `.${cls}`)
          .join('');
        const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 48);
        return `${el.tagName.toLowerCase()}${id}${classes}${text ? ` — “${text}”` : ''}`;
      };

      const isRendered = (el: Element) => {
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0.5 && rect.height > 0.5;
      };

      const isIgnored = (el: Element) => {
        if (el.closest('.sr-only, [data-layout-ignore]')) return true;
        const style = getComputedStyle(el);
        return style.position === 'fixed' || style.position === 'absolute';
      };

      const isInsideScroller = (el: Element) => {
        for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          const overflowX = getComputedStyle(parent).overflowX;
          if (overflowX === 'auto' || overflowX === 'scroll') return true;
        }
        return false;
      };

      const overflow: string[] = [];
      const clipped: string[] = [];
      const smallTargets: string[] = [];

      document.querySelectorAll('body *').forEach(el => {
        if (el.namespaceURI === 'http://www.w3.org/2000/svg') return;
        if (!isRendered(el) || isIgnored(el) || isInsideScroller(el)) return;

        const rect = el.getBoundingClientRect();
        if (rect.right > viewportWidth + 0.5) {
          overflow.push(`${describe(el)} — mép phải ${Math.round(rect.right)}px > ${viewportWidth}px`);
        }

        const overflowX = getComputedStyle(el).overflowX;
        const hasText = (el.textContent ?? '').trim().length > 0;
        if (/(hidden|clip)/.test(overflowX) && hasText && el.scrollWidth > el.clientWidth + 2) {
          clipped.push(`${describe(el)} — thiếu ${el.scrollWidth - el.clientWidth}px`);
        }
      });

      document
        .querySelectorAll('button, a[href], summary, [role="button"], input:not([type="hidden"]), select, textarea')
        .forEach(el => {
          if (!isRendered(el) || isIgnored(el) || el.closest('.sr-only')) return;
          const rect = el.getBoundingClientRect();
          if (rect.width < 39.5 || rect.height < 39.5) {
            smallTargets.push(`${describe(el)} — ${Math.round(rect.width)}×${Math.round(rect.height)}px`);
          }
        });

      const unique = (items: string[]) => Array.from(new Set(items)).slice(0, 8);

      return {
        viewportWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflow: unique(overflow),
        clipped: unique(clipped),
        smallTargets: unique(smallTargets),
      };
    });

    const label = `[${test.info().project.name}] ${path}`;

    expect(report.documentWidth, `${label}: trang rộng hơn khung`).toBeLessThanOrEqual(
      report.viewportWidth + 1,
    );
    expect(report.overflow, `${label}: phần tử tràn ngang`).toEqual([]);
    expect(report.clipped, `${label}: chữ bị cắt`).toEqual([]);
    expect(report.smallTargets, `${label}: vùng chạm nhỏ hơn 40px`).toEqual([]);
  });
}
