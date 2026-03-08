# File Upload API Documentation

**Date:** March 8, 2026  
**Status:** ✅ COMPLETED  

---

## 📋 Overview

Complete file upload API system supporting **direct S3 uploads using presigned URLs**. Users get a presigned URL and upload directly to S3, then register the file in the database. This approach reduces backend load and improves upload speed.

---

## 🔄 Upload Flow

```
1. Frontend → GET /presigned-url → Backend
   ↓
   Backend generates presigned URL and S3 key
   ↓
2. Frontend → PUT <presignedUrl> (file) → S3
   ↓
   S3 stores file directly (no backend involvement)
   ↓
3. Frontend → POST /register (s3Key, fileSize) → Backend
   ↓
   Backend creates database record with S3 URL
```

**Advantages:**
- ✅ **Faster uploads** - Files go directly to S3
- ✅ **Reduced backend load** - No streaming through server
- ✅ **Better scalability** - Can handle concurrent uploads
- ✅ **Resumable uploads** - S3 supports retry mechanisms
- ✅ **Chunked uploads** - Use multipart upload for large files

---

## 🌐 API Endpoints

### 1. **Get Presigned Upload URL**
```
POST /api/v1/files/presigned-url
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/files/presigned-url \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "originalFilename": "document.pdf",
    "contentType": "application/pdf",
    "folder": "documents",
    "expiresIn": 3600
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Presigned URL generated successfully",
  "data": {
    "presignedUrl": "https://bucket.s3.us-east-1.amazonaws.com/uploads/documents/...?X-Amz-Algorithm=...",
    "s3Key": "uploads/documents/1648896000000-abc123-document.pdf",
    "bucket": "my-bucket"
  }
}
```

**Request Body:**
```typescript
{
  originalFilename: string;      // Required: filename with extension
  contentType: string;           // Required: MIME type (e.g., application/pdf)
  folder?: string;               // Optional: S3 folder (default: "assets")
  expiresIn?: number;            // Optional: URL expiration in seconds (default: 3600)
}
```

---

### 2. **Upload File Directly to S3**

After getting the presigned URL, upload the file directly to S3:

```
PUT <presignedUrl>
Content-Type: application/pdf
```

**Request (JavaScript/axios):**
```javascript
const response = await axios.post(
  'http://localhost:3001/api/v1/files/presigned-url',
  {
    originalFilename: 'document.pdf',
    contentType: 'application/pdf',
    folder: 'documents'
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

const { presignedUrl, s3Key } = response.data.data;

// Upload file directly to S3
const file = document.getElementById('fileInput').files[0];
await axios.put(presignedUrl, file, {
  headers: { 'Content-Type': file.type }
});

// Register file in database
await axios.post(
  'http://localhost:3001/api/v1/files/register',
  {
    productId: 'product-uuid',
    s3Key: s3Key,
    fileSize: file.size
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

**Response from S3:**
- Status: 200 OK (file uploaded successfully)
- No JSON response body (just HTTP status)

---

### 3. **Register File in Database**
```
POST /api/v1/files/register
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/files/register \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "s3Key": "uploads/documents/1648896000000-abc123-document.pdf",
    "fileSize": 2048576
  }'
```

**Response (201 CREATED):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "File registered successfully",
  "data": {
    "id": "file-uuid",
    "productId": "product-uuid",
    "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/uploads/documents/...",
    "fileSize": 2048576,
    "createdAt": "2026-03-08T10:00:00Z",
    "updatedAt": "2026-03-08T10:00:00Z"
  }
}
```

**Request Body:**
```typescript
{
  productId: string;    // Required: UUID of product
  s3Key: string;       // Required: S3 key from presigned URL response
  fileSize: number;    // Required: File size in bytes
}
```

---

