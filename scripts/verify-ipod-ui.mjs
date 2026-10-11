/**
 * [INPUT]: 独立iPod页面与已有Playwright；YouTube SDK使用受控播放时钟。
 * [OUTPUT]: 歌曲列表滚动保持、转轮定位、菜单切换及鼠标/键盘焦点回归结果。
 * [POS]: iPod界面验证入口；参数为服务URL，PLAYWRIGHT_MODULE可指定已有模块路径，不验证真实视频播放。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.argv[2] || "http://localhost:3000";
const viewport = { width: 1200, height: 1000 };
const sdk = `(() => {
window.__ipodClock = { current: null };
class Player {
 constructor(el,options) { this.options=options; this.time=0; this.playing=false; this.frame=document.createElement('iframe'); this.frame.src='about:blank'; el.append(this.frame); window.__ipodClock.current=this; setTimeout(()=>options.events.onReady({target:this}),30); }
 playVideo() { this.playing=true; this.since=Date.now(); this.options.events.onStateChange({data:1}); }
 pauseVideo() { this.time=this.getCurrentTime(); this.playing=false; this.options.events.onStateChange({data:2}); }
 getCurrentTime() { return this.time+(this.playing?(Date.now()-this.since)/1000:0); }
 getDuration() { return 180; } getVideoLoadedFraction() { return 1; } getIframe() { return this.frame; }
 getPlaylist() { return null; } setVolume() {} setLoop() {} setPlaybackRate() {} mute() {} unMute() {}
 seekTo(time) { this.time=time; this.since=Date.now(); } stopVideo() { this.playing=false; } destroy() { this.frame.remove(); }
}
window.YT={loaded:true,Player,PlayerState:{UNSTARTED:-1,PLAYING:1,PAUSED:2,BUFFERING:3,ENDED:0,CUED:5}};
window.onYouTubeIframeAPIReady?.();
})()`;
const browser = await chromium.launch({ headless: true });
let checks = 0;
try {
  for (const variant of ["modern", "classic"]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    try {
      await context.addInitScript((uiVariant) => {
        localStorage.setItem(
          "z1:ipod:preferences",
          JSON.stringify({ uiVariant }),
        );
      }, variant);
      await context.route("https://www.youtube.com/iframe_api", (route) =>
        route.fulfill({ contentType: "text/javascript", body: sdk }),
      );
      await context.route("**/api/ipod/lyrics?**", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            lines: [{ startTimeMs: "0", words: "Controlled lyric fixture" }],
          }),
        }),
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base);
      const ipod = page.locator(".z1-ipod");
      await ipod.getByRole("button", { name: "Music", exact: true }).click();
      await ipod
        .getByRole("button", { name: "All Songs", exact: true })
        .click();
      await page.waitForTimeout(350);
      const list = ipod.locator(".ipod-menu-container").last();
      await ipod
        .getByRole("button", { name: "Play or pause", exact: true })
        .click();
      await page.waitForFunction(() => window.__ipodClock?.current?.playing);
      const rect = await list.boundingBox();
      await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
      await page.mouse.wheel(0, 360);
      await page.waitForTimeout(180);
      const position = await list.evaluate((el) => el.scrollTop);
      assert.ok(position > 100, `manual scroll did not advance: ${position}`);
      checks++;
      for (let tick = 0; tick < 8; tick++) {
        await page.waitForTimeout(250);
        assert.ok(
          Math.abs((await list.evaluate((el) => el.scrollTop)) - position) < 1,
          "playback rerender reset scroll position",
        );
        checks++;
      }
      await ipod
        .getByRole("button", { name: "Play or pause", exact: true })
        .click();
      await page.waitForTimeout(300);
      assert.ok(
        Math.abs((await list.evaluate((el) => el.scrollTop)) - position) < 1,
        "pause reset scroll position",
      );
      checks++;
      await ipod.press("ArrowDown");
      assert.ok(
        (await list.evaluate((el) => el.scrollTop)) < position,
        "wheel selection did not bring selected row into view",
      );
      checks++;
      const menu = ipod.getByRole("button", { name: "Menu", exact: true });
      await menu.click();
      await ipod
        .getByRole("button", { name: "Recently Added", exact: true })
        .click();
      await page.waitForTimeout(350);
      assert.equal(
        await ipod
          .locator(".ipod-menu-container")
          .last()
          .evaluate((el) => el.scrollTop),
        0,
      );
      checks++;
      await menu.click();
      assert.equal(
        await menu.evaluate((el) => getComputedStyle(el).outlineStyle),
        "none",
      );
      assert.equal(
        await ipod
          .getByRole("group", { name: "iPod click wheel" })
          .getAttribute("data-input"),
        "pointer",
      );
      checks += 2;
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => ({
        label: document.activeElement?.getAttribute("aria-label"),
        outline: getComputedStyle(document.activeElement).outlineStyle,
      }));
      assert.equal(focus.label, "Previous track");
      assert.equal(focus.outline, "solid");
      checks += 2;
      await menu.click();
      assert.equal(
        await menu.evaluate((el) => getComputedStyle(el).outlineStyle),
        "none",
      );
      assert.deepEqual(errors, []);
      checks += 2;
      console.log(
        `${variant}: scroll kept at ${position}; pointer outline off; keyboard outline on`,
      );
    } finally {
      await context.close();
    }
  }
  console.log(
    `iPod UI: ${checks} checks passed (controlled playback, no live-video assertion)`,
  );
} finally {
  await browser.close();
}
