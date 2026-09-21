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
          <h3 :class="$style.columnTitle">Дополнительные услуги</h3>
          <ul :class="$style.columnList">
            <li>
              <NuxtLink :class="$style.columnLink" to="#services"
                >Ресторанный сервис</NuxtLink
              >
            </li>
            <li>
              <NuxtLink :class="$style.columnLink" to="#services"
                >Шоу-программы</NuxtLink
              >
            </li>
            <li>
              <NuxtLink :class="$style.columnLink" to="#services"
                >Замок Гарибальди</NuxtLink
              >
            </li>
            <li>
              <NuxtLink :class="$style.columnLink" to="#services"
                >Активный отдых</NuxtLink
              >
            </li>
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
          <div :class="$style.socialBlock">
            <div :class="$style.socialLinks">
              <a
                v-for="item in socialLinks"
                :key="item.link"
                :class="$style.socialLink"
                :href="item.link"
                :aria-label="item.label"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
              >
                <AppIcon :name="item.icon" :alt="item.label" />
              </a>
            </div>
            <p :class="$style.socialDisclaimer">
              *Meta признана экстремистской организацией, ее деятельность
              запрещена на территории РФ. Instagram принадлежит компании Meta.
            </p>
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
          <ul :class="$style.columnList">
            <li>
              Заезд {{ footerRules.checkIn }} / Выезд
              {{ footerRules.checkOut }}
            </li>
            <li>Тишина после 22:00</li>
            <li>Возвратный депозит</li>
            <li>
              Питомцы
              {{
                footerRules.pets === "да" ? "по согласованию" : "не допускаются"
              }}
            </li>
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
        {
          link: "https://vk.ru/volga_doma",
          icon: "vk",
          label: "VK",
          external: true,
        },
        {
          link: "https://t.me/MuzalevValeriy",
          icon: "telegram",
          label: "Telegram",
          external: true,
        },
        {
          link: "https://www.instagram.com/",
          icon: "instagram",
          label: "Instagram",
          external: true,
        },
        {
          link: "https://max.ru/u/f9LHodD0cOKD6fPxzP-rcB4tf3p1iuNXjbLoLC9jQVFcnMw68KD2fNHo8aQ",
          icon: "max",
          label: "Max",
          external: true,
        },
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
      const checkIn = rule?.check_in_time_start ?? "15:00";
      const checkOut = rule?.check_out_time_end ?? "12:00";
      const pets = apt?.services?.includes("animals") ? "да" : "нет";
      return {
        checkIn,
        checkOut,
        pets,
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
      this.$store.commit("setFaqOpenIndex", 0);
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
  background: $bg-footer;
  color: $text-white;
}

.topSection {
  @include content-width;
  padding: 3.5rem 0 2.5rem;
  @include tablet {
    padding: 2.5rem 0 2rem;
  }
}

.mobileNav {
  display: none;
  @include tablet {
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
  grid-template-columns: 1fr 1.15fr auto 1fr 1.1fr;
  gap: 2rem 1.75rem;
  align-items: start;
  @include tablet {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
  @include tablet {
    display: none;
  }
}

.columnTitle {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  color: $text-white;
}

.columnList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.72);
}

.columnLink {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: $text-white;
  }
}

.columnLogo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  padding: 0 1.5rem;
  @include tablet {
    gap: 1.5rem;
    padding: 0;
  }
}

.logo {
  width: 11.5rem;
  height: auto;
  @include tablet {
    width: 10rem;
  }
}

.mobileBookBtn {
  display: none;
  @include tablet {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.16);
    color: $text-white;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    line-height: 1.2;
    border-radius: 2rem;
    transition: background 0.2s;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.mobileContactRow {
  display: none;
  @include tablet {
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

.socialBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 16rem;
}

.socialLinks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.75rem;
}

.socialLink {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.9;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  :global(img) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.socialDisclaimer {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 300;
  line-height: 1.35;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
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
  @include content-width;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 0 2rem;
  font-size: 0.75rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.55);
  @include tablet {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0 1.5rem;
    text-align: center;
  }
}

.bottomDev {
  display: inline;
  text-align: right;
  white-space: nowrap;
  @include tablet {
    font-size: 0.625rem;
    text-align: center;
    white-space: normal;
  }
}

.bottomItem {
  white-space: nowrap;
  @include tablet {
    font-size: 0.625rem;
  }
}

.bottomLink {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
  text-align: center;
  white-space: nowrap;
  &:hover {
    opacity: 0.9;
  }
  @include tablet {
    font-size: 0.625rem;
  }
}

.devLink {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.15em;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}
</style>
