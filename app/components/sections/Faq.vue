<template>
  <section id="faq" :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.titleLine1">
        <h2 :class="$style.title">ЧАСТО ЗАДАВАЕМЫЕ</h2>
      </div>
      <div :class="$style.titleLine2">
        <div :class="$style.titleLine2Left">
          <p :class="$style.contactText">Остались вопросы</p>
          <p :class="$style.contactText">свяжитесь с нами</p>
        </div>
        <h2 :class="$style.title">ВОПРОСЫ</h2>
        <div :class="$style.titleLine2Right">
          <a
            :class="$style.contactPhone"
            href="tel:+79171274080"
            aria-label="Позвонить"
            >8 (917) 127-40-80</a
          >
          <a
            :class="$style.contactPhone"
            href="mailto:volga-dom163@mail.ru"
            aria-label="Написать на почту"
            >volga-dom163@mail.ru</a
          >
        </div>
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
          <span :class="$style.question">{{ item.question }}</span>
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
          <p :class="$style.answerText">{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Faq",
  data() {
    return {
      openIndex: null,
      items: [
        {
          question: "Какое время заезда/выезда?",
          answer: "Заезд после 15:00 выезд до 12:00",
        },
        {
          question: "Возможно ли заселение с домашними животными?",
          answer: "По согласованию",
        },
        {
          question: "Где можно ознакомиться с правилами проживания:",
          answer: `ПРАВИЛА ПРОЖИВАНИЯ:
Мы рады принимать Вас у себя в гостях и надеемся, что наши старания и наш сервис оставит только положительные эмоции и теплые воспоминания от вашего пребывания в нашей резиденции. Также, в свою очередь, рассчитываем на вашу порядочность, бережное отношение к нашему имуществу, уважение к труду наших сотрудников.

КАК ПРОХОДИТ ПРОЦЕСС ЗАСЕЛЕНИЯ

Время заезда - с 15:00 до 18:00 (иное оговаривается отдельно). 
Время выезда - до 12:00. 
Заселение происходит через администратора с заключением договора аренды.
Накануне наш сотрудник высылает в один из мессенджеров всю информацию по заселению. Непосредственно в день заезда при заключении договора вносится доплата за проживание (при необходимости)  и депозит в размере 10000 ₽ (возвращается в день выезда после приемки дома в случае отсутствия грубых нарушений правил пребывания). 

ДЛЯ ЧЕГО ОПЛАЧИВАЕТСЯ ДЕПОЗИТ

        При заселении любого гостя, в обязательном порядке с него взимается залоговая        
        сумма (депозит) в размере 10000 ₽. 
Эта сумма является неким обеспечительным платежом, гарантирующим  соблюдение гостем определенных правил проживания и соответствующего отношения гостя к нашему имуществу; гарантией того, что при выезде гостя дом останется в хорошем состоянии. Отказ гостя от оплаты залога равен нашему отказу в заселении. Если после выезда гостя, при приемки дома, нами не обнаружены нарушения правил пребывания и порчи имущества, не было жалоб со стороны соседей, залог в полном объеме возвращается гостю до 18:00 дня выезда из квартиры. Депозит для нас не является средством заработка и мы не заинтересованы в его удержании, однако иногда это становиться вынужденной необходимостью, в качестве компенсации причиненного ущерба и в целях восстановления должного состояния имущества.

ОСНОВНЫЕ ПРАВИЛА ПРЕБЫВАНИЯ В НАШИХ АПАРТАМЕНТАХ

Мы будем очень признательны за сохранение чистоты и порядка в доме и вынесенный мусор после вашего пребывания.
В доме категорически запрещено курение любых видов сигарет, вэйпов, айкосов, кальянов и т. п. 
Запрещено нарушать покой соседей, шуметь на улице в период с 22:00 до 09:00.
Запрещено пребывание в доме лиц, не оговоренных в договоре 
Запрещена перестановка крупногабаритной мебели и техники
Запрещено использовать не по назначению имущество  (в т.ч. постельное белье и полотенца), выносить имущество из дома.
В случае нарушения данных правил пребывания, нами удерживается депозит в полном объеме или частично, в зависимости от конкретной ситуации. Решение об удержании размера денежной суммы принимается администратором.

ВОЗМОЖЕН ЛИ РАННИЙ ЗАЕЗД И ПОЗДНИЙ ВЫЕЗД

Решение о возможности раннего заезда и позднего выезда, а так же о дополнительной плате за это принимает Администратор. Все зависит от плотности занятости. 

В ЧЕМ ЗАКЛЮЧАЕТСЯ СИСТЕМА ЛОЯЛЬНОСТИ ДЛЯ НАШИХ ГОСТЕЙ

При бронировании наших апартаментов на срок от 2 суток предоставляется скидка 10%
При бронировании наших апартаментов на срок от 3 суток предоставляется скидка 15%
При бронировании наших апартаментов на срок от 5 суток предоставляется скидка 20%
При бронировании наших апартаментов на срок более 5 суток обсуждаются индивидуальные условия в зависимости от количества проживающих и сопутствующих факторов. Мы всегда стараемся прийти к взаимовыгодному соглашению и удовлетворить запросы гостей.
`,
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
@use "@app/assets/scss/mixins.scss" as *;

.wrapper {
  background: $bg-white;
  padding: 5rem;
  @include tablet {
    padding: 5rem 2.5rem;
  }
  @include mobile {
    padding: 2.5rem 1rem;
  }
}

.header {
  display: flex;
  flex-direction: column;
  padding: 0 0 5rem 0;
  border-bottom: 1px solid $text-secondary;
  @include mobile {
    padding: 0 0 2.5rem 0;
    border-bottom: none;
  }
}

.titleLine2Left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .contactText {
    margin: 0;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.2;
    color: $text-primary;
    @include mobile {
      display: none;
    }
  }
}

.titleLine2Right {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;

  @include tablet {
    align-items: flex-end;
  }
  @include mobile {
    display: none;
  }

  .contactPhone {
    margin: 0;
    font-size: 1rem;
  }
}

.title {
  font-size: 6.25rem;
  font-weight: 400;
  @include mobile {
    font-size: 1.875rem;
    font-weight: 300;
  }
}

.titleLine1 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.titleLine2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .title {
    text-align: center;
    margin: 0;
  }

  @include tablet {
    justify-content: space-between;
    align-items: flex-end;

    .title {
      text-align: center;
      margin: 0;
    }
  }
  @include mobile {
    justify-content: flex-end;
    align-items: flex-start;

    .title {
      margin: 0;
    }
  }
}

.contactPhone {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.2;
  color: $text-primary;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.list {
  display: flex;
  flex-direction: column;
}

.item {
  border-bottom: 1px solid $text-secondary;
  @include mobile {
    &:first-child {
      border-top: 1px solid #e8e8e8;
    }
    border-bottom: 1px solid #e8e8e8;
  }
}

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
  @include mobile {
    grid-template-columns: 2.25rem 1fr auto;
    gap: 0.75rem;
    padding: 1rem 0;
    align-items: center;
  }
}

.number {
  font-size: 4rem;
  font-weight: 300;
  color: $text-secondary;
  line-height: 1;
  @include mobile {
    font-size: 1.5rem;
    font-weight: 300;
    color: $text-secondary;
  }
}

.question {
  font-size: 2rem;
  font-weight: 300;
  @include mobile {
    font-size: 1rem;
    font-weight: 300;
    color: $text-primary;
  }
}

.icon {
  font-size: 3.5rem;
  font-weight: 300;
  color: $text-secondary;
  line-height: 1;
  @include mobile {
    font-size: 2.25rem;
    color: $text-secondary;
    flex-shrink: 0;
  }
}

.answer {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.answerOpen {
  max-height: 28rem;
  overflow-y: auto;
  overflow-x: hidden;
  @include mobile {
    max-height: 22rem;
  }
}

.answerText {
  margin: 0 0 2rem;
  padding-left: 7.25rem;
  font-size: 1.5rem;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.5;
  white-space: pre-line;
  @include mobile {
    margin: 0 0 1rem;
    padding-left: 3rem;
    padding-right: 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }
}
</style>
