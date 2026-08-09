# ADR-0007: Manuel Renk Kullanımının Yasaklanması ve Semantik Tasarım Token Sistemi

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex Frontend Mimarlık Ekibi

## Bağlam

Bileşenler içerisinde rastgele veya elle (ad-hoc) renk tanımları (`bg-slate-900`, `text-slate-600`, `gray-50`, `bg-black` vb.) kullanılması, tasarım tutarsızlıklarına, teknik borca ve kurumsal kimlik sapmalarına yol açmaktadır.

## Karar

1. **Manuel Renk Kullanımı Yasaklandı (STRICT AD-HOC COLOR BAN)**:
   - Hiçbir React/Next.js bileşeninde doğrudan elle gri, siyah veya ad-hoc renk sınıfları (`slate-*`, `gray-*`, `black`, `zinc-*`) kullanılamaz.
2. **Merkezi Semantik Token Zorunluluğu**:
   - Tüm renk atamaları `src/app/globals.css` içerisinde tanımlanan `--color-*` semantik CSS değişkenleri ve `.bg-white-token`, `.text-brand-token`, `.card-token`, `.btn-primary-token` gibi önceden belirlenmiş tasarım token sınıfları üzerinden yapılmalıdır.
3. **Kapsam**:
   - `Header`, `Footer`, `HomePage`, `AuthLayout` ve tüm alt sayfalar istisnasız bu kurala uymak zorundadır.

## Sonuçlar

- **%100 Tasarım Tutarlılığı**: Tüm vitrin tek merkezden yönetilen beyaz ve kurumsal mavi semantik token'lar ile derlenir.
- **Sıfır Teknik Borç**: Kod tabanına rastgele renk kirliliği girmesi engellenir.
- **Kolay Tema Yönetimi**: Gelecekteki tema veya marka rengi güncellemeleri yalnızca `globals.css` değişkenlerinden tek tıkla değiştirilebilir.
