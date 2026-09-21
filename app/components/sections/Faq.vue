<template>
  <section id="faq" :class="$style.wrapper">
    <div :class="$style.header">
      <h2 :class="$style.titlePrimary">ПРАВИЛА ПРОЖИВАНИЯ</h2>
      <h2 :class="$style.titleSecondary">СЛУЖБА ЗАБОТЫ</h2>
    </div>

    <div :class="$style.highlights">
      <div
        v-for="(item, index) in highlights"
        :key="index"
        :class="$style.highlight"
      >
        <img
          :class="$style.highlightIcon"
          :src="item.icon"
          alt=""
          width="40"
          height="40"
          loading="lazy"
          decoding="async"
        />
        <p :class="$style.highlightText">
          <span :class="$style.highlightTextFull">{{ item.text }}</span>
          <span
            v-for="(line, lineIndex) in item.lines"
            :key="lineIndex"
            :class="$style.highlightTextLine"
          >
            {{ line }}
          </span>
        </p>
      </div>
    </div>

    <div :class="$style.list">
      <div v-for="(item, index) in items" :key="index" :class="$style.item">
        <button
          :id="`faq-trigger-${index}`"
          type="button"
          :class="$style.trigger"
          :aria-expanded="openIndex === index"
          :aria-controls="`faq-answer-${index}`"
          @click="toggle(index)"
        >
          <span :class="$style.number">{{ formatNumber(index + 1) }}</span>
          <span :class="$style.question">{{ item.title }}</span>
          <span :class="$style.icon" aria-hidden="true">
            {{ openIndex === index ? "−" : "+" }}
          </span>
        </button>
        <div
          :id="`faq-answer-${index}`"
          :class="[$style.answer, { [$style.answerOpen]: openIndex === index }]"
          role="region"
          :aria-labelledby="`faq-trigger-${index}`"
        >
          <div :class="$style.answerClip">
            <div :class="$style.answerInner">
              <p
                v-for="(paragraph, pIndex) in item.paragraphs"
                :key="pIndex"
                :class="$style.answerText"
              >
                {{ paragraph }}
              </p>
              <div v-if="item.discounts" :class="$style.discounts">
                <div
                  v-for="(discount, dIndex) in item.discounts"
                  :key="dIndex"
                  :class="$style.discount"
                >
                  <p :class="$style.discountTitle">{{ discount.title }}</p>
                  <p :class="$style.discountText">{{ discount.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import clockIcon from "@app/assets/img/sections/rules/clock.svg?url";
import moonIcon from "@app/assets/img/sections/rules/moon.svg?url";
import shieldIcon from "@app/assets/img/sections/rules/shield-on.svg?url";
import petsIcon from "@app/assets/img/sections/rules/pets.svg?url";

export default {
  name: "Faq",
  data() {
    return {
      openIndex: null,
      highlights: [
        {
          icon: clockIcon,
          text: "Заезд 15:00 / Выезд 12:00",
          lines: ["Заезд 15:00", "Выезд 12:00"],
        },
        {
          icon: moonIcon,
          text: "Тишина после 22:00",
          lines: ["Тишина", "после 22:00"],
        },
        {
          icon: shieldIcon,
          text: "Возвратный депозит",
          lines: ["Возвратный", "депозит"],
        },
        {
          icon: petsIcon,
          text: "Питомцы по согласованию",
          lines: ["Питомцы", "по согласованию"],
        },
      ],
      items: [
        {
          title: "Философия тишины",
          paragraphs: [
            "Наша главная ценность — абсолютное уединение и покой. Мы просим гостей соблюдать тишину на открытой территории резиденции после 22:00. Использование профессионального звукового оборудования и проведение масштабных шумных мероприятий на улице не предусмотрено концепцией нашего пространства.",
          ],
        },
        {
          title: "Гостевой этикет",
          paragraphs: [
            "Мы рады семьям с детьми и стремимся сделать отдых каждого поколения безупречным. Пожалуйста, сообщите вашему персональному менеджеру возраст и пожелания маленьких гостей до заезда.",
            "Мы разделяем Вашу любовь к домашним питомцам и рады их визиту по предварительному согласованию. Пожалуйста, сообщите о них при бронировании, чтобы мы заранее согласовали все детали и рассчитали стоимость размещения.",
          ],
        },
        {
          title: "Безопасность и приватность территории",
          paragraphs: [
            "Территория резиденции полностью закрыта и находится под круглосуточной охраной. Доступ на территорию разрешен строго для зарегистрированных гостей. Визиты ваших друзей, не указанных в бронировании, возможны только по предварительному согласованию с вашим персональным консьержем.",
          ],
        },
        {
          title: "Чистый воздух и пожарная безопасность",
          paragraphs: [
            "Курение любых видов сигарет, кальянов и электронных испарителей внутри домов строго запрещено для сохранения безупречной свежести текстиля и мебели. Для вашего удобства на территории оборудованы специальные эстетичные зоны для курения. Использование открытого огня, свечей и пиротехники в резиденции не допускается.",
          ],
        },
        {
          title: "Забота о пространстве",
          paragraphs: [
            "Мы доверяем нашим гостям и создаем интерьеры из премиальных материалов. При заселении предусмотрен обеспечительный депозит, который полностью возвращается после выезда и бережной приемки резиденции.",
          ],
        },
        {
          title: "Порядок и чистота",
          paragraphs: [
            "Мы заботимся о том, чтобы вас окружала чистота. Приготовление блюд на огне предусмотрено строго в специально оборудованных мангальных зонах Резиденции. Пожалуйста, используйте предоставленные аксессуары для барбекю.",
          ],
        },
        {
          title: "Система лояльности — искусство неторопливого отдыха",
          paragraphs: [],
          discounts: [
            {
              title: "2 ночи — скидка 10% Полное погружение.",
              text: "Уикенд для того, чтобы переключиться от городской суеты. Вы успеете встретить закат на террасе, выспаться и восстановить баланс сил.",
            },
            {
              title: "3 ночи — скидка 15% Обретение гармонии.",
              text: "Идеальный ритм, чтобы перестать следить за временем. Третий день стирает остатки стресса: вы сливаетесь с природой и проживаете утро без спешных сборов.",
            },
            {
              title: "5 дней — скидка 20% Абсолютное уединение.",
              text: "Полноценная перезагрузка ума и тела. Пять дней позволяют полностью перенастроить биоритмы, насладиться утренним кофе под пение птиц и по-настоящему обжить это пространство.",
            },
            {
              title: "7 дней — скидка 25% Слияние с моментом",
              text: "Неделя, которая превращается в маленькую жизнь. Максимальное уединение, где роскошь тишины становится вашим естественным состоянием, а выгода — приятным дополнением к безупречному отдыху.",
            },
          ],
        },
      ],
    };
  },
  watch: {
    "$store.state.faqOpenIndex"(index) {
      if (index != null && index >= 0 && index < this.items.length) {
        this.openIndex = index;
        this.$store.commit("setFaqOpenIndex", null);
      }
    },
  },
  methods: {
    formatNumber(n) {
      return String(n).padStart(2, "0");
    },
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index;
    },
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
  background: $bg-white;
  @include laptop {
    padding: 5rem 0;
    gap: 3rem;
  }
  @include tablet {
    padding: 2.5rem 0;
    gap: 1.5rem;
  }
  .header {
    display: flex;
    flex-direction: column;
    .titlePrimary {
      margin: 0;
      font-weight: 400;
      font-size: 6.25rem;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      color: $text-primary;
      line-height: 1;
      @include laptop {
        font-size: 3.75rem;
      }
      @include tablet {
        font-size: 1.5rem;
        text-align: center;
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
      line-height: 1;
      @include laptop {
        font-size: 3.75rem;
      }
      @include tablet {
        font-size: 1.5rem;
        align-self: center;
        text-align: center;
      }
    }
  }
  .highlights {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }
    .highlight {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.5rem;
      @include laptop {
        gap: 0.75rem;
        padding: 0 1rem;
      }
      @include tablet {
        justify-content: flex-start;
        gap: 0.75rem;
        padding: 1rem 0.75rem;
      }
      &:not(:last-child) {
        border-right: 1px solid $text-accent;
        @include tablet {
          border-right: none;
        }
      }
      @include tablet {
        &:nth-child(odd) {
          border-right: 1px solid $text-accent;
        }
        &:nth-child(-n + 2) {
          border-bottom: 1px solid $text-accent;
        }
      }
      .highlightIcon {
        width: 2.5rem;
        height: 2.5rem;
        flex-shrink: 0;
        object-fit: contain;
        @include laptop {
          width: 2rem;
          height: 2rem;
        }
        @include tablet {
          width: 1.75rem;
          height: 1.75rem;
        }
      }
      .highlightText {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.2;
        color: $text-primary;
        white-space: nowrap;
        @include laptop {
          font-size: 0.875rem;
        }
        @include tablet {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          font-weight: 300;
          color: $text-primary;
          white-space: normal;
        }
        .highlightTextFull {
          @include tablet {
            display: none;
          }
        }
        .highlightTextLine {
          display: none;
          @include tablet {
            display: block;
          }
        }
      }
    }
  }
  .list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid $border-main;
    .item {
      border-bottom: 1px solid $border-main;
      .trigger {
        width: 100%;
        display: grid;
        grid-template-columns: 5.5rem 1fr auto;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem 0;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
        color: inherit;
        @include laptop {
          grid-template-columns: 4rem 1fr auto;
          gap: 1rem;
          padding: 1.5rem 0;
        }
        @include tablet {
          grid-template-columns: 2.25rem 1fr auto;
          gap: 0.75rem;
          padding: 1rem 0;
        }
        .number {
          font-size: 4rem;
          font-weight: 300;
          color: $text-secondary;
          line-height: 1;
          @include laptop {
            font-size: 2.5rem;
          }
          @include tablet {
            font-size: 1.5rem;
          }
        }
        .question {
          font-size: 2rem;
          font-weight: 300;
          color: $text-primary;
          line-height: 1.2;
          letter-spacing: -0.04em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          @include laptop {
            font-size: 1.5rem;
          }
          @include tablet {
            font-size: 1rem;
          }
        }
        .icon {
          font-size: 3.5rem;
          font-weight: 300;
          color: $text-secondary;
          line-height: 1;
          flex-shrink: 0;
          @include laptop {
            font-size: 2.5rem;
          }
          @include tablet {
            font-size: 1.75rem;
          }
        }
      }
      .answer {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s ease;
        &.answerOpen {
          grid-template-rows: 1fr;
        }
        .answerClip {
          overflow: hidden;
          min-height: 0;
        }
        .answerInner {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 0 0 2rem 7rem;
          @include laptop {
            padding-left: 5rem;
            padding-bottom: 1.5rem;
            gap: 0.75rem;
          }
          @include tablet {
            padding: 0 0 1rem 3rem;
            gap: 0.5rem;
          }
          .answerText {
            margin: 0;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.2;
            color: $text-primary;
            @include laptop {
              font-size: 1rem;
            }
            @include tablet {
              font-size: 0.875rem;
            }
          }
          .discounts {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            @include tablet {
              gap: 0.75rem;
            }
            .discount {
              display: flex;
              flex-direction: column;
              .discountTitle {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
                line-height: 1.2;
                color: $text-primary;
                @include laptop {
                  font-size: 1rem;
                }
                @include tablet {
                  font-size: 0.875rem;
                }
              }
              .discountText {
                margin: 0;
                font-size: 1rem;
                font-weight: 400;
                line-height: 1.2;
                color: $text-primary;
                @include laptop {
                  font-size: 1rem;
                }
                @include tablet {
                  font-size: 0.875rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