### 4. **Get Product Files**
```
GET /api/v1/files/products/:productId
```

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/files/products/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product files retrieved successfully",
  "data": [
    {
      "id": "file-uuid-1",
      "productId": "product-uuid",
      "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/...",
      "fileSize": 2048576,
      "createdAt": "2026-03-08T10:00:00Z",
      "updatedAt": "2026-03-08T10:00:00Z"
    }
  ]
}
```

---

### 5. **Get File Info**
```
GET /api/v1/files/:fileId
```

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/files/file-uuid-1
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File info retrieved successfully",
  "data": {
    "id": "file-uuid-1",
    "productId": "product-uuid",
    "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/...",
    "fileSize": 2048576,
    "createdAt": "2026-03-08T10:00:00Z",
    "updatedAt": "2026-03-08T10:00:00Z"
  }
}
```

---

### 6. **Get Download URL** (Signed)
```
GET /api/v1/files/:fileId/download
Authorization: Bearer <token>

Query Parameters:
  - expiresIn (optional): URL expiration time in seconds (60-86400, default: 3600)
```

**Request:**
```bash
curl -X GET "http://localhost:3001/api/v1/files/file-uuid-1/download?expiresIn=7200" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Download URL generated successfully",
  "data": {
    "downloadUrl": "https://bucket.s3.us-east-1.amazonaws.com/uploads/documents/...?X-Amz-Signature=..."
  }
}
```

---

### 7. **Delete File**
```
DELETE /api/v1/files/:fileId
Authorization: Bearer <token>
```

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/files/file-uuid-1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File deleted successfully"
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# File Upload Settings
MAX_FILE_SIZE=52428800          # 50MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx,txt,zip,mp4,webm
```

### S3 Setup

1. Create an S3 bucket in AWS
2. Configure bucket CORS for file access
3. Set appropriate bucket policies
4. Get AWS credentials (Access Key ID & Secret Access Key)
5. Add credentials to environment variables

**S3 CORS Configuration (cors.json):**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**Bucket Policy (allows PUT from presigned URLs):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPresignedUpload",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::your-bucket-name/uploads/*",
      "Condition": {
        "StringLike": {
          "aws:x-amz-date": "*"
        }
      }
    },
    {
      "Sid": "AllowGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/uploads/*"
    }
  ]
}
```

---

## 📊 File Validation

### Supported File Types

| Extension | MIME Type | Use Case |
|-----------|-----------|----------|
| `.jpg` | `image/jpeg` | Product images |
| `.jpeg` | `image/jpeg` | Product images |
| `.png` | `image/png` | Product images, covers |
| `.pdf` | `application/pdf` | Documents, guides |
| `.doc` | `application/msword` | Documents |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Documents |
| `.txt` | `text/plain` | Text files |
| `.zip` | `application/zip` | Archives |
| `.mp4` | `video/mp4` | Videos |
| `.webm` | `video/webm` | Videos |

### Validation Rules

1. **File Type:** Must match configured allowed types
2. **MIME Type:** Must correspond to file extension
3. **File Size:** Max 50MB (configurable via `MAX_FILE_SIZE`)
4. **Presigned URL:** Expires in 1 hour by default (configurable)

### Error Responses

**400 Bad Request - Invalid File Type:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "File type .exe is not allowed. Allowed types: jpg, jpeg, png, pdf, doc, docx"
}
```

**400 Bad Request - MIME Type Mismatch:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "MIME type application/octet-stream does not match file extension .pdf"
}
```

**400 Bad Request - File Not Found in S3:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "File not found in S3. Make sure file was uploaded successfully."
}
```

---

## 🔐 Security Features

### Access Control
- ✅ Authentication required for presigned URL generation
- ✅ Authentication required for file registration
- ✅ Presigned URLs have time-based expiration
- ✅ File validation at both frontend and backend

### URL Security
- ✅ Presigned URLs are signed with AWS credentials
- ✅ URLs expire (default: 1 hour, max: 24 hours)
- ✅ Request signature prevents tampering
- ✅ File type validated before S3 acceptance

### File Validation
- ✅ MIME type verification
- ✅ File size validation (frontend + backend)
- ✅ Extension whitelist validation
- ✅ S3 key sanitization (special chars removed)

---

## 💾 Database Schema

### ProductFile Model

```typescript
table product_files {
  id        uuid primary key
  productId uuid (foreign key to products)
  fileUrl   string (S3 URL)
  fileSize  bigint (bytes)
  createdAt timestamp
  updatedAt timestamp
  
  indexes:
    - productId
}
```

---

## 🧪 Complete Example

### React Component Example

```javascript
import axios from 'axios';
import { useState } from 'react';

