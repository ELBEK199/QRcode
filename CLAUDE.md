# O'zbek tilida AI sifatini oshirish loyihasi

> Bu hujjat loyihaning yo'l xaritasi va ish tartibi. Har bir bosqichda yangilanib boriladi.

---

## 1. Loyihaning maqsadi

**Muammo:** O'zbek tilida ishlaydigan AI modellar sifatsiz. Ular grammatikani buzadi,
qo'shimchalarni chalkashtiradi, kirill va lotin alifbolarini aralashtirib yuboradi,
madaniy kontekstni tushunmaydi.

**Maqsad:** Bu muammoni **o'lchash**, **sabablarini aniqlash** va **amaliy yechim** taklif qilish.

**Muhim tamoyil:** Loyiha "AI qilamiz" degan umumiy g'oya emas. Har bir bosqichning
aniq, tekshiriladigan natijasi bo'ladi.

---

## 2. Muammo tahlili — nega o'zbekcha AI sifatsiz

Bu "modellar yomon" degani emas. Aniq texnik sabablari bor. Quyidagilar
loyihaning ishchi gipotezalari — 1-bosqichda ular raqam bilan tasdiqlanadi
yoki rad etiladi.

### 2.1. Ma'lumot kamligi (low-resource language)

Til modellari internetdagi matndan o'rganadi. Ingliz tilida ochiq matn hajmi
trillionlab so'z bilan o'lchanadi, o'zbekchada esa undan bir necha ming baravar kam.

O'zbek Wikipedia ingliz Wikipediasidan sezilarli darajada kichik (aniq nisbatni
1-bosqichda tekshiramiz). Umumiy korpuslarda (CommonCrawl, OSCAR, CC-100)
o'zbekcha ulush foizning yuzdan bir qismlari atrofida.

**Oqibati:** model o'zbekchani "chetdan ko'rgan" til sifatida biladi, ona tilidek emas.

### 2.2. Tokenizatsiya — eng katta va eng kam gapiriladigan muammo

O'zbek tili **agglyutinativ**: so'z o'zagiga qo'shimchalar ketma-ket yopishadi va
bitta so'z ingliz tilidagi butun bir gapga teng ma'no tashiydi.

Misol: `kitoblarimizdagilardan`
```
kitob + lar + imiz + da + gi + lar + dan
```
Bu bitta so'z. Ingliz tiliga moslangan tokenizator (BPE) buni 8–12 ta bo'lakka
bo'lib tashlaydi va bu bo'laklarning ko'pi hech qanday ma'no birligiga mos kelmaydi.

**Ikki xil zarari bor:**

