import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { useHashNavigation } from "@/composables/useHashNavigation";

const shown = ref(true);

const Page = defineComponent({
  setup(_, { expose }) {
    expose({ navigateTo: useHashNavigation() });
    return () => h("div", shown.value ? [h("h2", { id: "target" }, "Target")] : []);
  },
});

async function mountAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: Page }],
  });
  await router.push(path);
  const wrapper = mount(
    { render: () => h(Page) },
    {
      global: { plugins: [router] },
      attachTo: document.body,
    }
  );
  const page = wrapper.findComponent(Page).vm as unknown as {
    navigateTo: (hash: string) => Promise<void>;
  };
  return { router, wrapper, navigateTo: page.navigateTo };
}

describe("useHashNavigation", () => {
  afterEach(() => {
    shown.value = true;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("keeps the query when it pushes the hash", async () => {
    const { router, navigateTo } = await mountAt("/?type=Fixed");
    await navigateTo("#target");
    expect(router.currentRoute.value.fullPath).toBe("/?type=Fixed#target");
  });

  it("scrolls to a target that renders only after the state change", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const { navigateTo } = await mountAt("/#target");
    shown.value = false;
    await Promise.resolve();
    shown.value = true;
    await navigateTo("#target");
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("fails when the current hash has no target", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const { navigateTo } = await mountAt("/#missing");
    await expect(navigateTo("#missing")).rejects.toThrow('No element with id "missing"');
  });
});
