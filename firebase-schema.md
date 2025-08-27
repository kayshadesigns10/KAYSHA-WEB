# Firebase Firestore Database Schema

## Collections Structure

### Products Collection: `products`

```javascript
{
  name: "Classic Pinstripe Suit***",
  descriptionSuits: "Elegant pinstripe suit for professional women",
  sellingPrice: 229,
  discountedPrice: 199,
  category: "Suits",
  subCategory: "Professional",
  size: ["XS", "S", "M", "L", "XL"],
  bestSellerNumber: 45,
  mainImageLink: "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID",
  images: [
    "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_1",
    "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_2"
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Suits Collection: `suits`

```javascript
{
  productId: "product_document_id",
  suitsId: "SUIT_001",
  sold: 15,
  price: 199,
  size: "M",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## How to Add Products in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Create collection `products`
3. Add documents with the above structure
4. Use Google Drive direct links for images:
   - Format: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`
   - For videos: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

## Google Drive Image Setup

1. Upload images to Google Drive
2. Right-click → Share → Anyone with link can view
3. Copy the file ID from the URL: `https://drive.google.com/file/d/FILE_ID/view`
4. Use format: `https://drive.google.com/uc?export=view&id=FILE_ID`

## Benefits

- ✅ No code changes needed to update products
- ✅ Real-time updates
- ✅ Automatic sorting by bestSellerNumber
- ✅ Analytics tracking included
- ✅ Fast loading with fallback data