export function FileUploader({ productId, token }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);

      // Step 1: Get presigned URL
      const presignedResponse = await axios.post(
        'http://localhost:3001/api/v1/files/presigned-url',
        {
          originalFilename: file.name,
          contentType: file.type,
          folder: 'products'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { presignedUrl, s3Key } = presignedResponse.data.data;
      console.log('Presigned URL:', presignedUrl);

      // Step 2: Upload file directly to S3
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentComplete = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentComplete);
        }
      });

      console.log('File uploaded to S3');

      // Step 3: Register file in database
      const registerResponse = await axios.post(
        'http://localhost:3001/api/v1/files/register',
        {
          productId,
          s3Key,
          fileSize: file.size
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('File registered:', registerResponse.data.data);
      alert('File uploaded successfully!');

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        disabled={uploading}
      />
      {uploading && <progress value={progress} max={100} />}
    </div>
  );
}
```

---

## 🧪 Testing Examples

### Test Case 1: Complete Upload Flow
```bash
# 1. Get presigned URL
PRESIGNED=$(curl -X POST http://localhost:3001/api/v1/files/presigned-url \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalFilename": "guide.pdf",
    "contentType": "application/pdf",
    "folder": "documents"
  }')

URL=$(echo $PRESIGNED | jq -r '.data.presignedUrl')
KEY=$(echo $PRESIGNED | jq -r '.data.s3Key')
echo "Presigned URL: $URL"
echo "S3 Key: $KEY"

# 2. Upload file to S3
curl -X PUT "$URL" \
  -H "Content-Type: application/pdf" \
  --data-binary @guide.pdf

# 3. Register file
curl -X POST http://localhost:3001/api/v1/files/register \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"product-uuid\",
    \"s3Key\": \"$KEY\",
    \"fileSize\": $(stat -f%z guide.pdf)
  }"
```

### Test Case 2: File Validation
```bash
# Invalid file type
curl -X POST http://localhost:3001/api/v1/files/presigned-url \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalFilename": "malware.exe",
    "contentType": "application/x-msdownload"
  }'
# Expected: 400 Bad Request - File type not allowed

# MIME type mismatch
curl -X POST http://localhost:3001/api/v1/files/presigned-url \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalFilename": "document.pdf",
    "contentType": "text/plain"
  }'
# Expected: 400 Bad Request - MIME type mismatch
```

---

## 📁 File Structure

```
src/
├── modules/
│   └── file-upload/
│       ├── s3.service.ts              # S3 operations
│       ├── file-upload.service.ts     # Business logic
│       ├── file-upload.controller.ts  # HTTP handlers
│       └── file-upload.routes.ts      # Route definitions
├── validators/
│   └── file-upload.validator.ts       # Joi schemas
└── config/
    └── environment.ts                 # S3 configuration
```

---

## 🚀 Integration Guide

### 1. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Add Routes to Main App

```typescript
// src/app.ts
import fileUploadRoutes from '@modules/file-upload/file-upload.routes';

app.use('/api/v1/files', fileUploadRoutes);
```

### 3. Configure Environment

```bash
# .env
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
S3_BUCKET_NAME=my-bucket
```

---

## 📊 Performance Considerations

### Presigned URL Benefits

1. **Reduced Backend Load**
   - No file streaming through server memory
   - S3 handles bandwidth

2. **Faster Uploads**
   - Direct S3 connection
   - No intermediate proxy

3. **Better Scalability**
   - Concurrent uploads to S3
   - Backend resources freed

4. **Resumable Uploads**
   - S3 multipart upload support
   - Retry on failure

### Optimization Tips

1. **Frontend**
   - Validate file before requesting presigned URL
   - Show progress using `onUploadProgress`
   - Implement retry logic

2. **S3**
   - Use CloudFront CDN for distribution
   - Enable S3 Transfer Acceleration
   - Configure lifecycle policies for old files

3. **Backend**
   - Cache S3 keys for fast lookup
   - Archive file metadata quarterly
   - Monitor presigned URL generation

---

## ⚠️ Flow Differences from Traditional Upload

### Traditional Flow (Backend Handles File)
```
Frontend → POST file → Backend → PUT S3 → Response
(Backend temporarily holds file in memory)
```

### Presigned URL Flow (Direct to S3)
```
Frontend → GET presigned URL → Backend
Frontend → PUT file → S3
Frontend → POST register → Backend (metadata only)
(No file data on backend)
```

---

✅ **All endpoints are ready for use with direct S3 upload flow!**

### 1. **Upload Product File**
```
POST /api/v1/files/products/:productId
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
  - file: <binary file>
