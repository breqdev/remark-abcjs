import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMusic from ".";

describe("remark music", () => {
  it("does not affect normal markdown", async () => {
    const markdown = `
# Heading

Paragraph.
`;

    const parsed = await unified().use(remarkParse).parse(markdown);

    const result = await unified().use(remarkMusic).run(parsed);

    expect(result).toStrictEqual(parsed);
  });

  it("does not affect code blocks", async () => {
    const markdown = `
# Python code

\`\`\`python
print("Hello, world!")
\`\`\`

Code in a different language

\`\`\`
(print "Hello, world!")
\`\`\`
`;

    const parsed = await unified().use(remarkParse).parse(markdown);

    const result = await unified().use(remarkMusic).run(parsed);

    expect(result).toStrictEqual(parsed);
  });

  it("replaces `abc` code blocks with `abc` nodes", async () => {
    const markdown = `
# ABC code

\`\`\`abc
X:1
T:My Song
M:4/4
L:1/8
K:C
\`\`\`

Code in a different language

\`\`\`
(print "Hello, world!")
\`\`\`
`;

    const parsed = await unified().use(remarkParse).parse(markdown);

    const result = await unified().use(remarkMusic).run(parsed);

    expect(result).not.toStrictEqual(parsed);

    expect(result.children.map((node) => node.type)).toContainEqual("abc");

    const abcNode = result.children.find((node) => node.type === "abc");
    expect(abcNode.value).toBe("X:1\nT:My Song\nM:4/4\nL:1/8\nK:C");
    expect(abcNode.data).toHaveProperty("hName", "div");
  });
});
