# kinect-stretch

A three.js scene of video points with stretch pass.

<img alt="scene frame preview" src="./docs/frame.png" />

## Get started

```bash
pnpm install
pnpm dev
```

Open [localhost:4321](http://localhost:4321) in your browser.

## Testing

```bash
pnpm test:types
pnpm test:lint
pnpm test:e2e
```

End-to-end tests render the scene in a real browser with [Playwright](https://playwright.dev) and compare the frame against a reference screenshot (visual regression testing).

> 📖 **Learn more:** [Visual regression testing for three.js scenes](https://satelllte.pages.dev/articles/visual-regression-testing-for-threejs-scenes/) — a write-up of the e2e approach used in this and my other repos.