1. **Iqtisodiy:** bir xil ma'nodagi matn uchun o'zbekcha inglizchaga qaraganda
   taxminan 3–5 baravar ko'p token sarflaydi. Ya'ni o'zbekcha foydalanuvchi
   xuddi shu javob uchun bir necha barobar ko'p to'laydi va sekinroq javob oladi.
   (Aniq koeffitsiyentni 1-bosqichda o'lchaymiz.)

2. **Sifat:** model so'zning morfologik tuzilishini ko'rmaydi. Shuning uchun
   qo'shimchalarni noto'g'ri qo'yadi, kelishiklarni chalkashtiradi.

Bu gipotezaning kuchli tomoni — u **to'g'ridan-to'g'ri o'lchanadi**. Turli
modellarning tokenizatorlarini olib, bir xil matnni necha tokenga bo'lishini
sanash mumkin. Bu 1-bosqichning eng oson va eng ishonchli qismi.

### 2.3. Ikki alifbo muammosi

O'zbek tili lotin va kirill alifbolarida yoziladi. Model uchun `shahar` va `шаҳар` —
bir-biriga aloqasi yo'q, butunlay boshqa belgilar ketma-ketligi.

**Oqibati:** allaqachon kam bo'lgan o'quv ma'lumoti yana ikkiga bo'linadi. Model
har bir alifboni alohida, yarim ma'lumot bilan o'rganadi.

Qo'shimcha murakkablik: `ʻ` (tutuq belgisi) turlicha yoziladi — `oʻ`, `o'`, `o`,
`ў`. Bular normalizatsiya qilinmasa, model uchun boshqa-boshqa so'zlar.

### 2.4. Instruksiya ma'lumotining yo'qligi

Model foydali javob berishni "savol → yaxshi javob" juftliklaridan o'rganadi
(instruction tuning). Ingliz tilida bunday ochiq to'plamlar millionlab, o'zbekchada
esa sifatlisi deyarli yo'q.

Mavjudlarining ko'pi ingliz tilidan **mashina tarjimasi** orqali olingan, ya'ni
ular allaqachon sifatsiz va tarjima xatolarini o'z ichiga oladi.

### 2.5. O'lchov yo'qligi — va bu eng muhimi

Hozirgi holat: "o'zbekcha AI yomon" degan gap **his-tuyg'uga** asoslangan.

Javobi yo'q savollar:
- Qaysi model qanchalik yomon? GPT bilan Gemini orasida farq bormi?
- Aynan qayerda adashadi — grammatikadami, faktdami, tarjimadami?
- Qilingan o'zgarish natijani yaxshiladimi yoki yomonlashtirdimi?

**O'lchay olmagan narsani tuzatib bo'lmaydi.** Shuning uchun loyiha aynan
o'lchovdan boshlanadi.

---

## 3. Realistik bo'lmagan yo'llar — ochiq aytilgan cheklovlar

Loyihani o'lik tug'ilishidan saqlash uchun quyidagilar **maqsad qilib olinmaydi**:

| Yo'l | Nega yo'q |
|---|---|
| Noldan til modeli o'qitish | Millionlab dollarlik GPU va yillar davomidagi jamoa ishi. Hatto yirik kompaniyalar ham bu yo'lni tanlamayapti. |
| Katta modellarni to'liq qayta o'qitish (full fine-tune) | O'nlab GPU va katta byudjet talab qiladi. LoRA orqali arzon muqobili bor (3-bosqich). |
| Yopiq modellar (GPT, Claude, Gemini) ichini o'zgartirish | Texnik imkonsiz — ular yopiq. Faqat tashqaridan sinash mumkin. |

---

## 4. Yo'l xaritasi

```
1-bosqich: BENCHMARK      →  Muammoni raqamga aylantirish
2-bosqich: MA'LUMOT       →  Toza o'zbekcha korpus
3-bosqich: FINE-TUNING    →  Ochiq modelni yaxshilash (LoRA)
4-bosqich: TOKENIZATOR    →  Eng chuqur muammoni hal qilish
```

Har bir bosqich o'zicha ham qimmatli natija beradi. Loyiha yarim yo'lda to'xtab
qolsa ham, qilingan ish behuda ketmaydi.

---

## 5. 1-bosqich — O'zbekcha AI benchmark (BOSHLANG'ICH NUQTA)

### Nima uchun aynan shundan boshlanadi

- Yakka odam bir necha haftada uddalay oladi
- GPU kerak emas, xarajat deyarli yo'q (faqat API so'rovlari)
- Natijasi hozir hech kimda yo'q, lekin hammaga kerak
- Keyingi barcha bosqichlar shunga tayanadi — yaxshilanishni shu bilan o'lchaymiz
- Ochiq e'lon qilinsa, ko'rinadigan va foydalaniladigan ish bo'ladi

### Nima quriladi

200–500 ta sinov savolidan iborat to'plam. Har bir savolning to'g'ri javobi
qo'lda tekshirilgan bo'ladi.

### Sinov kategoriyalari

**A. Morfologiya va qo'shimchalar**
Modelning agglyutinativ tuzilmani tushunishini sinaydi.
```
"Kitoblarimizdagilardan" so'zini morfemalarga ajrating.
"Bormoqchi edim" ni o'tgan zamon shakliga o'tkazing.
```

**B. Grammatika va kelishiklar**
```
Xato: "Men maktabga bordim uyga"  →  To'g'rilang.
"Kitob" so'zini oltita kelishikda yozing.
```

**C. Alifbo konvertatsiyasi**
```
Lotin → kirill: "O'zbekiston Respublikasi"
Kirill → lotin: "Ўзбекистон Республикаси"
Aralash matnni bir alifboga keltiring.
```

**D. Tarjima sifati**
Ingliz ↔ o'zbek, ikki yo'nalishda. Idiomalar va ko'p ma'noli so'zlarga alohida e'tibor.

**E. Madaniy va mahalliy kontekst**
```
Navro'zda nima taom pishiriladi?
"Ko'zi uchmoq" iborasi nimani anglatadi?
Alisher Navoiy qaysi asrda yashagan?
```

**F. Mantiq va matematika (o'zbek tilida)**
Modelning fikrlash qobiliyati o'zbekchada inglizchaga nisbatan qanchalik
pasayishini o'lchaydi. **Muhim nazorat sinovi:** aynan shu savollarni ingliz
tilida ham berib, farqni o'lchaymiz. Farq katta bo'lsa — muammo tildan, mantiqdan emas.

**G. Tokenizatsiya samaradorligi** (avtomatik, model chaqirmasdan)
Bir xil ma'nodagi matnni o'zbekcha va inglizcha yozib, har bir model tokenizatori
necha token sarflashini sanaymiz. Bu 2.2-bo'limdagi gipotezani to'g'ridan-to'g'ri tekshiradi.

### Sinaladigan modellar

| Model | Turi | Izoh |
|---|---|---|
| GPT (OpenAI) | Yopiq | Bozor yetakchisi |
| Claude (Anthropic) | Yopiq | |
| Gemini (Google) | Yopiq | Bepul limiti bor |
| Qwen | Ochiq | Ko'p tilli, o'zbekchani nisbatan yaxshi biladi |
| Llama | Ochiq | |
| Gemma | Ochiq | |

Ochiq modellar mahalliy yoki bepul API orqali sinaladi.

### Baholash usuli

1. **Avtomatik (aniq javobli savollar):** alifbo konvertatsiyasi, morfologiya —
   to'g'ri/noto'g'ri deb belgilanadi.
2. **LLM-as-judge (erkin javoblar):** kuchli model hakam sifatida 1–5 ball qo'yadi.
   Arzon va tez, lekin xatosi bor.
3. **Qo'lda tekshirish (namuna):** hakam modelning bahosi qanchalik to'g'ri
   ekanini bilish uchun javoblarning bir qismi qo'lda tekshiriladi.

**Diqqat:** 3-usulsiz 2-usulga ishonib bo'lmaydi. Hakam modelning o'zi ham
o'zbekchani yaxshi bilmasligi mumkin — bu loyihaning asosiy metodologik xavfi
va hujjatda ochiq qayd etiladi.

### 1-bosqich natijasi

- Ochiq benchmark to'plami (JSON)
- Avtomatik sinov skripti
- Natijalar jadvali: qaysi model, qaysi kategoriyada, necha ball
- Xatolar tahlili: eng ko'p uchraydigan xato turlari
- README — usul va natijalar tavsifi

---

## 6. 2-bosqich — Ma'lumot to'plash va tozalash

**Manbalar:** O'zbek Wikipedia, ochiq yangilik saytlari (litsenziyasi tekshirilgan
holda), ochiq kitob to'plamlari, hukumat hujjatlari, OSCAR/CC-100 ning o'zbekcha qismi.

**Tozalash bosqichlari:**
1. Kirill → lotin normalizatsiya (yoki ikkalasini saqlash — qarori keyin)
2. Tutuq belgisi va apostroflarni yagona ko'rinishga keltirish (`oʻ`, `gʻ`)
3. Takrorlarni olib tashlash (deduplication)
4. Til aniqlash — o'zbekcha bo'lmagan matnni filtrlash
5. Sifat filtri — spam, avtomatik tarjima, buzuq matnlarni chiqarib tashlash

**Muhim:** har bir manbaning litsenziyasi tekshiriladi. Litsenziyasi noaniq
ma'lumot to'plamga kiritilmaydi.

**Natija:** ochiq, tozalangan o'zbekcha korpus + tozalash skriptlari.

---

## 7. 3-bosqich — Fine-tuning (LoRA)

**Usul:** ochiq modelni (dastlabki nomzod — Qwen yoki Gemma) o'zbekcha ma'lumotda
qo'shimcha o'qitish. To'liq qayta o'qitish emas, **LoRA** — modelning kichik bir
qismini moslashtirish.

**Nega LoRA:** to'liq fine-tune o'nlab GPU talab qiladi, LoRA esa bitta ijaraga
olingan GPU'da ishlaydi. Taxminiy xarajat: bir necha o'nlab dollar.

**Muhim shart:** natija **1-bosqichdagi benchmark bilan o'lchanadi**. "Yaxshi
bo'ldi shekilli" degan xulosa qabul qilinmaydi — oldingi va keyingi ball
solishtiriladi.

**Halol ogohlantirish:** fine-tuning bir tilni yaxshilab, boshqa qobiliyatlarni
yomonlashtirishi mumkin (catastrophic forgetting). Buni ham o'lchash kerak.

---

## 8. 4-bosqich — Tokenizator

Eng qiyin, lekin 2.2-bo'limdagi eng chuqur muammoni hal qiladi.

**Yo'nalishlar:**
- O'zbek morfologiyasini hisobga oladigan tokenizator o'qitish
- Mavjud tokenizatorga o'zbekcha morfemalarni qo'shish (vocabulary extension)
- Morfologik analizator bilan oldindan ishlov berish

Bu bosqich 1–3 bosqichlar tugagandan keyin, olingan bilim asosida aniqlashtiriladi.

---

## 9. Texnik stek

| Qism | Tanlov |
|---|---|
| Til | Python |
| API mijozlari | `anthropic`, `openai`, `google-genai` |
| Ma'lumot | `datasets`, `pandas` |
| Fine-tuning (3-bosqich) | `transformers`, `peft`, `trl` |
| Testlar | `pytest` |
| Konfiguratsiya | `.env` (kalitlar hech qachon repoga tushmaydi) |

**API kalitlari:** boshlanishida bepul variantlardan (Gemini, Groq) foydalaniladi.
Kod modelni almashtirish bitta konfiguratsiya o'zgarishi bo'ladigan qilib yoziladi.

---

## 10. Repo tuzilishi (rejalashtirilgan)

```
.
├── CLAUDE.md              # shu hujjat
├── README.md              # loyiha tavsifi
├── benchmark/
│   ├── data/              # sinov savollari (JSON)
│   ├── run_eval.py        # sinov skripti
│   ├── scorers/           # baholash usullari
│   └── results/           # natijalar
├── corpus/                # 2-bosqich
├── finetune/              # 3-bosqich
├── leetcode/              # mavjud LeetCode yechimlari
└── tests/
```

**Eslatma:** repoda hozir ikkita LeetCode yechimi bor (`Two sum`,
`Palindrome_number`). Ular `leetcode/` papkasiga ko'chiriladi va `.py`
kengaytmasi beriladi — lekin bu alohida, kichik ish, asosiy loyihaga aloqasi yo'q.

---

## 11. Ochiq savollar

Bu savollarga javob berilmaguncha ish boshlanmaydi yoki taxmin asosida boshlanadi:

1. **Resurs:** faqat noutbukmi, yoki GPU'ga byudjet ajratiladimi? (1-bosqich uchun shart emas)
2. **Dasturlash darajasi:** Python bilan qay darajada ishlangan?
3. **Aniq muammolar:** o'zbekcha AI'da eng ko'p uchraydigan, asabiylashtiradigan
   xatolar qaysi? Benchmark real misollardan qurilishi kerak, taxmindan emas.
4. **Mavjud ishlar:** o'zbek tili uchun allaqachon nima qilingan? (Tahrirchi va
   boshqa jamoalarning ishlari tekshirilishi kerak — ikki marta bir ish qilmaslik uchun)

---

## 12. Ish tartibi

- Har bir bosqich alohida branchda bajariladi, natija PR orqali qo'shiladi
- Har bir gipoteza raqam bilan tasdiqlanadi yoki rad etiladi
- Tasdiqlanmagan da'vo hujjatda "tekshirilishi kerak" deb belgilanadi
- API kalitlari va shaxsiy ma'lumot hech qachon repoga tushmaydi
- Izohlar va hujjatlar o'zbek tilida, kod va o'zgaruvchi nomlari ingliz tilida

---

## 13. Hujjat holati

Bu hujjatdagi raqamli baholar (3–5 baravar token, Wikipedia hajmi nisbati va
boshqalar) **hozircha taxminiy**. Ular 1-bosqichda o'lchanadi va shundan keyin
aniq qiymatlarga almashtiriladi.

Oxirgi yangilanish: 1-bosqich boshlanishidan oldin.
