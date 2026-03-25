<template>
  <header :class="{ [$style.menuOpen]: menuOpen }">
    <nav :class="$style.menu">
      <ul :class="$style.menuList">
        <li v-for="item in menu" :key="item.title" :class="$style.menuItem">
          <a
            :href="item.href"
            :class="$style.menuLink"
            :data-faq-index="item.faqIndex"
            @click="onMenuAnchorClick"
          >
            {{ item.titleShort != null ? item.titleShort : item.title }}
            <span v-if="item.titleLong" :class="$style.hideOnTablet">{{
              item.titleLong
            }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <a :class="$style.mobileCall" :href="phoneLink" aria-label="Позвонить">
      <AppIcon name="phone" alt="" />
    </a>

    <AppIcon name="logo" alt="Резиденция Волга" :class="$style.logo" />

    <button
      type="button"
      :class="$style.burgerButton"
      aria-label="Меню"
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
    >
      <span :class="$style.burgerLine" />
      <span :class="$style.burgerLine" />
      <span :class="$style.burgerLine" />
    </button>

    <div :class="$style.socialLinks">
      <a
        v-for="item in socialLinks"
        :key="item.link"
        :class="$style.socialLink"
        :href="item.link"
      >
        <AppIcon :name="item.icon" :alt="item.link" />
      </a>
      <button
        type="button"
        :class="$style.bookingButton"
        @click="openBookingModal"
      >
        Забронировать
      </button>
    </div>

    <Transition name="mobile-menu">
      <div
        v-show="menuOpen"
        :class="$style.mobileMenuOverlay"
        :aria-hidden="!menuOpen"
        @click="menuOpen = false"
      >
        <nav :class="$style.mobileMenu" data-menu-panel @click.stop>
          <button
            type="button"
            :class="$style.mobileMenuClose"
            aria-label="Закрыть меню"
            @click="menuOpen = false"
          >
            <span :class="$style.closeLine" />
            <span :class="$style.closeLine" />
          </button>
          <ul :class="$style.mobileMenuList">
            <li
              v-for="(item, i) in menu"
              :key="item.title"
              :class="$style.mobileMenuItem"
              :style="{ transitionDelay: `${i * 40}ms` }"
            >
              <a
                :href="item.href"
                :data-faq-index="item.faqIndex"
                @click="onMenuAnchorClick($event, true)"
              >
                {{ item.title }}
              </a>
            </li>
          </ul>
          <div :class="$style.mobileMenuSocial">
            <a
              v-for="item in socialLinks"
              :key="item.link"
              :class="$style.mobileSocialLink"
              :href="item.link"
              @click="menuOpen = false"
            >
              <AppIcon :name="item.icon" :alt="item.link" />
            </a>
          </div>
          <button
            type="button"
            :class="$style.mobileBookingButton"
            @click="
              openBookingModal();
              menuOpen = false;
            "
          >
            Забронировать
          </button>
        </nav>
      </div>
    </Transition>

    <BookingModal :open="bookingModalOpen" @close="closeBookingModal" />
    <BookingFormModal
      :open="bookingFormModalOpen"
      @close="closeBookingFormModal"
    />
  </header>
</template>

<script>
import { mapState } from "vuex";
import BookingModal from "@app/components/BookingModal.vue";
import BookingFormModal from "@app/components/BookingFormModal.vue";

export default {
  name: "AppHeader",
  components: { BookingModal, BookingFormModal },
  data() {
    return {
      menuOpen: false,
      phoneLink: "tel:+79171274080",
      menu: [
        { title: "Виллы", href: "#reserv" },
        { title: "Услуги", href: "#services" },
        { title: "Расположение", href: "#location" },
        {
          title: "Правила проживания",
          titleShort: "Правила",
          titleLong: " проживания",
          href: "#faq",
          faqIndex: 2,
        },
      ],
      socialLinks: [
        { link: "https://vk.com/volga_doma", icon: "vk" },
        { link: "https://telegram.me/volga", icon: "telegram" },
        { link: "https://max.com/volga", icon: "max" },
        { link: "tel:+79171274080", icon: "phone" },
      ],
    };
  },
  computed: {
    ...mapState({
      bookingModalOpen: (state) => state.bookingModalOpen,
      bookingFormModalOpen: (state) => state.bookingFormModalOpen,
    }),
  },
  watch: {
    menuOpen(open) {
      document.body.style.overflow = open ? "hidden" : "";
    },
  },
  methods: {
    onMenuAnchorClick(event, closeMenu = false) {
      const href = event.currentTarget?.getAttribute("href");
      if (href?.startsWith("#") && href.length > 1) {
        event.preventDefault();
        const id = href.slice(1);
        const faqIndex = event.currentTarget?.getAttribute("data-faq-index");
        if (id === "faq" && faqIndex != null) {
          this.$store.commit("setFaqOpenIndex", parseInt(faqIndex, 10));
        }
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (closeMenu) this.menuOpen = false;
      }
    },
    openBookingModal() {
      this.$store.commit("setBookingModalOpen", true);
    },
    closeBookingModal() {
      this.$store.commit("setBookingModalOpen", false);
    },
    closeBookingFormModal() {
      this.$store.commit("setBookingFormModalOpen", false);
    },
  },
};
</script>

<style lang="scss" module>
header {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  padding: 1.5rem;
  max-width: 110rem;
  margin: 0 auto;
  align-items: center;
}

.menu {
  display: flex;
  align-items: center;
}

.mobileCall {
  display: none;
}

.burgerButton {
  display: none;
}

.logo {
  width: 11.875rem;
  height: auto;
}

.menuList,
.socialLinks {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.socialLinks {
  justify-content: end;
}

.menuItem {
  font-weight: 600;
  padding: 0;
  border-radius: 6.25rem;
  background-color: $bg-transparent-16;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  @include tablet {
    padding: 0;
  }
  &:hover {
    background-color: $bg-transparent-40;
  }
}

.menuLink {
  display: block;
  padding: 0.875rem 1.25rem;
  color: inherit;
  text-decoration: none;
  border-radius: 6.25rem;
  transition: background 0.3s ease;
  @include tablet {
    padding: 0.875rem 1rem;
  }
  &:hover {
    cursor: pointer;
  }
}

.socialLink {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: $bg-transparent-16;
  backdrop-filter: blur(10px);
  transition: background-color 0.2s;
  -webkit-backdrop-filter: blur(10px);
  &:hover {
    transition: background-color 0.2s;
    background-color: $bg-transparent-40;
  }

  :global(img) {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
  }
}

.bookingButton {
  font-weight: 600;
  padding: 0.875rem 1.25rem;
  border-radius: 6.25rem;
  background-color: $bg-transparent-16;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: none;
  color: $text-white;
  margin: 0 0 0 0.5rem;
  font-size: 1rem;
  &:hover {
    cursor: pointer;
    background-color: $bg-transparent-40;
  }
}

.hideOnTablet {
  @include tablet {
    display: none;
  }
}

@include mobile {
  header {
    grid-template-columns: auto 1fr auto;
    padding: 1rem 1rem 1.25rem;
    gap: 0.5rem;
  }

  .menu,
  .socialLinks {
    display: none;
  }

  .mobileCall {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: $bg-transparent-16;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: background-color 0.2s;
    color: $text-white;

    &:hover {
      background-color: $bg-transparent-40;
    }

    :global(img) {
      width: 1.25rem;
      height: 1.25rem;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }
  }

  .burgerButton {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: none;
    background-color: $bg-transparent-16;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $bg-transparent-40;
    }
  }

  .burgerLine {
    display: block;
    width: 1.25rem;
    height: 2px;
    background: $text-white;
    border-radius: 1px;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  .menuOpen .burgerLine:nth-child(1) {
    transform: translateY(0.42rem) rotate(45deg);
  }
  .menuOpen .burgerLine:nth-child(2) {
    opacity: 0;
  }
  .menuOpen .burgerLine:nth-child(3) {
    transform: translateY(-0.42rem) rotate(-45deg);
  }

  .logo {
    width: 8rem;
    justify-self: center;
  }
}

.mobileMenuOverlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 100;
  background: $bg-overlay;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

@include mobile {
  .mobileMenuOverlay {
    display: block;
  }

  .mobileMenu {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: stretch;
    background: $bg-footer;
    padding: 5rem 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
  }

  .mobileMenuClose {
    position: absolute;
    top: 1.5rem;
    right: 1rem;
    width: 2.875rem;
    height: 2.875rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: $bg-transparent-16;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    z-index: 1;

    &:hover {
      background: $bg-transparent-40;
    }
  }

  .closeLine {
    position: absolute;
    width: 1.125rem;
    height: 2px;
    background: $text-white;
    border-radius: 1px;

    &:nth-child(1) {
      transform: rotate(45deg);
    }
    &:nth-child(2) {
      transform: rotate(-45deg);
    }
  }

  .mobileMenuList {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .mobileMenuItem a {
    display: block;
    padding: 0.875rem 1rem;
    color: $text-white;
    font-weight: 600;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .mobileMenuSocial {
    margin-top: auto;
    padding-top: 1.5rem;
    display: flex;
    justify-content: space-evenly;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .mobileSocialLink {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background-color: $bg-transparent-16;
    color: $text-white;
    transition: background-color 0.2s;

    &:hover {
      background-color: $bg-transparent-40;
    }

    :global(img) {
      width: 1.125rem;
      height: 1.125rem;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }
  }

  .mobileBookingButton {
    margin-top: 1rem;
    width: 100%;
    padding: 0.875rem 1.25rem;
    border-radius: 6.25rem;
    border: none;
    background-color: $bg-transparent-16;
    color: $text-white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $bg-transparent-40;
    }
  }
}
</style>

<style lang="scss" scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease;
}
.mobile-menu-enter-active :deep([data-menu-panel]),
.mobile-menu-leave-active :deep([data-menu-panel]) {
  transition: transform 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
.mobile-menu-enter-from :deep([data-menu-panel]) {
  transform: translateX(100%);
}
.mobile-menu-enter-to :deep([data-menu-panel]),
.mobile-menu-leave-from :deep([data-menu-panel]) {
  transform: translateX(0);
}
.mobile-menu-leave-to :deep([data-menu-panel]) {
  transform: translateX(100%);
}
</style>
