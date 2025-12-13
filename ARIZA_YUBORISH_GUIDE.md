# Ariza Yuborish - To'liq Qo'llanma

## ✅ Bajarilgan Ishlar

### 1. FormData To'g'ri Yuborish
- **Interceptor tuzatildi**: FormData uchun `Content-Type` avtomatik o'rnatiladi
- **API service yangilandi**: Faqat valid File obyektlar yuboriladi
- **Debug logging qo'shildi**: Barcha yuborilayotgan ma'lumotlar console da ko'rinadi

### 2. Validatsiya
- **User ID tekshiruvi**: Foydalanuvchi tizimga kirganligini ta'minlaydi
- **Dormitory ID tekshiruvi**: Yotoqxona ID si to'g'ri parse qilinganligini tekshiradi
- **Province va District tekshiruvi**: Viloyat va tuman ID lari mavjudligini tekshiradi
- **Phone validatsiya**: 998 bilan boshlanuvchi 12 raqamli telefon
- **Passport validatsiya**: AA1234567 formatida (2 harf + 7 raqam)

### 3. FormData Strukturasi

#### Majburiy Maydonlar:
```javascript
{
  user: number,              // Foydalanuvchi ID
  dormitory: number,         // Yotoqxona ID
  name: string,             // Ism
  province: number,         // Viloyat ID
  city: number,             // Tuman/Shahar ID
  course: string            // Kurs (1-kurs, 2-kurs, ...)
}
```

#### Ixtiyoriy Maydonlar:
```javascript
{
  last_name?: string,                    // Familiya
  middle_name?: string,                  // Otasining ismi
  faculty?: string,                      // Fakultet
  direction?: string,                    // Yo'nalish
  group?: string,                        // Guruh
  phone?: number,                        // Telefon (998901234567)
  passport?: string,                     // Pasport (AA1234567)
  comment?: string,                      // Izoh
  user_image?: File,                     // Foydalanuvchi rasmi
  document?: File,                       // Qo'shimcha hujjat
  passport_image_first?: File,           // Pasport 1-bet
  passport_image_second?: File           // Pasport 2-bet
}
```

## 🔧 Texnik Tafsilotlar

### API Endpoint
```
POST https://joyborv1.pythonanywhere.com/api/applications/create/
```

### Headers
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data; boundary=...
```

### Request Interceptor
```typescript
api.interceptors.request.use((config) => {
  // Add auth token
  const accessToken = sessionStorage.getItem('access');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  // Don't set Content-Type for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});
```

## 🐛 Debug Qilish

### Console Logs
Development rejimida quyidagi loglar ko'rinadi:

```
=== ARIZA YUBORISH DEBUG ===
Original data: { user: 1, dormitory: 2, name: "Ali", ... }

FormData entries:
  user: 1
  dormitory: 2
  name: Ali
  province: 2
  city: 3
  course: 1-kurs
  user_image: File(photo.jpg, 12345 bytes, image/jpeg)
  ...

FormData summary: { ... }
=== END DEBUG ===
```

### Xato Xabarlari
Agar xato yuz bersa:

```
=== ARIZA YUBORISH XATOSI ===
Status: 500
Status Text: Internal Server Error
Error Message: Request failed with status code 500
Server Response: <!doctype html>...
=== END XATO ===
```

## 📝 Foydalanish

### 1. Yotoqxona Tanlash
- Yotoqxonalar sahifasiga o'ting
- Yotoqxona kartasida "Ariza" tugmasini bosing

### 2. Forma To'ldirish
- **Majburiy maydonlar**:
  - Ism
  - Viloyat
  - Tuman
  - Kurs
  
- **Ixtiyoriy maydonlar**:
  - Familiya, Otasining ismi
  - Fakultet, Yo'nalish, Guruh
  - Telefon, Pasport
  - Rasmlar va hujjatlar

### 3. Yuborish
- "Ariza Yuborish" tugmasini bosing
- Muvaffaqiyatli yuborilsa, dashboard ga yo'naltiriladi

## ⚠️ Muhim Eslatmalar

1. **Fayllar**: Max 5MB, JPG/PNG/PDF formatida
2. **Telefon**: 998901234567 formatida (12 raqam)
3. **Pasport**: AA1234567 formatida (2 harf + 7 raqam)
4. **Autentifikatsiya**: Tizimga kirish talab etiladi
5. **Yotoqxona**: Avval yotoqxona tanlanishi kerak

## 🔍 Muammolarni Hal Qilish

### 500 Server Error
- FormData to'g'ri yuborilayotganini tekshiring
- Console loglarni ko'ring
- Barcha majburiy maydonlar to'ldirilganini tekshiring

### 401 Unauthorized
- Tizimga qaytadan kiring
- Access token mavjudligini tekshiring

### 400 Bad Request
- Maydon validatsiyasini tekshiring
- Telefon va pasport formatini tekshiring
- Province va district ID larini tekshiring

## ✨ Xususiyatlar

- ✅ Real-time validatsiya
- ✅ Auto-scroll to error fields
- ✅ File upload with preview
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states
- ✅ Success animations
- ✅ Detailed error messages
- ✅ Debug logging (development)

## 🚀 Tayyor!

Ariza yuborish tizimi to'liq ishlaydi va production uchun tayyor!
