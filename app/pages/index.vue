<template>
  <main>
    <MainBlock />
    <Reserv />
    <div :class="$style.wrapper">
      <Services />
      <About />
      <Faq />
      <Location />
    </div>
    <AppFooter />
    <ScrollToTop />
  </main>
</template>

<script>
import { defineAsyncComponent } from "vue";
import MainBlock from "@app/components/sections/MainBlock.vue";

const Reserv = defineAsyncComponent(
  () => import("@app/components/sections/Reserv.vue")
);
const Services = defineAsyncComponent(
  () => import("@app/components/sections/Services.vue")
);
const About = defineAsyncComponent(() => import("@app/components/sections/About.vue"));
const Faq = defineAsyncComponent(() => import("@app/components/sections/Faq.vue"));
const Location = defineAsyncComponent(
  () => import("@app/components/sections/Location.vue")
);
const AppFooter = defineAsyncComponent(
  () => import("@app/components/AppFooter.vue")
);
const ScrollToTop = defineAsyncComponent(
  () => import("@app/components/ScrollToTop.vue")
);

export default {
  name: "IndexPage",
  components: {
    MainBlock,
    Reserv,
    Services,
    About,
    Faq,
    Location,
    AppFooter,
    ScrollToTop,
  },
  mounted() {
    // Defer API work until idle: improves LCP/TBT (content above-the-fold is static)
    const run = () => this.$store.dispatch("getApartmentsByIds");
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 0);
    }
  },
};
</script>

<style lang="scss" module>
.wrapper {
  margin: 0 auto;
}
</style>
