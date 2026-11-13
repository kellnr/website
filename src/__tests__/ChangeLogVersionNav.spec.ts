import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import ChangeLogVersionNav from "@/components/changelog/ChangeLogVersionNav.vue";
import { revealInContainer } from "@/utils/scroll";

vi.mock("@/utils/scroll", () => ({ revealInContainer: vi.fn() }));
import type { MajorGroup } from "@/utils/changelog";

const groups: MajorGroup[] = [
  { major: 7, releases: [{ version: "7.1.0", date: "2026-11-11", entries: [] }] },
  { major: 6, releases: [{ version: "6.1.0", date: "2026-03-01", entries: [] }] },
  { major: 5, releases: [{ version: "5.1.0", date: "2025-03-01", entries: [] }] },
];

function expandedMajors(wrapper: ReturnType<typeof mount>): string[] {
  return wrapper
    .findAll("button.nav-major")
    .filter((button) => button.attributes("aria-expanded") === "true")
    .map((button) => button.find(".major-label").text());
}

describe("ChangeLogVersionNav", () => {
  it("opens the newest major while nothing is read yet", () => {
    const wrapper = mount(ChangeLogVersionNav, { props: { groups, activeVersion: null } });
    expect(expandedMajors(wrapper)).toEqual(["Kellnr 7"]);
  });

  it("follows the release being read instead of collecting every group", async () => {
    const wrapper = mount(ChangeLogVersionNav, { props: { groups, activeVersion: "7.1.0" } });

    await wrapper.setProps({ activeVersion: "6.1.0" });
    expect(expandedMajors(wrapper)).toEqual(["Kellnr 6"]);

    await wrapper.setProps({ activeVersion: "5.1.0" });
    expect(expandedMajors(wrapper)).toEqual(["Kellnr 5"]);
  });

  it("keeps a group the reader collapsed closed", async () => {
    const wrapper = mount(ChangeLogVersionNav, { props: { groups, activeVersion: "6.1.0" } });

    await wrapper.findAll("button.nav-major")[1]!.trigger("click");
    expect(expandedMajors(wrapper)).toEqual([]);

    await wrapper.setProps({ activeVersion: "7.1.0" });
    await wrapper.setProps({ activeVersion: "6.1.0" });
    expect(expandedMajors(wrapper)).toEqual([]);
  });

  it("keeps a group the reader opened open", async () => {
    const wrapper = mount(ChangeLogVersionNav, { props: { groups, activeVersion: "7.1.0" } });

    await wrapper.findAll("button.nav-major")[2]!.trigger("click");
    await wrapper.setProps({ activeVersion: "6.1.0" });
    expect(expandedMajors(wrapper)).toEqual(["Kellnr 6", "Kellnr 5"]);
  });
});

describe("ChangeLogVersionNav scrolling", () => {
  afterEach(() => {
    vi.mocked(revealInContainer).mockClear();
    vi.restoreAllMocks();
  });

  // jsdom has no layout: links inside a list hidden by v-show have no boxes, the others one.
  function stubLayout() {
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function (
      this: HTMLElement
    ) {
      const hidden = this.closest('[style*="display: none"]') !== null;
      return (hidden ? [] : [new DOMRect()]) as unknown as DOMRectList;
    });
  }

  it("keeps the active link in view of the sidebar", async () => {
    stubLayout();
    const scrollContainer = document.createElement("nav");
    const wrapper = mount(ChangeLogVersionNav, {
      props: { groups, activeVersion: "7.1.0", scrollContainer },
    });

    await wrapper.setProps({ activeVersion: "6.1.0" });
    await flushPromises();

    expect(revealInContainer).toHaveBeenCalledWith(
      scrollContainer,
      wrapper.get("a.active").element,
      "y",
      16
    );
  });

  it("does not scroll the sidebar while the group being read is collapsed", async () => {
    stubLayout();
    const scrollContainer = document.createElement("nav");
    const wrapper = mount(ChangeLogVersionNav, {
      props: { groups, activeVersion: "6.1.0", scrollContainer },
    });
    await wrapper.findAll("button.nav-major")[1]!.trigger("click");

    await wrapper.setProps({ activeVersion: "7.1.0" });
    await flushPromises();
    vi.mocked(revealInContainer).mockClear();
    await wrapper.setProps({ activeVersion: "6.1.0" });
    await flushPromises();

    expect(revealInContainer).not.toHaveBeenCalled();
  });
});
