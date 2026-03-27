<template>
  <section id="services" :class="$style.wrapper">
    <div :class="$style.titleContainer">
      <h2 :class="$style.titlePrimary">УСЛУГИ</h2>
      <h2 :class="$style.titleSecondary">РЕЗИДЕНЦИИ ВОЛГА</h2>
    </div>

    <div :class="$style.services">
      <div
        v-for="(item, index) in services"
        :key="item.title"
        :class="[
          $style.servicesItem,
          { [$style.servicesItemReversed]: index >= 2 },
          { [$style.servicesItemImageLeft]: index % 2 === 1 },
        ]"
      >
        <div :class="$style.servicesItemContainer">
          <div :class="$style.servicesItemTitleContainer">
            <h3 :class="$style.servicesItemTitle">{{ item.title }}</h3>
            <p :class="$style.servicesItemDescription">
              {{ item.description }}
            </p>
          </div>
        </div>

        <img
          :src="item.image"
          :alt="item.title"
          :class="$style.banner"
          width="850"
          height="570"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<script>
import food from "@app/assets/img/sections/services/food.webp";
import holidays from "@app/assets/img/sections/services/holidays.webp";
import excursions from "@app/assets/img/sections/services/excursions.webp";
import rental from "@app/assets/img/sections/services/rental.webp";

export default {
  name: "Services",
  data() {
    return {
      info: [
        {
          title: "Повар",
          description:
            "Wi-Fi · ТВ · Повар · Ежедневная уборка · Чистое постельное белье · Полотенца · Средства гигиены · Парковка · Транспортная доступность · Асфальтированная дорога · Видео наблюдение · Охраная система гбр",
        },
        {
          title: "Фотосесии",
          description: "Кейтеринг повар\nФото видео\nКейтеринг",
        },
        {
          title: "Экскурсии",
          description:
            "Wi-Fi · ТВ · Повар · Ежедневная уборка · Чистое постельное белье · Полотенца · Средства гигиены · Парковка · Транспортная доступность · Асфальтированная дорога · Видео наблюдение · Охраная система гбр",
        },
      ],
      services: [
        {
          title: "Питание",
          description:
            "Для вашего комфортного отдыха в нашей\nрезиденции мы предлагаем услуги\nперсонального повара,\nи организацию мероприятий с привлечением\nкейтеринга",
          image: food,
          icon: true,
        },
        {
          title: "Праздники",
          description:
            "Организуем и подготовим виллу для вашего\nпраздника:\nФотосессии\nВидеосъемки\nДетские праздники\nСвадьбы",
          image: holidays,
          icon: false,
        },
        {
          title: "Экскурсии",
          description:
            'Организуем персональные и групповые\nэкскурсии по достопримечательностям:\n• Замок "Гарибальди"\n• Воскресенский мужской монастырь\n• Обзорная экскурсия по волге',
          image: excursions,
          icon: false,
        },
        {
          title: "Прокат",
          description:
            "Для активного отдыха мы предлагаем прокат:\n• Квадроциклов\n• Велосипедов\n• Инвентаря для рыбалки\n• Лыжи и сноуборд",
          image: rental,
          icon: false,
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
  padding: 7.5rem 5rem;
  gap: 5rem;
  color: $text-primary;
  @include mobile {
    padding: 5rem 1rem;
    gap: 1.5rem;
  }
}

.titleContainer {
  text-align: center;
  @include mobile {
    max-width: 100%;
  }
}

.titlePrimary {
  margin: 0;
  @include mobile {
    font-size: 1.5rem;
  }
}

.titlePrimary,
.titleSecondary {
  color: $text-primary;
  text-align: center;
  font-weight: 400;
  @include mobile {
    text-align: center;
    font-size: 1.5rem;
  }
}

.titleSecondary {
  @include mobile {
    font-size: 1.5rem;
  }
  white-space: nowrap;
  display: inline-block;
}

.info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @include tablet {
    display: none;
  }
}

.infoItem {
  padding: 0 1rem 0.875rem 1rem;
  border-left: 1px solid $text-primary;
  &:first-child {
    border-left: none;
  }
}

.infoItemTitleContainer {
  display: flex;
  align-items: center;
  gap: 1rem;
  img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: contain;
  }
  .infoItemTitle {
    font-size: 2rem;
    font-weight: 300;
  }
}
.infoItemDescription {
  margin: 1rem 0 0 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
}

.services {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @include mobile {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}

.servicesItem {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 1.125rem;
  padding: 0.5rem;
  @include mobile {
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
    background: $bg-white;
    border-radius: 1rem;
    border: 1px solid $bg-primary;
  }

  .banner {
    width: 26.563rem;
    height: 17.813rem;
    object-fit: cover;
    @include tablet {
      width: 16.563rem;
      height: 17.813rem;
      border-radius: 0.75rem;
    }
    @include mobile {
      width: 8.75rem;
      height: 8.75rem;
      min-width: 8.75rem;
      border-radius: 0.75rem;
      object-fit: cover;
    }
  }

  &.servicesItemReversed {
    .servicesItemContainer {
      order: 2;
    }
    > img {
      order: 1;
    }
    @include mobile {
      .servicesItemContainer,
      .banner {
        order: unset;
      }
    }
  }

  &.servicesItemImageLeft {
    @include mobile {
      .servicesItemContainer {
        order: 2;
      }
      .banner {
        order: 1;
      }
    }
  }
}

.servicesItemContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem;
  @include mobile {
    padding: 0;
    min-width: 0;
    justify-content: flex-start;
    gap: 0.5rem;
  }
  img {
    display: flex;
    align-items: flex-end;
    width: 2.5rem;
    height: 2.5rem;
    object-fit: contain;
    @include tablet {
      display: none;
    }
  }
}

.servicesItemTitle {
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0 0.75rem 0;
  @include mobile {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
    padding: 0.5rem 0.5rem 0.25rem 0.5rem;
    text-transform: uppercase;
    color: $text-primary;
    line-height: 1.3;
  }
}

.servicesItemDescription {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.2;
  white-space: pre-line;
  letter-spacing: -2%;
  @include mobile {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.2;
    color: $text-secondary;
    padding: 0 0.5rem 0.5rem 0.5rem;
    white-space: pre-line;
  }
}
</style>
