<template>
  <footer :class="$style.footer">
    <div :class="$style.topSection">
      <nav :class="$style.mobileNav">
        <NuxtLink :class="$style.mobileNavLink" to="#reserv">Виллы</NuxtLink>
        <NuxtLink :class="$style.mobileNavLink" to="#services">Услуги</NuxtLink>
        <NuxtLink :class="$style.mobileNavLink" to="#location"
          >Расположение</NuxtLink
        >
        <a
          :class="$style.mobileNavLink"
          href="#faq"
          @click.prevent="scrollToFaqRules"
        >
          Правила
        </a>
      </nav>
      <div :class="$style.columns">
        <nav :class="$style.column">
          <h3 :class="$style.columnTitle">Виллы</h3>
          <ul :class="$style.columnList">
            <li v-for="(apt, index) in footerVillas" :key="apt.id">
              <a
                :class="$style.columnLink"
                href="#reserv"
                @click.prevent="onVillaClick(index)"
              >
                {{ apt.title }}
              </a>
            </li>
          </ul>
        </nav>
        <nav :class="$style.column">
          <h3 :class="$style.columnTitle">Услуги</h3>
          <ul :class="$style.columnList">
            <li><NuxtLink to="#services">Питание</NuxtLink></li>
            <li><NuxtLink to="#services">Праздники</NuxtLink></li>
            <li><NuxtLink to="#services">Экскурсии</NuxtLink></li>
            <li><NuxtLink to="#services">Прокат</NuxtLink></li>
          </ul>
        </nav>
        <div :class="$style.columnLogo">
          <AppIcon name="logo" alt="Резиденция ВОЛГА" :class="$style.logo" />
          <NuxtLink :class="$style.mobileBookBtn" to="#reserv">
            Забронировать
          </NuxtLink>
          <div :class="$style.mobileContactRow">
            <a :class="$style.contactLink" href="tel:+79171274080"
              >8 (917) 127-40-80</a
            >
            <a :class="$style.contactLink" href="mailto:volga-dom163@mail.ru"
              >volga-dom163@mail.ru</a
            >
          </div>
          <div :class="$style.socialLinks">
            <a
              v-for="item in socialLinks"
              :key="item.link"
              :class="$style.socialLink"
              :href="item.link"
              :aria-label="item.label"
            >
              <AppIcon :name="item.icon" :alt="item.label" />
            </a>
          </div>
        </div>
        <div :class="$style.column">
          <h3 :class="$style.columnTitle">Контакты</h3>
          <ul :class="$style.columnList">
            <li>Тольятти, СНТ Волгарь, 18/3 р-н Центральный</li>
            <li>
              <a :class="$style.contactLink" href="tel:+79171274080"
                >8 (917) 127-40-80</a
              >
            </li>
            <li>
              <a :class="$style.contactLink" href="mailto:volga-dom163@mail.ru"
                >volga-dom163@mail.ru</a
              >
            </li>
          </ul>
        </div>
        <div :class="$style.column">
          <h3 :class="$style.columnTitle">Правила проживания</h3>
          <NuxtLink
            v-if="footerRules.apartmentName !== '—'"
            :class="$style.columnVillaLink"
            to="#reserv"
          >
            <span :class="$style.columnVillaLinkText"
              >Вилла: {{ footerRules.apartmentName }}</span
            >
            <AppIcon
              name="reservArrowUpRight"
              aria-hidden="true"
              :class="$style.columnVillaLinkArrow"
            />
          </NuxtLink>
          <ul :class="$style.columnList">
            <li>Заезд после: {{ footerRules.checkIn }}</li>
            <li>Выезд до: {{ footerRules.checkOut }}</li>
            <li>Количество гостей: {{ footerRules.capacity }}</li>
            <li>Можно с питомцем: {{ footerRules.pets }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="$style.bottomSection">
      <span :class="$style.bottomItem">ООО "Резиденция ВОЛГА"</span>
      <span :class="$style.bottomItem">© 2026 Все права защищены</span>
      <a
        :class="$style.bottomLink"
        href="#faq"
        @click.prevent="scrollToFaqRules"
      >
        Правила проживания
      </a>
      <NuxtLink :class="$style.bottomLink" to="#">
        Политика конфиденциальности
      </NuxtLink>
      <span :class="$style.bottomDev">
        Сайт разработан
        <a
          :class="$style.devLink"
          href="https://atlantsoftware.com"
          target="_blank"
          rel="noopener noreferrer"
          >Atlantsoftware.com</a
        >
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  data() {
    return {
      socialLinks: [
        { link: "https://vk.ru/volga_doma", icon: "vk", label: "VK" },
        {
          link: "https://t.me/MuzalevValeriy",
          icon: "telegram",
          label: "Telegram",
        },
        {
          link: "https://max.ru/u/f9LHodD0cOKD6fPxzP-rcB4tf3p1iuNXjbLoLC9jQVFcnMw68KD2fNHo8aQ",
          icon: "max",
          label: "Max",
        },
        { link: "tel:+79171274080", icon: "phone", label: "Телефон" },
      ],
    };
  },
  computed: {
    footerVillas() {
      return this.$store.state.apartments || [];
    },
    footerRules() {
      const apartments = this.$store.state.apartments || [];
      const index = this.$store.state.selectedApartmentIndex ?? 0;
      const apt = apartments[index] ?? apartments[0] ?? null;
      const details = this.$store.state.apartmentDetails || {};
      const rule = apt ? details[apt.id]?.check_in_rule : null;
      const checkIn = rule?.check_in_time_start ?? "—";
      const checkOut = rule?.check_out_time_end ?? "—";
      const capacity = apt?.capacity ?? "—";
      const pets = apt?.services?.includes("animals") ? "да" : "нет";
      const apartmentName = apt?.title ?? "—";
      return {
        checkIn,
        checkOut,
        capacity,
        pets,
        apartmentName,
      };
    },
  },
  methods: {
    onVillaClick(index) {
      this.$store.commit("setSelectedApartmentIndex", index);
      const el = document.getElementById("reserv");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    scrollToFaqRules() {
      this.$store.commit("setFaqOpenIndex", 2);
      const el = document.getElementById("faq");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  },
};
</script>

<style lang="scss" module>
@use "@app/assets/scss/mixins.scss" as *;

.footer {
  background: $text-primary;
  color: $text-white;
}

.topSection {
  padding: 2.5rem 5rem;
  margin: 0 auto;
  @include mobile {
    padding: 2.5rem 1rem;
  }
}

.mobileNav {
  display: none;
  @include mobile {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    margin-bottom: 2.5rem;
  }
}

.mobileNavLink {
  color: $text-white;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 400;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.85;
  }
}

.columns {
  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
  @include mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  &:nth-child(4),
  &:nth-child(5) {
    align-items: flex-end;
    text-align: right;
  }
  @include mobile {
    display: none;
  }
}

.columnTitle {
  font-size: 1rem;
  font-weight: 600;
  line-height: 120%;
  margin: 0;
  @include tablet {
    font-size: 0.875rem;
    font-weight: 400;
    text-transform: uppercase;
  }
}

.columnVillaLink {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

.columnVillaLinkText {
  text-decoration: underline;
}

.columnVillaLinkArrow {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transform: rotate(-45deg);
  opacity: 0.9;
}

.columnList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 120%;

  a {
    color: $text-white;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
}

.columnLink {
  color: $text-white;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.columnLogo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  padding: 0 2rem;
  @include mobile {
    gap: 2rem;
    padding: 0;
  }
}

.logo {
  width: 12rem;
  height: auto;
  @include mobile {
    width: 10rem;
  }
}

.mobileBookBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.16);
  color: $text-white;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  line-height: 120%;
  border-radius: 2rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  @include mobile {
    display: inline-block;
  }
}

.mobileContactRow {
  display: none;
  @include mobile {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem 1.5rem;
    flex-wrap: wrap;
    font-size: 0.875rem;

    .contactLink {
      color: $text-white;
      text-decoration: none;
    }
  }
}

.socialLinks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.socialLink {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.12);
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  :global(img) {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
  }
  @include mobile {
    width: 2.5rem;
    height: 2.5rem;
    :global(img) {
      width: 1.125rem;
      height: 1.125rem;
    }
  }
}

.contactLink {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.bottomSection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 5rem 2.5rem 5rem;
  margin: 0 auto;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
  max-width: 100%;
  @include mobile {
    flex-direction: column;
    padding: 1rem 1rem 1.5rem;
  }
}

.bottomDev {
  display: inline;
  text-align: right;
  @include mobile {
    font-size: 0.625rem;
    color: rgba(255, 255, 255, 0.6);
  }
}

.bottomItem {
  white-space: nowrap;
  @include mobile {
    font-size: 0.625rem;
  }
}

.bottomLink {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
  text-align: center;
  &:hover {
    opacity: 0.9;
  }
  @include mobile {
    font-size: 0.625rem;
    text-align: center;
  }
}

.devLink {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}
</style>