```

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/files/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@./document.pdf"
```

**Response (201 CREATED):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "File uploaded successfully",
  "data": {
    "id": "file-uuid",
    "productId": "product-uuid",
    "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/uploads/products/...",
    "fileSize": 2048576,
    "createdAt": "2026-03-08T10:00:00Z",
    "updatedAt": "2026-03-08T10:00:00Z"
  }
}
```

---

### 2. **Generic File Upload**
```
POST /api/v1/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Query Parameters:
  - folder (optional): Upload folder (default: "assets")

Body:
  - file: <binary file>
```

**Request:**
```bash
curl -X POST "http://localhost:3001/api/v1/files/upload?folder=covers" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@./cover.png"
```

**Response (201 CREATED):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://bucket.s3.us-east-1.amazonaws.com/uploads/covers/...",
    "key": "uploads/covers/1648896000000-abc123-cover.png"
  }
}
```

---

### 3. **Bulk File Upload**
```
POST /api/v1/files/bulk
Authorization: Bearer <token>
Content-Type: multipart/form-data

Query Parameters:
  - folder (optional): Upload folder (default: "assets")

Body:
  - files: <multiple binary files> (max 10)
```

**Request:**
```bash
curl -X POST "http://localhost:3001/api/v1/files/bulk?folder=documents" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "files=@./doc1.pdf" \
  -F "files=@./doc2.pdf" \
  -F "files=@./doc3.docx"
```

**Response (201 CREATED):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "3 file(s) uploaded successfully",
  "data": [
    {
      "url": "https://bucket.s3.us-east-1.amazonaws.com/uploads/documents/...",
      "key": "uploads/documents/1648896000000-abc123-doc1.pdf"
    },
    {
      "url": "https://bucket.s3.us-east-1.amazonaws.com/uploads/documents/...",
      "key": "uploads/documents/1648896000001-def456-doc2.pdf"
    },
    {
      "url": "https://bucket.s3.us-east-1.amazonaws.com/uploads/documents/...",
      "key": "uploads/documents/1648896000002-ghi789-doc3.docx"
    }
  ]
}
```

---

### 4. **Get Product Files**
```
GET /api/v1/files/products/:productId
```

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/files/products/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product files retrieved successfully",
  "data": [
    {
      "id": "file-uuid-1",
      "productId": "product-uuid",
      "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/...",
      "fileSize": 2048576,
      "createdAt": "2026-03-08T10:00:00Z",
      "updatedAt": "2026-03-08T10:00:00Z"
    },
    {
      "id": "file-uuid-2",
      "productId": "product-uuid",
      "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/...",
      "fileSize": 1024000,
      "createdAt": "2026-03-08T10:05:00Z",
      "updatedAt": "2026-03-08T10:05:00Z"
    }
  ]
}
```

---

### 5. **Get File Info**
```
GET /api/v1/files/:fileId
```

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/files/file-uuid-1
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File info retrieved successfully",
  "data": {
    "id": "file-uuid-1",
    "productId": "product-uuid",
    "fileUrl": "https://bucket.s3.us-east-1.amazonaws.com/...",
    "fileSize": 2048576,
    "createdAt": "2026-03-08T10:00:00Z",
    "updatedAt": "2026-03-08T10:00:00Z"
  }
}
```

---

### 6. **Get Download URL** (Signed)
```
GET /api/v1/files/:fileId/download
Authorization: Bearer <token>

