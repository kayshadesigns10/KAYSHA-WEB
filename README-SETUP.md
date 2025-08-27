# Kaysha Styles - Setup Instructions

## 🚀 Quick Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 2. Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema in `supabase-schema.sql` in your Supabase SQL editor
3. Add your Supabase URL and anon key to `.env`

### 3. Firebase Analytics Setup
1. Create a Firebase project
2. Enable Analytics
3. Get your Firebase config and add to `.env`

### 4. WhatsApp/Instagram Configuration
Update the contact details in `src/services/orderService.ts`:
- `WHATSAPP_NUMBER`: Your WhatsApp business number
- `INSTAGRAM_USERNAME`: Your Instagram handle

## 📊 Database Management

### Adding Products
You can manage products directly in Supabase dashboard or create an admin panel.

**Sample SQL to add a product:**
```sql
INSERT INTO products (name, selling_price, discounted_price, category, size, main_image_link, images) 
VALUES ('New Suit', 299.00, 249.00, 'Suits', ARRAY['S', 'M', 'L'], 'https://your-image-url.com', ARRAY['https://your-image-url.com']);
```

### Google Drive Assets
To use Google Drive images:
1. Make files public in Google Drive
2. Use this format: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`
3. For videos: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

## 🛒 Features Implemented

- ✅ Dynamic product loading from Supabase
- ✅ Shopping cart with local storage
- ✅ Buy Now & Add to Cart functionality
- ✅ WhatsApp/Instagram order integration
- ✅ Firebase Analytics tracking
- ✅ Responsive product cards with size selection
- ✅ Discount display and pricing
- ✅ Loading states and error handling

## 📱 Order Flow

1. **Buy Now**: Sends individual product details to WhatsApp/Instagram
2. **Cart**: Sends all cart items as a single order
3. **Fallback**: If WhatsApp fails, automatically tries Instagram
4. **Analytics**: Tracks all user interactions

## 🔧 Customization

- Update product data in Supabase dashboard
- Change WhatsApp/Instagram details in `orderService.ts`
- Modify styling in component files
- Add new product categories in database