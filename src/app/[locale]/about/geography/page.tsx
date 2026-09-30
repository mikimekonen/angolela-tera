import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function GeographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Highland Topography & Natural Environment',
      title: 'Geography, Climate & Agro-Ecology',
      subtitle: 'The ecological profile of Angolela Tera Woreda: elevation zones, river hydrological basins, temperate highland climate, and soil characteristics.',
      elevationTitle: 'Elevation & Agro-Ecological Classification',
      elevationText:
        'Angolela Tera is situated entirely within the Ethiopian highland plateau of North Shewa, with elevations ranging between 2,600 and 3,050 meters above sea level. This high altitude positions the woreda in the Dega agro-ecological classification, providing a cool, disease-free climate ideal for cereal crops, high-yield dairy cows, and sheep husbandry.',
      riverTitle: 'Hydrological Basins & River Networks',
      riverText:
        'The woreda is blessed with perennial river streams, most prominently the Chacha River and tributaries feeding into the larger Jemma-Abay (Blue Nile) basin. These river corridors maintain lush green riverbanks year-round and provide critical water reserves for micro-irrigation, cattle watering, and urban supply.',
      soilTitle: 'Soils & Agricultural Potential',
      soilText:
        'The predominant soil classification across the undulating plains is Vertisol (deep fertile black soil), renowned for its exceptional water-retention capacity. This makes the plains of Angolela Tera exceptionally suited for rain-fed wheat, barley, teff, horse beans (faba beans), and field peas.',
      climateStats: [
        { label: 'Elevation Range', value: '2,600 – 3,050 m', sub: 'Highland plateau' },
        { label: 'Annual Rainfall', value: '950 – 1,200 mm', sub: 'Bimodal (Belg & Meher)' },
        { label: 'Mean Temperature', value: '11°C – 19°C', sub: 'Cool temperate (Dega)' },
        { label: 'Primary Basin', value: 'Chacha River', sub: 'Upper Blue Nile drainage' },
      ],
      backToAbout: 'Back to Woreda Overview',
    },
    am: {
      tag: 'ደጋማ መልክአ ምድርና ተፈጥሮ',
      title: 'መልክአ ምድር፣ አየር ንብረትና ስነ-ምህዳር',
      subtitle: 'የአንጎሌላ ተራ ወረዳ የከፍታ መጠን፣ የተፈጥሮ ወንዞች ተፋሰስ፣ የደጋ አየር ንብረትና ለም የአፈር አይነቶች መገለጫ።',
      elevationTitle: 'ከፍታና የስነ-ምህዳር ምደባ',
      elevationText:
        'አንጎሌላ ተራ ወረዳ በሰሜን ሸዋ ከፍተኛ ደጋማ ስፍራ ላይ የምትገኝ ሲሆን ከባህር ወለል በላይ ከ2,600 እስከ 3,050 ሜትር ከፍታ አላት። ይህ ከፍታ ወረዳዋን ሙሉ በሙሉ በደጋማ የአየር ንብረት ክልል ውስጥ የሚያስቀምጣት ሲሆን ለስንዴ፣ ለገብስ፣ ለወተት ላሞችና ለደጋ በጎች ዝርያ እጅግ ተስማሚ ነው።',
      riverTitle: 'የወንዞች ተፋሰስና የውሃ ሀብት',
      riverText:
        'ወረዳው በማያቋርጡ የተፈጥሮ ወንዞች የተባረከ ሲሆን ዋነኛው የጫቻ ወንዝና ገባሮቹ ወደ ጀማ-አባይ ተፋሰስ የሚቀላቀሉ ናቸው። እነዚህ ወንዞች ዓመቱን ሙሉ ለእንስሳት መጠጥ፣ ለአነስተኛ መስኖ እና ለከተሞች የውሃ አቅርቦት ያገለግላሉ።',
      soilTitle: 'የአፈር አይነትና የሰብል ምርታማነት',
      soilText:
        'በአንጎሌላ ተራ ሜዳዎች ላይ ዋነኛው የአፈር አይነት ለም የጥቁር አፈር (Vertisol) ሲሆን እርጥበትን የመጠበቅ ከፍተኛ አቅም አለው። ይህ አፈር ለስንዴ፣ ለገብስ፣ ለጤፍ፣ ለአተርና ባቄላ ሰብሎች ከፍተኛ ምርት ያስገኛል።',
      climateStats: [
        { label: 'የከፍታ መጠን', value: '2,600 – 3,050 ሜ', sub: 'ከፍተኛ ደጋማ አምባ' },
        { label: 'ዓመታዊ ዝናብ', value: '950 – 1,200 ሚ.ሜ', sub: 'የበልግና የመኸር ዝናብ' },
        { label: 'አማካይ ሙቀት', value: '11°C – 19°C', sub: 'ቀዝቃዛ ደጋማ አየር' },
        { label: 'ዋና ተፋሰስ', value: 'የጫቻ ወንዝ', sub: 'የአባይ ተፋሰስ ገባር' },
      ],
      backToAbout: 'ወደ ወረዳው አጠቃላይ መረጃ ተመለስ',
    },
    om: {
      tag: 'Teessuma Lafa Baddaa',
      title: 'Teessuma Lafa, Qilleensa fi Qabeenya Uumamaa',
      subtitle: 'Qilleensa baddaa, laggeen fi lafa qonnaaf mijatu aanaa keenyaa.',
      elevationTitle: 'Olka\'iinsa fi Qilleensa',
      elevationText:
        'Aanaan kun galaana irraa olka\'iinsa meetira 2,600 hanga 3,050 irratti argama. Qilleensi ishee baddaa fi oomisha qamadii fi loowwaniif mijataadha.',
      riverTitle: 'Laggeen fi Bishaan',
      riverText:
        'Laggi Caaccetti fi laggeen biroo aanaa kana keessa yaa\'uun waggaa guutuu tajaajila jallisii fi dhugaatiitiif oolu.',
      soilTitle: 'Biyyee fi Qonna',
      soilText:
        'Biyyeen gurraachi lafa aanaa kana keessatti bal\'inaan argamu oomishtummaa qamadii, garbuu fi baaqelaatiif baay\'ee gaariidha.',
      climateStats: [
        { label: 'Olka\'iinsa', value: '2,600 – 3,050 m', sub: 'Baddaa' },
        { label: 'Rooba Waggaa', value: '950 – 1,200 mm', sub: 'Rooba Gahaa' },
        { label: 'Ho\'a Giddu-galeessaa', value: '11°C – 19°C', sub: 'Qilleensa Qabbanaawaa' },
        { label: 'Laga Guddaa', value: 'Laga Caaccetti', sub: 'Laga Abbayyaatti Yaa\'a' },
      ],
      backToAbout: 'Gara Fuula Duraatti Deebi\'i',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {content.climateStats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {stat.label}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-[#1a4f8b] mt-1">
                {stat.value}
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Narrative Cards */}
        <div className="space-y-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#0d2340] mb-3">
              {content.elevationTitle}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {content.elevationText}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#0d2340] mb-3">
              {content.riverTitle}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {content.riverText}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#0d2340] mb-3">
              {content.soilTitle}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {content.soilText}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b]"
          >
            <span>← {content.backToAbout}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
