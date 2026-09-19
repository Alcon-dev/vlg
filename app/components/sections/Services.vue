<template>
  <section id="services" :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.titleRow">
        <h2 :class="$style.titlePrimary">УСЛУГИ РЕЗИДЕНЦИИ</h2>
        <div :class="$style.icons" aria-hidden="true">
          <img
            v-for="icon in icons"
            :key="icon"
            :src="icon"
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <h2 :class="$style.titleSecondary">И ПЕРСОНАЛЬНЫЙ СЕРВИС</h2>
    </div>

    <div :class="$style.services">
      <article
        v-for="(item, index) in services"
        :key="item.title"
        :class="[
          $style.servicesItem,
          { [$style.servicesItemReversed]: index >= 2 },
        ]"
      >
        <div :class="$style.servicesItemContent">
          <h3 :class="$style.servicesItemTitle">{{ item.title }}</h3>
          <p :class="$style.servicesItemDescription">
            {{ item.description }}
          </p>
        </div>

        <img
          :src="item.image"
          :alt="item.title"
          :class="$style.banner"
          width="420"
          height="280"
          loading="lazy"
          decoding="async"
        />
      </article>
    </div>
  </section>
</template>

<script>
import restaurantService from "@app/assets/img/sections/services/restaurant_service.jpg";
import showPrograms from "@app/assets/img/sections/services/show_programs.jpg";
import garibaldiCastle from "@app/assets/img/sections/services/garibaldi-castle.jpg";
import activeSport from "@app/assets/img/sections/services/active-sport.jpg";
import orderIcon from "@app/assets/img/sections/services/order.svg?url";
import partyIcon from "@app/assets/img/sections/services/party.svg?url";
import mapIcon from "@app/assets/img/sections/services/map.svg?url";
import compassIcon from "@app/assets/img/sections/services/compass.svg?url";

export default {
  name: "Services",
  data() {
    return {
      icons: [orderIcon, partyIcon, mapIcon, compassIcon],
      services: [
        {
          title: "Ресторанный сервис",
          description:
            "Для гостей Резиденции доступен формат выездного ресторанного обслуживания. Вы можете заказать доставку готовых дизайнерских гастробоксов для семейного ужина или организовать полноценный банкет с поварами, официантами и барбекю-станцией на открытом воздухе прямо на веранде вашей виллы",
          image: restaurantService,
        },
        {
          title: "Шоу-программы",
          description:
            "Для гостей Резиденции доступен драйвовый формат интерактивных игр с харизматичным ведущим, профессиональным диджеем и авторским реквизитом. Детские шоу — современная альтернатива классическим аниматорам. Интерактивный формат настоящей телепередачи в стиле YouTube блогеров и шоу с профессиональным ведущим.",
          image: showPrograms,
        },
        {
          title: "Замок Гарибальди",
          description:
            "Примерно в 40 минутах езды от Резиденции расположен знаменитый туристический объект Самарской области — замок в неоготическом стиле. На его территории открыт масштабный исторический парк с фонтанами, бронзовыми скульптурами и смотровыми площадками на берегу Жигулёвского моря",
          image: garibaldiCastle,
        },
        {
          title: "Активный отдых",
          description:
            "Мы с радостью организуем для Вас романтическую прогулку на яхте, отдых на плавдоме на Жигулевском море, живописный водный маршрут на сап-борде, поездки на мощных квадроциклах по хвойному лесу, прогулку на лошадях по лесным тропам, прокат лыж и сноубордов",
          image: activeSport,
        },
      ],
    };
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 7.5rem 0;
  gap: 5rem;
  color: $text-primary;
  @include tablet {
    padding: 2.5rem 0;
    gap: 1.5rem;
  }
  .header {
    display: flex;
    flex-direction: column;
    .titleRow {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: 1.5rem;
      @include tablet {
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
      }
      .titlePrimary {
        margin: 0;
        font-weight: 400;
        font-size: 6.25rem;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        color: $text-primary;
        @include tablet {
          font-size: 1.5rem;
        }
      }
      .icons {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-shrink: 0;

        img {
          width: 2.5rem;
          height: 2.5rem;
        }
        @include tablet {
          display: none;
        }
      }
    }
    .titleSecondary {
      margin: 0;
      font-weight: 400;
      font-size: 6.25rem;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      color: $text-accent;
      align-self: flex-end;
      padding-left: 0;
      @include tablet {
        font-size: 1.5rem;
      }
    }
  }
  .services {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    @include tablet {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .servicesItem {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: stretch;
      gap: 0.75rem;
      border: 1px solid $border-main;
      border-radius: 1.5rem;
      padding: 0.5rem;
      overflow: hidden;
      @include tablet {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
        align-items: center;
        border-radius: 1rem;
      }
      &.servicesItemReversed {
        .servicesItemContent {
          order: 2;
        }
        .banner {
          order: 1;
        }
      }
      .servicesItemContent {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
        min-width: 0;
        border: 1px solid $border-secondary;
        border-radius: 1.5rem;
        .servicesItemTitle {
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: -0.04em;
          color: $text-primary;
        }
        .servicesItemDescription {
          margin: 0;
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.4;
          color: $text-primary;
        }
      }
      .banner {
        width: 100%;
        height: 100%;
        max-height: 25rem;
        object-fit: cover;
        border-radius: 1rem;
      }
    }
  }
}
</style>