Query Parameters:
  - expiresIn (optional): URL expiration time in seconds (60-86400, default: 3600)
```

**Request:**
```bash
curl -X GET "http://localhost:3001/api/v1/files/file-uuid-1/download?expiresIn=7200" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Download URL generated successfully",
  "data": {
    "downloadUrl": "https://bucket.s3.us-east-1.amazonaws.com/...?X-Amz-Signature=..."
  }
}
```

---

### 7. **Delete File**
```
DELETE /api/v1/files/:fileId
Authorization: Bearer <token>
```

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/files/file-uuid-1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File deleted successfully"
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# File Upload Settings
MAX_FILE_SIZE=52428800          # 50MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx,txt,zip,mp4,webm
```

### S3 Setup

1. Create an S3 bucket in AWS
2. Configure bucket CORS for file access
3. Set appropriate bucket policies
4. Get AWS credentials (Access Key ID & Secret Access Key)
5. Add credentials to environment variables

**Recommended bucket policy for public asset access:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/uploads/assets/*"
    },
    {
      "Sid": "AllowUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

## 📊 File Validation

### Supported File Types

| Extension | MIME Type | Use Case |
|-----------|-----------|----------|
| `.jpg` | `image/jpeg` | Product images |
| `.jpeg` | `image/jpeg` | Product images |
| `.png` | `image/png` | Product images, covers |
| `.pdf` | `application/pdf` | Documents, guides |
| `.doc` | `application/msword` | Documents |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Documents |
| `.txt` | `text/plain` | Text files |
| `.zip` | `application/zip` | Archives |
| `.mp4` | `video/mp4` | Videos |
| `.webm` | `video/webm` | Videos |

### Validation Rules

1. **File Size:** Max 50MB (configurable via `MAX_FILE_SIZE`)
2. **File Type:** Must match configured allowed types
3. **MIME Type:** Must correspond to file extension
4. **File Count (Bulk):** Max 10 files per request

### Error Responses

**400 Bad Request - Invalid File Type:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "File type .exe is not allowed. Allowed types: jpg, jpeg, png, pdf, doc, docx"
}
```

**400 Bad Request - File Too Large:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "File size exceeds maximum limit of 50MB"
}
```

**400 Bad Request - MIME Type Mismatch:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "MIME type application/octet-stream does not match file extension .pdf"
}
```

---

## 🔐 Security Features

### Access Control
- ✅ Authentication required for uploads and downloads
- ✅ Private files use S3 CORS restrictions
- ✅ Signed URLs with time-based expiration for private files

### File Validation
- ✅ MIME type verification
- ✅ File size limits enforced
- ✅ Extension whitelist validation
- ✅ S3 key sanitization (special chars removed)

### Storage
- ✅ Files stored in S3 (scalable, reliable)
- ✅ Database stores metadata only
- ✅ Unique filenames prevent collisions

---

## 💾 Database Schema

### ProductFile Model

```typescript
table products_files {
  id                uuid primary key
  productId         uuid (foreign key to products)
  fileUrl           string (S3 URL)
  fileSize          bigint (bytes)
  createdAt         timestamp
  updatedAt         timestamp
  
  indexes:
    - productId
}
```

---

## 🧪 Testing Examples

### Test Case 1: Upload and Download Product File
```bash
# 1. Upload file
RESPONSE=$(curl -X POST http://localhost:3001/api/v1/files/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@./guide.pdf")

FILE_ID=$(echo $RESPONSE | jq -r '.data.id')
echo "Uploaded file ID: $FILE_ID"

# 2. Get signed download URL
curl -X GET "http://localhost:3001/api/v1/files/$FILE_ID/download" \
  -H "Authorization: Bearer TOKEN"

# 3. Download using signed URL (in browser or curl)
curl -o downloaded-guide.pdf "SIGNED_URL_FROM_STEP_2"
```

### Test Case 2: Bulk Upload Assets
```bash
curl -X POST "http://localhost:3001/api/v1/files/bulk?folder=covers" \
  -H "Authorization: Bearer TOKEN" \
  -F "files=@./cover1.png" \
  -F "files=@./cover2.png" \
  -F "files=@./cover3.jpg"
```

### Test Case 3: Error Handling
```bash
# Invalid file type
curl -X POST http://localhost:3001/api/v1/files/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@./malware.exe"
# Expected: 400 Bad Request - File type not allowed

# File too large
curl -X POST http://localhost:3001/api/v1/files/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@./huge-file-100gb.iso"
# Expected: 400 Bad Request - File size exceeds limit
```

---

## 📁 File Structure

```
src/
├── modules/
│   └── file-upload/
│       ├── s3.service.ts              # S3 operations
│       ├── file-upload.service.ts     # Business logic
│       ├── file-upload.controller.ts  # HTTP handlers
│       └── file-upload.routes.ts      # Route definitions
├── validators/
│   └── file-upload.validator.ts       # Joi schemas
└── config/
    └── environment.ts                 # S3 configuration
```

---

## 🚀 Integration Guide

### 1. Add to Main Express App

```typescript
// src/app.ts
import fileUploadRoutes from '@modules/file-upload/file-upload.routes';

app.use('/api/v1/files', fileUploadRoutes);
```

### 2. Install Required Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer
npm install --save-dev @types/multer
```

### 3. Set Environment Variables

```bash
# .env
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
AWS_REGION=us-east-1
S3_BUCKET_NAME=my-bucket
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx,txt,zip,mp4,webm
```

### 4. Create S3 Bucket & Configure

```bash
# Create S3 bucket
aws s3 mb s3://my-bucket --region us-east-1

# Enable versioning (recommended)
aws s3api put-bucket-versioning \
  --bucket my-bucket \
  --versioning-configuration Status=Enabled

# Configure CORS
aws s3api put-bucket-cors \
  --bucket my-bucket \
  --cors-configuration file://cors.json
```

---

## 📊 Performance Considerations

### Optimization Tips

1. **Multer Settings**
   - Use memory storage for small files (< 5MB)
   - Consider streaming for large files

2. **S3 Configuration**
   - Enable S3 CloudFront for CDN caching
   - Use S3 Transfer Acceleration for faster uploads
   - Enable S3 Intelligent-Tiering for cost optimization

3. **Database
   - Index productId for fast lookups
   - Archive old file metadata quarterly
   - Consider S3 Glacier for archival

### Scaling

- **Parallel uploads:** Leverage S3 multipart upload for files > 100MB
- **Batch operations:** Use bulk upload endpoint for multiple files
- **Caching:** CloudFront CDN for public assets
- **Versioning:** S3 versioning for file history

---

## 🐛 Troubleshooting

### Common Issues

**S3 credentials not configured:**
```
Error: S3 credentials are not configured
Solution: Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME env vars
```

**CORS errors when accessing S3:**
```
Error: Cross-Origin Request Blocked
Solution: Configure S3 bucket CORS policy (see Configuration section)
```

**File upload timeout:**
```
Error: Request timeout
Solution: Increase multer limits in fileUploadRoutes.ts
```

**Signed URL expired:**
```
Error: Access Denied
Solution: Regenerate signed URL with getDownloadUrl endpoint
```

---

## ✅ Verification Checklist

- ✅ S3 service configured with AWS credentials
- ✅ File validators check size, type, MIME
- ✅ Multer middleware handles file uploads
- ✅ Files stored in S3 with unique keys
- ✅ Metadata stored in ProductFile table
- ✅ Signed URLs generated for private file access
- ✅ Bulk upload supports up to 10 files
- ✅ Error handling covers all edge cases
- ✅ TypeScript compilation successful

---

## 📝 Next Steps

1. **Extend file storage** - Support DigitalAsset model for page assets
2. **Add image processing** - Generate thumbnails, resize images
3. **Implement virus scanning** - ClamAV or VirusTotal integration
4. **Add download tracking** - Log file downloads for analytics
5. **Setup backup** - Cross-region S3 replication
6. **Configure CDN** - CloudFront for faster distribution
7. **Add compression** - Compress assets before upload
8. **Implement cleanup** - Scheduled deletion of unused files
