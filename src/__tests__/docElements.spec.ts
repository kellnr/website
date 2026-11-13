import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { Comment, Text, h } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import MainHeader from "@/components/elements/MainHeader.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import MinorHeader from "@/components/elements/MinorHeader.vue";
import TocList, { type TocItem } from "@/components/elements/TocList.vue";
import CodeBlock, { hasHiddenOverflow, isScrollable } from "@/components/elements/CodeBlock.vue";
import { indexSections } from "@/utils/docSearch";

describe("section headings", () => {
  it.each([
    [MainHeader, "h2"],
    [SubHeader, "h3"],
    [MinorHeader, "h4"],
  ])("renders %# as %s whose text links to itself", (component, tag) => {
    const wrapper = mount(component, {
      props: { id: "setup", icon: "docker" },
      slots: { default: "Set up Kellnr" },
    });

    const heading = wrapper.find(tag);
    expect(heading.attributes("id")).toBe("setup");
    const link = heading.find("a.heading-link");
    expect(link.attributes("href")).toBe("#setup");
    expect(link.text()).toBe("Set up Kellnr");
    // The accessible name of the heading is its visible text, without a second link label.
    expect(heading.text()).toBe("Set up Kellnr");
    expect(heading.findAll("[aria-label], [aria-labelledby]")).toHaveLength(0);
  });
});

const items: TocItem[] = [
  {
    label: "Installation",
    hash: "#installation",
    children: [{ label: "Docker", hash: "#docker" }],
  },
  { label: "Configuration", hash: "#configuration" },
];

function mountToc(activeHash: string | null) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: { template: "<div />" } }],
  });
  return mount(TocList, { props: { items, activeHash }, global: { plugins: [router] } });
}

describe("TocList", () => {
  it("renders plain links to the hashes", () => {
    const hrefs = mountToc(null)
      .findAll("a")
      .map((a) => a.attributes("href"));
    expect(hrefs).toEqual(["#installation", "#docker", "#configuration"]);
  });

  it("marks only the active entry", () => {
    const wrapper = mountToc("#docker");
    const current = wrapper.findAll("a[aria-current]");
    expect(current).toHaveLength(1);
    expect(current[0]!.text()).toBe("Docker");
    expect(current[0]!.attributes("aria-current")).toBe("location");
    expect(wrapper.findAll("a.active")).toHaveLength(1);
  });

  it("marks nothing without active entry", () => {
    expect(mountToc(null).findAll("a[aria-current]")).toHaveLength(0);
  });

  it("emits navigate on click", async () => {
    const wrapper = mountToc(null);
    await wrapper.find("a").trigger("click");
    expect(wrapper.emitted("navigate")).toHaveLength(1);
  });

  it("leaves a modified click to the browser", async () => {
    const wrapper = mountToc(null);
    await wrapper.find("a").trigger("click", { ctrlKey: true });
    expect(wrapper.emitted("navigate")).toBeUndefined();
  });
});

describe("CodeBlock", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the slot text without common indent, including nested and interpolated text", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      }
    );
    const wrapper = mount(CodeBlock, {
      props: { lang: "bash" },
      // Render functions, as test-utils compiles string slots without `whitespace: "preserve"`.
      slots: {
        default: () => [
          h(Text, "\n          # comment <x>\n          docker run "),
          h(Text, "image:7"),
          h(Comment, "not code"),
          h(Text, "\n            "),
          h("span", "--flag"),
          h(Text, "\n        "),
        ],
      },
    });
    expect(wrapper.find("code").element.textContent).toBe(
      "# comment <x>\ndocker run image:7\n  --flag"
    );
  });

  it("keeps the header with language and copy button out of the docs search", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      }
    );
    const wrapper = mount(
      {
        components: { SubHeader, CodeBlock },
        template: `<div><SubHeader id="run">Run</SubHeader><CodeBlock lang="bash">kellnr start</CodeBlock></div>`,
      },
      { attachTo: document.body }
    );
    expect(indexSections(wrapper.element as HTMLElement)).toEqual([
      { id: "run", level: 3, heading: "Run", text: "kellnr start" },
    ]);
    wrapper.unmount();
  });
});

describe("hasHiddenOverflow", () => {
  it("is false when the content fits", () => {
    expect(hasHiddenOverflow({ scrollLeft: 0, clientWidth: 500, scrollWidth: 500 })).toBe(false);
  });

  it("is true while content is hidden on the right", () => {
    expect(hasHiddenOverflow({ scrollLeft: 100, clientWidth: 500, scrollWidth: 800 })).toBe(true);
  });

  it("is false when scrolled to the end, allowing subpixel rounding", () => {
    expect(hasHiddenOverflow({ scrollLeft: 299.5, clientWidth: 500, scrollWidth: 800 })).toBe(
      false
    );
  });
});

describe("isScrollable", () => {
  it("is false when the content fits, allowing subpixel rounding", () => {
    expect(isScrollable({ scrollLeft: 0, clientWidth: 500, scrollWidth: 500.5 })).toBe(false);
  });

  it("is true when the content is wider than the area", () => {
    expect(isScrollable({ scrollLeft: 0, clientWidth: 500, scrollWidth: 800 })).toBe(true);
  });
});
