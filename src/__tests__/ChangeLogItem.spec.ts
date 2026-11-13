import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ChangeLogItem from "@/components/changelog/ChangeLogItem.vue";

function mountItem() {
  return mount(ChangeLogItem, { props: { version: "7.2.0", date: "2026-01-01" } });
}

describe("ChangeLogItem", () => {
  it("renders the version heading as a link to itself", () => {
    const heading = mountItem().find("h2");
    expect(heading.attributes("id")).toBe("v7-2-0");
    expect(heading.find("a").attributes("href")).toBe("#v7-2-0");
    // The accessible name of the heading is its visible text, without a second link label.
    expect(heading.text()).toBe("Version 7.2.0");
    expect(heading.findAll("[aria-label], [aria-labelledby]")).toHaveLength(0);
  });

  it("emits navigate on a plain click", async () => {
    const wrapper = mountItem();
    await wrapper.find("h2 a").trigger("click");
    expect(wrapper.emitted("navigate")).toEqual([["7.2.0"]]);
  });

  it("leaves a modified click to the browser", async () => {
    const wrapper = mountItem();
    await wrapper.find("h2 a").trigger("click", { metaKey: true });
    expect(wrapper.emitted("navigate")).toBeUndefined();
  });
});
