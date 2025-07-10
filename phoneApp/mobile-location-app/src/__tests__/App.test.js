jest.config.js
{
  "testEnvironment": "node",
  "collectCoverage": true,
  "coverageDirectory": "coverage"
}

src/__tests__/App.test.js
test('hello world!', () => {
  expect(1 + 1).toBe(2);
});