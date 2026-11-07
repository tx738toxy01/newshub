const fs = require('fs');
const path = require('path');

const SOURCES = [
  { id: 'sk_1', lang: 'sk', group: 'Slovensko', url: 'https://www.aktuality.sk/rss/', name: 'Aktuality.sk', defaultCats: ['domov'] },
  { id: 'sk_2', lang: 'sk', group: 'Slovensko', url: 'https://spravy.pravda.sk/rss/xml/', name: 'Pravda.sk', defaultCats: ['domov'] },
  { id: 'sk_3', lang: 'sk', group: 'Slovensko', url: 'https://dennikn.sk/feed/', name: 'Denník N', defaultCats: ['domov'] },
  { id: 'sk_4', lang: 'sk', group: 'Slovensko', url: 'https://www.teraz.sk/rss/vsetko.rss', name: 'Teraz.sk', defaultCats: ['domov'] },
  { id: 'sk_5', lang: 'sk', group: 'Slovensko', url: 'https://hnonline.sk/feed', name: 'HNonline.sk', defaultCats: ['domov', 'ekonomika'] },
  { id: 'sk_6', lang: 'sk', group: 'Slovensko', url: 'https://www.ta3.com/rss', name: 'TA3', defaultCats: ['domov'] },
  { id: 'sk_7', lang: 'sk', group: 'Slovensko', url: 'https://www.trend.sk/rss', name: 'Trend.sk', defaultCats: ['ekonomika'] },
  { id: 'sk_8', lang: 'sk', group: 'Slovensko', url: 'https://zive.aktuality.sk/rss/', name: 'Živé.sk', defaultCats: ['tech'] },
  { id: 'sk_9', lang: 'sk', group: 'Slovensko', url: 'https://www.postoj.sk/rss', name: 'Postoj.sk', defaultCats: ['domov'] },
  { id: 'sk_10', lang: 'sk', group: 'Slovensko', url: 'https://www.startitup.sk/feed/', name: 'Startitup.sk', defaultCats: ['domov'] },
  { id: 'sk_11', lang: 'sk', group: 'Slovensko', url: 'https://fontech.startitup.sk/feed/', name: 'FonTech.sk', defaultCats: ['tech'] },
  { id: 'sk_12', lang: 'sk', group: 'Slovensko', url: 'https://tvnoviny.sk/rss', name: 'TVNoviny.sk', defaultCats: ['domov'] },
  { id: 'sk_13', lang: 'sk', group: 'Slovensko', url: 'https://www.topky.sk/rss/topky.xml', name: 'Topky.sk', defaultCats: ['domov'] },
  { id: 'sk_14', lang: 'sk', group: 'Slovensko', url: 'https://www.cas.sk/rss/', name: 'Nový Čas', defaultCats: ['domov'] },
  { id: 'sk_15', lang: 'sk', group: 'Slovensko', url: 'https://plus7dni.pluska.sk/rss', name: 'Pluska.sk', defaultCats: ['domov'] },
  { id: 'sk_16', lang: 'sk', group: 'Slovensko', url: 'https://refresher.sk/rss', name: 'Refresher.sk', defaultCats: ['kultura'] },
  { id: 'sk_17', lang: 'sk', group: 'Slovensko', url: 'https://www.webnoviny.sk/feed/', name: 'Webnoviny.sk', defaultCats: ['domov'] },
  { id: 'sk_18', lang: 'sk', group: 'Slovensko', url: 'https://www.dobrenoviny.sk/rss', name: 'Dobré Noviny', defaultCats: ['domov'] },
  { id: 'sk_19', lang: 'sk', group: 'Slovensko', url: 'https://www.interez.sk/feed/', name: 'Interez.sk', defaultCats: ['zdravie', 'kultura'] },
  { id: 'sk_20', lang: 'sk', group: 'Slovensko', url: 'https://www.banoviny.sk/rss', name: 'Bratislavské Noviny', defaultCats: ['domov'] },
  { id: 'sk_21', lang: 'sk', group: 'Slovensko', url: 'https://sport.aktuality.sk/rss/', name: 'Šport.sk', defaultCats: ['sport'] },
  { id: 'sk_22', lang: 'sk', group: 'Slovensko', url: 'https://sportky.zoznam.sk/rss/vsetko', name: 'Športky.sk', defaultCats: ['sport'] },
  { id: 'sk_23', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smeonline', name: 'SME.sk', defaultCats: ['domov'] },
  { id: 'sk_24', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=index', name: 'INDEX SME', defaultCats: ['ekonomika'] },
  { id: 'sk_25', lang: 'sk', group: 'Slovensko', url: 'https://touchit.sk/feed', name: 'TOUCHIT', defaultCats: ['tech'] },
  { id: 'sk_26', lang: 'sk', group: 'Slovensko', url: 'https://www.mojandroid.sk/feed/', name: 'MojAndroid.sk', defaultCats: ['tech'] },
  { id: 'sk_27', lang: 'sk', group: 'Slovensko', url: 'https://www.mojelektromobil.sk/feed/', name: 'MôjElektromobil', defaultCats: ['auto', 'tech'] },
  { id: 'sk_28', lang: 'sk', group: 'Slovensko', url: 'https://autozurnal.com/feed', name: 'Autožurnál', defaultCats: ['auto'] },
  { id: 'sk_29', lang: 'sk', group: 'Slovensko', url: 'https://www.podnikajte.sk/rss', name: 'Podnikajte.sk', defaultCats: ['ekonomika'] },
  { id: 'sk_30', lang: 'sk', group: 'Slovensko', url: 'https://hnonline.sk/finweb/feed', name: 'FinWeb HN', defaultCats: ['ekonomika'] },
  { id: 'sk_31', lang: 'sk', group: 'Slovensko', url: 'https://standard.sk/feed', name: 'Štandard', defaultCats: ['domov'] },
  { id: 'sk_32', lang: 'sk', group: 'Slovensko', url: 'https://euractiv.sk/feed/', name: 'Euractiv SK', defaultCats: ['svet', 'domov'] },
  { id: 'sk_33', lang: 'sk', group: 'Slovensko', url: 'https://www.parlamentnelisty.sk/feed/', name: 'Parlamentné Listy', defaultCats: ['domov'] },
  { id: 'sk_34', lang: 'sk', group: 'Slovensko', url: 'https://vosveteit.zoznam.sk/feed/', name: 'Vo Svete IT', defaultCats: ['tech'] },
  { id: 'sk_35', lang: 'sk', group: 'Slovensko', url: 'https://techbox.dennikn.sk/feed/', name: 'TECHBOX', defaultCats: ['tech'] },
  { id: 'sk_36', lang: 'sk', group: 'Slovensko', url: 'https://www.zdravie.sk/rss', name: 'Zdravie.sk', defaultCats: ['zdravie'] },
  { id: 'sk_37', lang: 'sk', group: 'Slovensko', url: 'https://dalito.sk/feed/', name: 'Dalito.sk', defaultCats: ['kultura', 'domov'] },
  { id: 'sk_38', lang: 'sk', group: 'Slovensko', url: 'https://www.bleskovky.sk/rss', name: 'Bleskovky.sk', defaultCats: ['domov'] },
  { id: 'sk_39', lang: 'sk', group: 'Slovensko', url: 'https://noizz.aktuality.sk/rss/', name: 'Noizz.sk', defaultCats: ['kultura'] },
  { id: 'sk_40', lang: 'sk', group: 'Slovensko', url: 'https://www.rimava.sk/feed/', name: 'Rimava.sk', defaultCats: ['domov'] },
  { id: 'sk_41', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smedomov', name: 'SME Domov', defaultCats: ['domov'] },
  { id: 'sk_42', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smesvet', name: 'SME Svet', defaultCats: ['svet'] },
  { id: 'sk_43', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smesport', name: 'SME Šport', defaultCats: ['sport'] },
  { id: 'sk_44', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smekult', name: 'SME Kultúra', defaultCats: ['kultura'] },
  { id: 'sk_45', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smeauto', name: 'SME Auto', defaultCats: ['auto'] },
  { id: 'sk_46', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=smetech', name: 'SME Tech & Veda', defaultCats: ['tech'] },
  { id: 'sk_47', lang: 'sk', group: 'Slovensko', url: 'https://rss.sme.sk/rss/rss.asp?sek=regiony', name: 'SME Regióny', defaultCats: ['domov'] },
  { id: 'sk_48', lang: 'sk', group: 'Slovensko', url: 'https://ekonomika.pravda.sk/rss/xml/', name: 'Pravda Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'sk_49', lang: 'sk', group: 'Slovensko', url: 'https://sport.pravda.sk/rss/xml/', name: 'Pravda Šport', defaultCats: ['sport'] },
  { id: 'sk_50', lang: 'sk', group: 'Slovensko', url: 'https://kultura.pravda.sk/rss/xml/', name: 'Pravda Kultúra', defaultCats: ['kultura'] },
  { id: 'sk_51', lang: 'sk', group: 'Slovensko', url: 'https://auto.pravda.sk/rss/xml/', name: 'Pravda Auto', defaultCats: ['auto'] },
  { id: 'sk_52', lang: 'sk', group: 'Slovensko', url: 'https://zdravie.pravda.sk/rss/xml/', name: 'Pravda Zdravie', defaultCats: ['zdravie'] },
  { id: 'sk_53', lang: 'sk', group: 'Slovensko', url: 'https://www.aktuality.sk/rss/zahranicne/', name: 'Aktuality Svet', defaultCats: ['svet'] },
  { id: 'sk_54', lang: 'sk', group: 'Slovensko', url: 'https://www.aktuality.sk/rss/ekonomika/', name: 'Aktuality Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'sk_55', lang: 'sk', group: 'Slovensko', url: 'https://www.aktuality.sk/rss/kultura/', name: 'Aktuality Kultúra', defaultCats: ['kultura'] },
  { id: 'sk_56', lang: 'sk', group: 'Slovensko', url: 'https://dennikn.sk/tema/ekonomika/feed/', name: 'Denník N Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'sk_57', lang: 'sk', group: 'Slovensko', url: 'https://dennikn.sk/tema/svet/feed/', name: 'Denník N Svet', defaultCats: ['svet'] },
  { id: 'sk_58', lang: 'sk', group: 'Slovensko', url: 'https://dennikn.sk/tema/kultura/feed/', name: 'Denník N Kultúra', defaultCats: ['kultura'] },
  { id: 'sk_59', lang: 'sk', group: 'Slovensko', url: 'https://dennikn.sk/tema/veda/feed/', name: 'Denník N Veda', defaultCats: ['tech'] },
  { id: 'sk_60', lang: 'sk', group: 'Slovensko', url: 'https://hnonline.sk/svet/feed', name: 'HN Svet', defaultCats: ['svet'] },
  { id: 'sk_61', lang: 'sk', group: 'Slovensko', url: 'https://hnonline.sk/auto/feed', name: 'HN Auto', defaultCats: ['auto'] },
  { id: 'sk_62', lang: 'sk', group: 'Slovensko', url: 'https://hnonline.sk/science/feed', name: 'HN Science', defaultCats: ['tech'] },
  { id: 'sk_63', lang: 'sk', group: 'Slovensko', url: 'https://hnonline.sk/style/feed', name: 'HN Style', defaultCats: ['kultura', 'zdravie'] },
  { id: 'sk_64', lang: 'sk', group: 'Slovensko', url: 'https://www.ta3.com/rss/ekonomika', name: 'TA3 Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'sk_65', lang: 'sk', group: 'Slovensko', url: 'https://www.ta3.com/rss/zahranicie', name: 'TA3 Zahraničie', defaultCats: ['svet'] },
  { id: 'sk_66', lang: 'sk', group: 'Slovensko', url: 'https://www.ta3.com/rss/sport', name: 'TA3 Šport', defaultCats: ['sport'] },
  { id: 'sk_67', lang: 'sk', group: 'Slovensko', url: 'https://www.teraz.sk/rss/slovensko.rss', name: 'Teraz.sk Slovensko', defaultCats: ['domov'] },
  { id: 'sk_68', lang: 'sk', group: 'Slovensko', url: 'https://www.teraz.sk/rss/zahranicie.rss', name: 'Teraz.sk Zahraničie', defaultCats: ['svet'] },
  { id: 'sk_69', lang: 'sk', group: 'Slovensko', url: 'https://www.teraz.sk/rss/ekonomika.rss', name: 'Teraz.sk Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'sk_70', lang: 'sk', group: 'Slovensko', url: 'https://www.teraz.sk/rss/sport.rss', name: 'Teraz.sk Šport', defaultCats: ['sport'] },
  { id: 'sk_71', lang: 'sk', group: 'Slovensko', url: 'https://www.teraz.sk/rss/kultura.rss', name: 'Teraz.sk Kultúra', defaultCats: ['kultura'] },
  { id: 'sk_72', lang: 'sk', group: 'Slovensko', url: 'https://www.noviny.sk/rss', name: 'Noviny.sk TV JOJ', defaultCats: ['domov'] },
  { id: 'sk_73', lang: 'sk', group: 'Slovensko', url: 'https://krimi.noviny.sk/rss', name: 'Noviny.sk Krimi', defaultCats: ['krimi'] },
  { id: 'sk_74', lang: 'sk', group: 'Slovensko', url: 'https://sport.noviny.sk/rss', name: 'Noviny.sk Šport', defaultCats: ['sport'] },
  { id: 'sk_75', lang: 'sk', group: 'Slovensko', url: 'https://www.kosiceonline.sk/rss.xml', name: 'Košice Online', defaultCats: ['domov'] },
  { id: 'sk_76', lang: 'sk', group: 'Slovensko', url: 'https://bbonline.sk/feed/', name: 'BBonline Banská Bystrica', defaultCats: ['domov'] },
  { id: 'sk_77', lang: 'sk', group: 'Slovensko', url: 'https://www.trnavskyhlas.sk/rss/', name: 'Trnavský Hlas', defaultCats: ['domov'] },
  { id: 'sk_78', lang: 'sk', group: 'Slovensko', url: 'https://www.nitralive.sk/feed/', name: 'Nitralive.sk', defaultCats: ['domov'] },
  { id: 'sk_79', lang: 'sk', group: 'Slovensko', url: 'https://www.zilinak.sk/rss', name: 'Žilinak.sk', defaultCats: ['domov'] },
  { id: 'sk_80', lang: 'sk', group: 'Slovensko', url: 'https://www.trencinak.sk/rss', name: 'Trenčínak.sk', defaultCats: ['domov'] },
  { id: 'sk_81', lang: 'sk', group: 'Slovensko', url: 'https://www.bystricoviny.sk/feed/', name: 'Bystricoviny.sk', defaultCats: ['domov'] },
  { id: 'sk_82', lang: 'sk', group: 'Slovensko', url: 'https://www.presovak.sk/rss', name: 'Prešovak.sk', defaultCats: ['domov'] },
  { id: 'sk_83', lang: 'sk', group: 'Slovensko', url: 'https://www.bratislavak.sk/rss', name: 'Bratislavak.sk', defaultCats: ['domov'] },
  { id: 'sk_84', lang: 'sk', group: 'Slovensko', url: 'https://www.dnes24.sk/rss', name: 'Dnes24.sk', defaultCats: ['domov'] },
  { id: 'sk_85', lang: 'sk', group: 'Slovensko', url: 'https://www.zoznam.sk/rss/vsetko.xml', name: 'Zoznam.sk Spravodajstvo', defaultCats: ['domov'] },
  { id: 'sk_86', lang: 'sk', group: 'Slovensko', url: 'https://openiazoch.zoznam.sk/rss/', name: 'O peniazoch Zoznam', defaultCats: ['ekonomika'] },
  { id: 'sk_87', lang: 'sk', group: 'Slovensko', url: 'https://www.peniaze.sk/rss/', name: 'Peniaze.sk', defaultCats: ['ekonomika'] },
  { id: 'sk_88', lang: 'sk', group: 'Slovensko', url: 'https://kryptomagazin.sk/feed/', name: 'Kryptomagazín SK', defaultCats: ['ekonomika', 'tech'] },
  { id: 'sk_89', lang: 'sk', group: 'Slovensko', url: 'https://www.nextech.sk/rss', name: 'Nextech Magazín', defaultCats: ['tech'] },
  { id: 'sk_90', lang: 'sk', group: 'Slovensko', url: 'https://www.itnews.sk/feed/', name: 'IT News Slovensko', defaultCats: ['tech'] },
  { id: 'sk_91', lang: 'sk', group: 'Slovensko', url: 'https://www.sector.sk/rss/rss.xml', name: 'Sector.sk Hry & Tech', defaultCats: ['tech', 'kultura'] },
  { id: 'sk_92', lang: 'sk', group: 'Slovensko', url: 'https://www.gamesite.sk/feed/', name: 'Gamesite.sk', defaultCats: ['tech', 'kultura'] },
  { id: 'sk_93', lang: 'sk', group: 'Slovensko', url: 'https://rewind.sk/feed/', name: 'Rewind.sk Filmy & Popkultúra', defaultCats: ['kultura'] },
  { id: 'sk_94', lang: 'sk', group: 'Slovensko', url: 'https://www.kinema.sk/rss/kinema.xml', name: 'Kinema.sk Film', defaultCats: ['kultura'] },
  { id: 'sk_95', lang: 'sk', group: 'Slovensko', url: 'https://hudba.zoznam.sk/rss/vsetko/', name: 'Hudba.sk', defaultCats: ['kultura'] },
  { id: 'sk_96', lang: 'sk', group: 'Slovensko', url: 'https://vedanadosah.cvtisr.sk/feed/', name: 'Veda na dosah CVTI', defaultCats: ['tech', 'zdravie'] },
  { id: 'sk_97', lang: 'sk', group: 'Slovensko', url: 'https://fontech.startitup.sk/kategoria/ai/feed/', name: 'FonTech AI & Veda', defaultCats: ['tech'] },
  { id: 'sk_98', lang: 'sk', group: 'Slovensko', url: 'https://www.postoj.sk/rss/nazory', name: 'Postoj Názory & Komentáre', defaultCats: ['domov'] },
  { id: 'sk_99', lang: 'sk', group: 'Slovensko', url: 'https://magazin.profesia.sk/feed/', name: 'Profesia Kariéra & Biznis', defaultCats: ['ekonomika'] },
  { id: 'sk_100', lang: 'sk', group: 'Slovensko', url: 'https://poprad.dnes24.sk/rss', name: 'Dnes24 Poprad & Tatry', defaultCats: ['domov'] },

  { id: 'cz_1', lang: 'cz', group: 'Česko', url: 'https://ct24.ceskatelevize.cz/rss/hlavni-zpravy', name: 'ČT24', defaultCats: ['svet'] },
  { id: 'cz_2', lang: 'cz', group: 'Česko', url: 'https://www.irozhlas.cz/rss/irozhlas', name: 'iROZHLAS.cz', defaultCats: ['svet'] },
  { id: 'cz_3', lang: 'cz', group: 'Česko', url: 'https://www.seznamzpravy.cz/rss', name: 'Seznam Zprávy', defaultCats: ['svet'] },
  { id: 'cz_4', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss', name: 'Novinky.cz', defaultCats: ['svet'] },
  { id: 'cz_5', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=zpravodaj', name: 'iDNES.cz', defaultCats: ['svet'] },
  { id: 'cz_6', lang: 'cz', group: 'Česko', url: 'https://vyber.aktualne.cz/rss/', name: 'Aktuálně.cz', defaultCats: ['svet'] },
  { id: 'cz_7', lang: 'cz', group: 'Česko', url: 'https://servis.lidovky.cz/rss.aspx?c=ln_domov', name: 'Lidovky.cz', defaultCats: ['svet'] },
  { id: 'cz_8', lang: 'cz', group: 'Česko', url: 'https://denikn.cz/feed/', name: 'Deník N (CZ)', defaultCats: ['svet'] },
  { id: 'cz_9', lang: 'cz', group: 'Česko', url: 'https://www.denik.cz/rss/z-domova.html', name: 'Deník.cz', defaultCats: ['svet'] },
  { id: 'cz_10', lang: 'cz', group: 'Česko', url: 'https://www.respekt.cz/feed', name: 'Respekt.cz', defaultCats: ['svet'] },
  { id: 'cz_11', lang: 'cz', group: 'Česko', url: 'https://www.reflex.cz/rss', name: 'Reflex.cz', defaultCats: ['kultura'] },
  { id: 'cz_12', lang: 'cz', group: 'Česko', url: 'https://www.e15.cz/rss', name: 'E15.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_13', lang: 'cz', group: 'Česko', url: 'https://echo24.cz/rss', name: 'Echo24.cz', defaultCats: ['svet'] },
  { id: 'cz_14', lang: 'cz', group: 'Česko', url: 'https://forbes.cz/feed/', name: 'Forbes CZ', defaultCats: ['ekonomika'] },
  { id: 'cz_15', lang: 'cz', group: 'Česko', url: 'https://www.zive.cz/rss/sc-47/', name: 'Živě.cz', defaultCats: ['tech'] },
  { id: 'cz_16', lang: 'cz', group: 'Česko', url: 'https://www.lupa.cz/rss/clanky/', name: 'Lupa.cz', defaultCats: ['tech'] },
  { id: 'cz_17', lang: 'cz', group: 'Česko', url: 'https://www.root.cz/rss/clanky/', name: 'Root.cz', defaultCats: ['tech'] },
  { id: 'cz_18', lang: 'cz', group: 'Česko', url: 'https://www.blesk.cz/rss', name: 'Blesk.cz', defaultCats: ['kultura'] },
  { id: 'cz_19', lang: 'cz', group: 'Česko', url: 'https://servis.metro.cz/rss.aspx?c=metro_domov', name: 'Metro.cz', defaultCats: ['svet'] },
  { id: 'cz_20', lang: 'cz', group: 'Česko', url: 'https://www.info.cz/rss', name: 'Info.cz', defaultCats: ['svet'] },
  { id: 'cz_21', lang: 'cz', group: 'Česko', url: 'https://isport.blesk.cz/rss', name: 'iSport.cz', defaultCats: ['sport'] },
  { id: 'cz_22', lang: 'cz', group: 'Česko', url: 'https://www.sport.cz/rss', name: 'Sport.cz', defaultCats: ['sport'] },
  { id: 'cz_23', lang: 'cz', group: 'Česko', url: 'https://cc.cz/feed/', name: 'CzechCrunch', defaultCats: ['tech', 'ekonomika'] },
  { id: 'cz_24', lang: 'cz', group: 'Česko', url: 'https://www.mobilmania.cz/rss/sc-47/', name: 'MobilMania.cz', defaultCats: ['tech'] },
  { id: 'cz_25', lang: 'cz', group: 'Česko', url: 'https://www.auto.cz/rss', name: 'Auto.cz', defaultCats: ['auto'] },
  { id: 'cz_26', lang: 'cz', group: 'Česko', url: 'https://www.garaz.cz/rss', name: 'Garáž.cz', defaultCats: ['auto'] },
  { id: 'cz_27', lang: 'cz', group: 'Česko', url: 'https://www.kurzy.cz/rss/zpravy/', name: 'Kurzy.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_28', lang: 'cz', group: 'Česko', url: 'https://www.penize.cz/rss/rubrika/vsechny-clanky', name: 'Peníze.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_29', lang: 'cz', group: 'Česko', url: 'https://www.cnews.cz/feed/', name: 'Cnews.cz', defaultCats: ['tech'] },
  { id: 'cz_30', lang: 'cz', group: 'Česko', url: 'https://www.itbiz.cz/rss/vsechno', name: 'ITBiz.cz', defaultCats: ['tech'] },
  { id: 'cz_31', lang: 'cz', group: 'Česko', url: 'https://www.parlamentnilisty.cz/rss', name: 'ParlamentníListy.cz', defaultCats: ['svet'] },
  { id: 'cz_32', lang: 'cz', group: 'Česko', url: 'https://neovlivni.cz/feed/', name: 'Neovlivní.cz', defaultCats: ['svet'] },
  { id: 'cz_33', lang: 'cz', group: 'Česko', url: 'https://denikreferendum.cz/rss', name: 'Deník Referendum', defaultCats: ['svet'] },
  { id: 'cz_34', lang: 'cz', group: 'Česko', url: 'https://a2larm.cz/feed/', name: 'A2larm', defaultCats: ['kultura', 'svet'] },
  { id: 'cz_35', lang: 'cz', group: 'Česko', url: 'https://www.mediar.cz/feed/', name: 'Médiář', defaultCats: ['kultura'] },
  { id: 'cz_36', lang: 'cz', group: 'Česko', url: 'https://www.patria.cz/rss/default.aspx', name: 'Patria.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_37', lang: 'cz', group: 'Česko', url: 'https://www.podnikatel.cz/rss/clanky/', name: 'Podnikatel.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_38', lang: 'cz', group: 'Česko', url: 'https://vtm.zive.cz/rss/sc-47/', name: 'VTM.cz', defaultCats: ['tech'] },
  { id: 'cz_39', lang: 'cz', group: 'Česko', url: 'https://www.svetandroida.cz/feed/', name: 'Svět Androida', defaultCats: ['tech'] },
  { id: 'cz_40', lang: 'cz', group: 'Česko', url: 'https://fzone.cz/rss', name: 'fZone.cz', defaultCats: ['tech'] },
  { id: 'cz_41', lang: 'cz', group: 'Česko', url: 'https://cnn.iprima.cz/rss', name: 'CNN Prima NEWS', defaultCats: ['svet'] },
  { id: 'cz_42', lang: 'cz', group: 'Česko', url: 'https://www.forum24.cz/feed', name: 'Forum 24', defaultCats: ['svet'] },
  { id: 'cz_43', lang: 'cz', group: 'Česko', url: 'https://ct24.ceskatelevize.cz/rss/zahranici', name: 'ČT24 Zahraničí', defaultCats: ['svet'] },
  { id: 'cz_44', lang: 'cz', group: 'Česko', url: 'https://ct24.ceskatelevize.cz/rss/ekonomika', name: 'ČT24 Byznys', defaultCats: ['ekonomika'] },
  { id: 'cz_45', lang: 'cz', group: 'Česko', url: 'https://ct24.ceskatelevize.cz/rss/veda', name: 'ČT24 Věda', defaultCats: ['tech'] },
  { id: 'cz_46', lang: 'cz', group: 'Česko', url: 'https://ct24.ceskatelevize.cz/rss/kultura', name: 'ČT24 Kultura', defaultCats: ['kultura'] },
  { id: 'cz_47', lang: 'cz', group: 'Česko', url: 'https://sport.ceskatelevize.cz/rss/hlavni-zpravy', name: 'ČT Sport', defaultCats: ['sport'] },
  { id: 'cz_48', lang: 'cz', group: 'Česko', url: 'https://www.irozhlas.cz/rss/irozhlas/sekce/zahranici', name: 'iROZHLAS Svět', defaultCats: ['svet'] },
  { id: 'cz_49', lang: 'cz', group: 'Česko', url: 'https://www.irozhlas.cz/rss/irozhlas/sekce/ekonomika', name: 'iROZHLAS Byznys', defaultCats: ['ekonomika'] },
  { id: 'cz_50', lang: 'cz', group: 'Česko', url: 'https://www.irozhlas.cz/rss/irozhlas/sekce/sport', name: 'iROZHLAS Sport', defaultCats: ['sport'] },
  { id: 'cz_51', lang: 'cz', group: 'Česko', url: 'https://www.irozhlas.cz/rss/irozhlas/sekce/kultura', name: 'iROZHLAS Kultura', defaultCats: ['kultura'] },
  { id: 'cz_52', lang: 'cz', group: 'Česko', url: 'https://www.irozhlas.cz/rss/irozhlas/sekce/zivotni-styl', name: 'iROZHLAS Životní styl', defaultCats: ['zdravie', 'kultura'] },
  { id: 'cz_53', lang: 'cz', group: 'Česko', url: 'https://www.seznamzpravy.cz/rss/byznys', name: 'Seznam Byznys', defaultCats: ['ekonomika'] },
  { id: 'cz_54', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss/ekonomika', name: 'Novinky Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'cz_55', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss/krimi', name: 'Novinky Krimi', defaultCats: ['krimi'] },
  { id: 'cz_56', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss/zahranicni', name: 'Novinky Zahraničí', defaultCats: ['svet'] },
  { id: 'cz_57', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss/auto-moto', name: 'Novinky Auto', defaultCats: ['auto'] },
  { id: 'cz_58', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss/veda-skoly', name: 'Novinky Věda & Tech', defaultCats: ['tech'] },
  { id: 'cz_59', lang: 'cz', group: 'Česko', url: 'https://www.novinky.cz/rss/kultura', name: 'Novinky Kultura', defaultCats: ['kultura'] },
  { id: 'cz_60', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=ekonomika', name: 'iDNES Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'cz_61', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=zahranicni', name: 'iDNES Zahraničí', defaultCats: ['svet'] },
  { id: 'cz_62', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=krimi', name: 'iDNES Krimi', defaultCats: ['krimi'] },
  { id: 'cz_63', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=auto', name: 'iDNES Auto', defaultCats: ['auto'] },
  { id: 'cz_64', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=technet', name: 'iDNES Technet', defaultCats: ['tech'] },
  { id: 'cz_65', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=kultura', name: 'iDNES Kultura', defaultCats: ['kultura'] },
  { id: 'cz_66', lang: 'cz', group: 'Česko', url: 'https://servis.idnes.cz/rss.aspx?c=sport', name: 'iDNES Sport', defaultCats: ['sport'] },
  { id: 'cz_67', lang: 'cz', group: 'Česko', url: 'https://vyber.aktualne.cz/rss/?r=ekonomika', name: 'Aktuálně Byznys', defaultCats: ['ekonomika'] },
  { id: 'cz_68', lang: 'cz', group: 'Česko', url: 'https://vyber.aktualne.cz/rss/?r=zahranici', name: 'Aktuálně Svět', defaultCats: ['svet'] },
  { id: 'cz_69', lang: 'cz', group: 'Česko', url: 'https://vyber.aktualne.cz/rss/?r=auto', name: 'Aktuálně Auto', defaultCats: ['auto'] },
  { id: 'cz_70', lang: 'cz', group: 'Česko', url: 'https://servis.lidovky.cz/rss.aspx?c=ln_byznys', name: 'Lidovky Byznys', defaultCats: ['ekonomika'] },
  { id: 'cz_71', lang: 'cz', group: 'Česko', url: 'https://servis.lidovky.cz/rss.aspx?c=ln_zahranici', name: 'Lidovky Svět', defaultCats: ['svet'] },
  { id: 'cz_72', lang: 'cz', group: 'Česko', url: 'https://servis.lidovky.cz/rss.aspx?c=ln_kultura', name: 'Lidovky Kultura', defaultCats: ['kultura'] },
  { id: 'cz_73', lang: 'cz', group: 'Česko', url: 'https://www.denik.cz/rss/ze-sveta.html', name: 'Deník.cz Svět', defaultCats: ['svet'] },
  { id: 'cz_74', lang: 'cz', group: 'Česko', url: 'https://www.denik.cz/rss/ekonomika.html', name: 'Deník.cz Ekonomika', defaultCats: ['ekonomika'] },
  { id: 'cz_75', lang: 'cz', group: 'Česko', url: 'https://www.denik.cz/rss/auto.html', name: 'Deník.cz Auto', defaultCats: ['auto'] },
  { id: 'cz_76', lang: 'cz', group: 'Česko', url: 'https://www.denik.cz/rss/sport.html', name: 'Deník.cz Sport', defaultCats: ['sport'] },
  { id: 'cz_77', lang: 'cz', group: 'Česko', url: 'https://www.denik.cz/rss/krimi.html', name: 'Deník.cz Krimi', defaultCats: ['krimi'] },
  { id: 'cz_78', lang: 'cz', group: 'Česko', url: 'https://www.hrot24.cz/rss', name: 'Hrot24.cz', defaultCats: ['ekonomika', 'svet'] },
  { id: 'cz_79', lang: 'cz', group: 'Česko', url: 'https://www.newstream.cz/rss', name: 'Newstream.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_80', lang: 'cz', group: 'Česko', url: 'https://finmag.penize.cz/rss', name: 'Finmag.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_81', lang: 'cz', group: 'Česko', url: 'https://www.mesec.cz/rss/clanky/', name: 'Měšec.cz', defaultCats: ['ekonomika'] },
  { id: 'cz_82', lang: 'cz', group: 'Česko', url: 'https://www.autorevue.cz/rss/sc-47/', name: 'Autorevue.cz', defaultCats: ['auto'] },
  { id: 'cz_83', lang: 'cz', group: 'Česko', url: 'https://www.autoforum.cz/rss/', name: 'Autoforum.cz', defaultCats: ['auto'] },
  { id: 'cz_84', lang: 'cz', group: 'Česko', url: 'https://www.hybrid.cz/feed/', name: 'Hybrid.cz', defaultCats: ['auto', 'tech'] },
  { id: 'cz_85', lang: 'cz', group: 'Česko', url: 'https://fdrive.cz/rss', name: 'fDrive.cz', defaultCats: ['auto', 'tech'] },
  { id: 'cz_86', lang: 'cz', group: 'Česko', url: 'https://www.motorkari.cz/rss/clanky.php', name: 'Motorkáři.cz', defaultCats: ['auto', 'sport'] },
  { id: 'cz_87', lang: 'cz', group: 'Česko', url: 'https://www.letemsvetemapplem.eu/feed/', name: 'Letem světem Applem', defaultCats: ['tech'] },
  { id: 'cz_88', lang: 'cz', group: 'Česko', url: 'https://jablickar.cz/feed/', name: 'Jablíčkář.cz', defaultCats: ['tech'] },
  { id: 'cz_89', lang: 'cz', group: 'Česko', url: 'https://www.vortex.cz/feed/', name: 'Vortex.cz', defaultCats: ['tech', 'kultura'] },
  { id: 'cz_90', lang: 'cz', group: 'Česko', url: 'https://hrej.cz/rss', name: 'Hrej.cz', defaultCats: ['tech', 'kultura'] },
  { id: 'cz_91', lang: 'cz', group: 'Česko', url: 'https://games.tiscali.cz/rss', name: 'Games.cz', defaultCats: ['tech', 'kultura'] },
  { id: 'cz_92', lang: 'cz', group: 'Česko', url: 'https://www.kinobox.cz/rss', name: 'Kinobox.cz', defaultCats: ['kultura'] },
  { id: 'cz_93', lang: 'cz', group: 'Česko', url: 'https://www.totalfilm.cz/feed/', name: 'Totalfilm.cz', defaultCats: ['kultura'] },
  { id: 'cz_94', lang: 'cz', group: 'Česko', url: 'https://musicserver.cz/rss/', name: 'Musicserver.cz', defaultCats: ['kultura'] },
  { id: 'cz_95', lang: 'cz', group: 'Česko', url: 'https://prazska.drbna.cz/rss', name: 'Pražská Drbna', defaultCats: ['svet'] },
  { id: 'cz_96', lang: 'cz', group: 'Česko', url: 'https://brnenska.drbna.cz/rss', name: 'Brněnská Drbna', defaultCats: ['svet'] },
  { id: 'cz_97', lang: 'cz', group: 'Česko', url: 'https://www.ctidoma.cz/rss.xml', name: 'ČtiDoma.cz', defaultCats: ['svet'] },
  { id: 'cz_98', lang: 'cz', group: 'Česko', url: 'https://www.prahain.cz/rss', name: 'PrahaIN.cz', defaultCats: ['svet'] },
  { id: 'cz_99', lang: 'cz', group: 'Česko', url: 'https://www.pozary.cz/rss/', name: 'Požáry.cz Krimi', defaultCats: ['krimi'] },
  { id: 'cz_100', lang: 'cz', group: 'Česko', url: 'https://www.vitalia.cz/rss/clanky/', name: 'Vitalia.cz Zdraví', defaultCats: ['zdravie'] },

  { id: 'en_1', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC News', defaultCats: ['svet'] },
  { id: 'en_2', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theguardian.com/world/rss', name: 'The Guardian', defaultCats: ['svet'] },
  { id: 'en_3', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'New York Times', defaultCats: ['svet'] },
  { id: 'en_4', lang: 'en', group: 'Svetové (EN)', url: 'http://rss.cnn.com/rss/edition_world.rss', name: 'CNN', defaultCats: ['svet'] },
  { id: 'en_5', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.npr.org/1004/rss.xml', name: 'NPR', defaultCats: ['svet'] },
  { id: 'en_6', lang: 'en', group: 'Svetové (EN)', url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera', defaultCats: ['svet'] },
  { id: 'en_7', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.dw.com/rdf/rss-en-all', name: 'Deutsche Welle', defaultCats: ['svet'] },
  { id: 'en_8', lang: 'en', group: 'Svetové (EN)', url: 'https://www.france24.com/en/rss', name: 'France 24', defaultCats: ['svet'] },
  { id: 'en_9', lang: 'en', group: 'Svetové (EN)', url: 'https://www.euronews.com/rss', name: 'Euronews', defaultCats: ['svet'] },
  { id: 'en_10', lang: 'en', group: 'Svetové (EN)', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', name: 'CNBC', defaultCats: ['ekonomika', 'svet'] },
  { id: 'en_11', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', name: 'Wall Street Journal', defaultCats: ['ekonomika', 'svet'] },
  { id: 'en_12', lang: 'en', group: 'Svetové (EN)', url: 'https://www.ft.com/rss/home', name: 'Financial Times', defaultCats: ['ekonomika', 'svet'] },
  { id: 'en_13', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.politico.com/politics-news.xml', name: 'Politico', defaultCats: ['svet'] },
  { id: 'en_14', lang: 'en', group: 'Svetové (EN)', url: 'https://time.com/feed/', name: 'TIME', defaultCats: ['svet'] },
  { id: 'en_15', lang: 'en', group: 'Svetové (EN)', url: 'https://techcrunch.com/feed/', name: 'TechCrunch', defaultCats: ['tech'] },
  { id: 'en_16', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', defaultCats: ['tech'] },
  { id: 'en_17', lang: 'en', group: 'Svetové (EN)', url: 'https://www.wired.com/feed/rss', name: 'Wired', defaultCats: ['tech'] },
  { id: 'en_18', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica', defaultCats: ['tech'] },
  { id: 'en_19', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.skynews.com/feeds/rss/world.xml', name: 'Sky News', defaultCats: ['svet'] },
  { id: 'en_20', lang: 'en', group: 'Svetové (EN)', url: 'https://www.independent.co.uk/news/world/rss', name: 'The Independent', defaultCats: ['svet'] },
  { id: 'en_21', lang: 'en', group: 'Svetové (EN)', url: 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best', name: 'Reuters', defaultCats: ['svet'] },
  { id: 'en_22', lang: 'en', group: 'Svetové (EN)', url: 'https://news.google.com/rss/search?q=site:apnews.com&hl=en-US&gl=US&ceid=US:en', name: 'AP News', defaultCats: ['svet'] },
  { id: 'en_23', lang: 'en', group: 'Svetové (EN)', url: 'https://news.google.com/rss/search?q=site:bloomberg.com&hl=en-US&gl=US&ceid=US:en', name: 'Bloomberg', defaultCats: ['ekonomika', 'svet'] },
  { id: 'en_24', lang: 'en', group: 'Svetové (EN)', url: 'https://www.forbes.com/business/feed/', name: 'Forbes US', defaultCats: ['ekonomika'] },
  { id: 'en_25', lang: 'en', group: 'Svetové (EN)', url: 'https://fortune.com/feed/', name: 'Fortune', defaultCats: ['ekonomika'] },
  { id: 'en_26', lang: 'en', group: 'Svetové (EN)', url: 'https://news.google.com/rss/search?q=site:economist.com&hl=en-US&gl=US&ceid=US:en', name: 'The Economist', defaultCats: ['ekonomika', 'svet'] },
  { id: 'en_27', lang: 'en', group: 'Svetové (EN)', url: 'https://www.businessinsider.com/rss', name: 'Business Insider', defaultCats: ['ekonomika', 'tech'] },
  { id: 'en_28', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories', name: 'MarketWatch', defaultCats: ['ekonomika'] },
  { id: 'en_29', lang: 'en', group: 'Svetové (EN)', url: 'https://www.engadget.com/rss.xml', name: 'Engadget', defaultCats: ['tech'] },
  { id: 'en_30', lang: 'en', group: 'Svetové (EN)', url: 'https://gizmodo.com/feed', name: 'Gizmodo', defaultCats: ['tech'] },
  { id: 'en_31', lang: 'en', group: 'Svetové (EN)', url: 'https://mashable.com/feeds/rss/all', name: 'Mashable', defaultCats: ['tech', 'kultura'] },
  { id: 'en_32', lang: 'en', group: 'Svetové (EN)', url: 'https://9to5mac.com/feed/', name: '9to5Mac', defaultCats: ['tech'] },
  { id: 'en_33', lang: 'en', group: 'Svetové (EN)', url: 'https://www.androidauthority.com/feed/', name: 'Android Authority', defaultCats: ['tech'] },
  { id: 'en_34', lang: 'en', group: 'Svetové (EN)', url: 'https://thenextweb.com/feed/', name: 'The Next Web', defaultCats: ['tech'] },
  { id: 'en_35', lang: 'en', group: 'Svetové (EN)', url: 'https://venturebeat.com/feed/', name: 'VentureBeat', defaultCats: ['tech', 'ekonomika'] },
  { id: 'en_36', lang: 'en', group: 'Svetové (EN)', url: 'https://news.google.com/rss/search?q=site:theathletic.com&hl=en-US&gl=US&ceid=US:en', name: 'The Athletic', defaultCats: ['sport'] },
  { id: 'en_37', lang: 'en', group: 'Svetové (EN)', url: 'https://www.espn.com/espn/rss/news', name: 'ESPN', defaultCats: ['sport'] },
  { id: 'en_38', lang: 'en', group: 'Svetové (EN)', url: 'https://news.google.com/rss/search?q=site:nationalgeographic.com&hl=en-US&gl=US&ceid=US:en', name: 'Nat Geo', defaultCats: ['kultura', 'svet'] },
  { id: 'en_39', lang: 'en', group: 'Svetové (EN)', url: 'https://www.newscientist.com/feed/home/', name: 'New Scientist', defaultCats: ['tech', 'zdravie'] },
  { id: 'en_40', lang: 'en', group: 'Svetové (EN)', url: 'https://www.nature.com/nature.rss', name: 'Nature', defaultCats: ['tech', 'zdravie'] },
  { id: 'en_41', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business', defaultCats: ['ekonomika'] },
  { id: 'en_42', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', name: 'BBC Tech', defaultCats: ['tech'] },
  { id: 'en_43', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', name: 'BBC Culture', defaultCats: ['kultura'] },
  { id: 'en_44', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', name: 'BBC Science', defaultCats: ['tech', 'zdravie'] },
  { id: 'en_45', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/news/health/rss.xml', name: 'BBC Health', defaultCats: ['zdravie'] },
  { id: 'en_46', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.bbci.co.uk/sport/rss.xml', name: 'BBC Sport', defaultCats: ['sport'] },
  { id: 'en_47', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theguardian.com/uk/business/rss', name: 'Guardian Business', defaultCats: ['ekonomika'] },
  { id: 'en_48', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theguardian.com/uk/technology/rss', name: 'Guardian Tech', defaultCats: ['tech'] },
  { id: 'en_49', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theguardian.com/uk/culture/rss', name: 'Guardian Culture', defaultCats: ['kultura'] },
  { id: 'en_50', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theguardian.com/uk/sport/rss', name: 'Guardian Sport', defaultCats: ['sport'] },
  { id: 'en_51', lang: 'en', group: 'Svetové (EN)', url: 'https://www.theguardian.com/environment/rss', name: 'Guardian Environment', defaultCats: ['tech', 'svet'] },
  { id: 'en_52', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', name: 'NYT Business', defaultCats: ['ekonomika'] },
  { id: 'en_53', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', name: 'NYT Tech', defaultCats: ['tech'] },
  { id: 'en_54', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml', name: 'NYT Science', defaultCats: ['tech', 'zdravie'] },
  { id: 'en_55', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', name: 'NYT Health', defaultCats: ['zdravie'] },
  { id: 'en_56', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml', name: 'NYT Arts', defaultCats: ['kultura'] },
  { id: 'en_57', lang: 'en', group: 'Svetové (EN)', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml', name: 'NYT Sports', defaultCats: ['sport'] },
  { id: 'en_58', lang: 'en', group: 'Svetové (EN)', url: 'http://rss.cnn.com/rss/money_latest.rss', name: 'CNN Business', defaultCats: ['ekonomika'] },
  { id: 'en_59', lang: 'en', group: 'Svetové (EN)', url: 'http://rss.cnn.com/rss/edition_technology.rss', name: 'CNN Tech', defaultCats: ['tech'] },
  { id: 'en_60', lang: 'en', group: 'Svetové (EN)', url: 'http://rss.cnn.com/rss/edition_entertainment.rss', name: 'CNN Entertainment', defaultCats: ['kultura'] },
  { id: 'en_61', lang: 'en', group: 'Svetové (EN)', url: 'http://rss.cnn.com/rss/edition_sport.rss', name: 'CNN Sport', defaultCats: ['sport'] },
  { id: 'en_62', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.npr.org/1006/rss.xml', name: 'NPR Business', defaultCats: ['ekonomika'] },
  { id: 'en_63', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.npr.org/1019/rss.xml', name: 'NPR Tech', defaultCats: ['tech'] },
  { id: 'en_64', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.npr.org/1007/rss.xml', name: 'NPR Science', defaultCats: ['tech'] },
  { id: 'en_65', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.npr.org/1008/rss.xml', name: 'NPR Culture', defaultCats: ['kultura'] },
  { id: 'en_66', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.npr.org/1128/rss.xml', name: 'NPR Health', defaultCats: ['zdravie'] },
  { id: 'en_67', lang: 'en', group: 'Svetové (EN)', url: 'https://www.politico.eu/feed/', name: 'Politico Europe', defaultCats: ['svet'] },
  { id: 'en_68', lang: 'en', group: 'Svetové (EN)', url: 'https://api.axios.com/feed/', name: 'Axios', defaultCats: ['svet', 'ekonomika'] },
  { id: 'en_69', lang: 'en', group: 'Svetové (EN)', url: 'https://finance.yahoo.com/news/rssindex', name: 'Yahoo Finance', defaultCats: ['ekonomika'] },
  { id: 'en_70', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', name: 'WSJ Markets', defaultCats: ['ekonomika'] },
  { id: 'en_71', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.a.dj.com/rss/RSSWSJD.xml', name: 'WSJ Tech', defaultCats: ['tech'] },
  { id: 'en_72', lang: 'en', group: 'Svetové (EN)', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', name: 'CNBC Tech', defaultCats: ['tech'] },
  { id: 'en_73', lang: 'en', group: 'Svetové (EN)', url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html', name: 'CNBC Economy', defaultCats: ['ekonomika'] },
  { id: 'en_74', lang: 'en', group: 'Svetové (EN)', url: 'https://variety.com/feed/', name: 'Variety', defaultCats: ['kultura'] },
  { id: 'en_75', lang: 'en', group: 'Svetové (EN)', url: 'https://www.hollywoodreporter.com/feed/', name: 'Hollywood Reporter', defaultCats: ['kultura'] },
  { id: 'en_76', lang: 'en', group: 'Svetové (EN)', url: 'https://www.rollingstone.com/feed/', name: 'Rolling Stone', defaultCats: ['kultura'] },
  { id: 'en_77', lang: 'en', group: 'Svetové (EN)', url: 'https://www.billboard.com/feed/', name: 'Billboard', defaultCats: ['kultura'] },
  { id: 'en_78', lang: 'en', group: 'Svetové (EN)', url: 'https://pitchfork.com/rss/news/', name: 'Pitchfork', defaultCats: ['kultura'] },
  { id: 'en_79', lang: 'en', group: 'Svetové (EN)', url: 'https://feeds.feedburner.com/ign/all', name: 'IGN', defaultCats: ['tech', 'kultura'] },
  { id: 'en_80', lang: 'en', group: 'Svetové (EN)', url: 'https://www.polygon.com/rss/index.xml', name: 'Polygon', defaultCats: ['tech', 'kultura'] },
  { id: 'en_81', lang: 'en', group: 'Svetové (EN)', url: 'https://kotaku.com/feed', name: 'Kotaku', defaultCats: ['tech', 'kultura'] },
  { id: 'en_82', lang: 'en', group: 'Svetové (EN)', url: 'https://www.eurogamer.net/feed', name: 'Eurogamer', defaultCats: ['tech', 'kultura'] },
  { id: 'en_83', lang: 'en', group: 'Svetové (EN)', url: 'https://www.pcgamer.com/rss/', name: 'PC Gamer', defaultCats: ['tech'] },
  { id: 'en_84', lang: 'en', group: 'Svetové (EN)', url: 'https://www.cnet.com/rss/news/', name: 'CNET', defaultCats: ['tech'] },
  { id: 'en_85', lang: 'en', group: 'Svetové (EN)', url: 'https://www.zdnet.com/news/rss.xml', name: 'ZDNet', defaultCats: ['tech'] },
  { id: 'en_86', lang: 'en', group: 'Svetové (EN)', url: 'https://www.tomshardware.com/feeds/all', name: "Tom's Hardware", defaultCats: ['tech'] },
  { id: 'en_87', lang: 'en', group: 'Svetové (EN)', url: 'https://www.bleepingcomputer.com/feed/', name: 'BleepingComputer', defaultCats: ['tech', 'krimi'] },
  { id: 'en_88', lang: 'en', group: 'Svetové (EN)', url: 'https://www.securityweek.com/feed/', name: 'SecurityWeek', defaultCats: ['tech', 'krimi'] },
  { id: 'en_89', lang: 'en', group: 'Svetové (EN)', url: 'https://www.caranddriver.com/rss/all.xml/', name: 'Car and Driver', defaultCats: ['auto'] },
  { id: 'en_90', lang: 'en', group: 'Svetové (EN)', url: 'https://www.motor1.com/rss/news/all/', name: 'Motor1', defaultCats: ['auto'] },
  { id: 'en_91', lang: 'en', group: 'Svetové (EN)', url: 'https://electrek.co/feed/', name: 'Electrek', defaultCats: ['auto', 'tech'] },
  { id: 'en_92', lang: 'en', group: 'Svetové (EN)', url: 'https://insideevs.com/rss/articles/all/', name: 'InsideEVs', defaultCats: ['auto', 'tech'] },
  { id: 'en_93', lang: 'en', group: 'Svetové (EN)', url: 'https://www.autoblog.com/rss.xml', name: 'Autoblog', defaultCats: ['auto'] },
  { id: 'en_94', lang: 'en', group: 'Svetové (EN)', url: 'https://news.google.com/rss/search?q=site:topgear.com&hl=en-US&gl=US&ceid=US:en', name: 'Top Gear', defaultCats: ['auto'] },
  { id: 'en_95', lang: 'en', group: 'Svetové (EN)', url: 'https://www.skysports.com/rss/12040', name: 'Sky Sports', defaultCats: ['sport'] },
  { id: 'en_96', lang: 'en', group: 'Svetové (EN)', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPUrr&size=30', name: 'Fox Sports', defaultCats: ['sport'] },
  { id: 'en_97', lang: 'en', group: 'Svetové (EN)', url: 'https://www.medicalnewstoday.com/feed', name: 'Medical News Today', defaultCats: ['zdravie'] },
  { id: 'en_98', lang: 'en', group: 'Svetové (EN)', url: 'https://www.sciencedaily.com/rss/all.xml', name: 'ScienceDaily', defaultCats: ['tech', 'zdravie'] },
  { id: 'en_99', lang: 'en', group: 'Svetové (EN)', url: 'https://www.technologyreview.com/feed/', name: 'MIT Tech Review', defaultCats: ['tech'] },
  { id: 'en_100', lang: 'en', group: 'Svetové (EN)', url: 'https://www.cbc.ca/cmlink/rss-world', name: 'CBC News', defaultCats: ['svet'] }
];

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
             || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function extractCategories(itemXml) {
  const matches = itemXml.matchAll(/<category[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/gi);
  const cats = [];
  for (const m of matches) {
    const val = cleanHtml(m[1]).toLowerCase().trim();
    if (val) cats.push(val);
  }
  return cats;
}

function extractImage(itemXml) {
  const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (encMatch) return encMatch[1];

  const mediaMatch = itemXml.match(/<(?:media:content|media:thumbnail)[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (mediaMatch) return mediaMatch[1];

  const imgTagMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgTagMatch) return imgTagMatch[1];

  return '';
}

function cleanHtml(str) {
  return (str || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

async function fetchFeed(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const xml = await res.text();
    const items = [];
    const itemRegex = /<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const itemXml = match[0];
      const rawTitle = extractTag(itemXml, 'title');
      const title = cleanHtml(rawTitle);
      const linkMatch = itemXml.match(/<link[^>]*href=["']([^"']+)["']/i) || itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const link = linkMatch ? (linkMatch[1] || '').trim() : '';
      const dateStr = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'published') || extractTag(itemXml, 'updated') || extractTag(itemXml, 'dc:date');
      const desc = cleanHtml(extractTag(itemXml, 'description') || extractTag(itemXml, 'summary') || extractTag(itemXml, 'content'));
      const image = extractImage(itemXml);
      const categories = extractCategories(itemXml);

      if (title && link) {
        items.push({
          title,
          link,
          description: desc.slice(0, 220),
          image,
          sourceId: source.id,
          sourceName: source.name,
          sourceDefaultCats: source.defaultCats || [],
          categories,
          lang: source.lang,
          pubDate: dateStr ? new Date(dateStr).getTime() : Date.now()
        });
      }
    }
    return items;
  } catch (err) {
    return [];
  }
}

async function run() {
  const BATCH_SIZE = 25;
  let allArticles = [];

  for (let i = 0; i < SOURCES.length; i += BATCH_SIZE) {
    const batch = SOURCES.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(fetchFeed));
    results.forEach(items => allArticles.push(...items));
  }

  const map = new Map();
  allArticles.forEach(a => {
    if (!map.has(a.link)) {
      map.set(a.link, a);
    }
  });

  const uniqueArticles = Array.from(map.values())
    .filter(a => !isNaN(a.pubDate))
    .sort((a, b) => b.pubDate - a.pubDate)
    .slice(0, 10000);

  const payload = {
    updatedAt: Date.now(),
    count: uniqueArticles.length,
    articles: uniqueArticles
  };

  const outputPath = path.join(__dirname, '..', 'feed.json');
  fs.writeFileSync(outputPath, JSON.stringify(payload));
}

run();
